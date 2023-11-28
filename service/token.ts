import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import express, { Express } from "express";
import path from "path";
import qs from "qs";
import { IncomingMessage, Server, ServerResponse } from "http";
import { Logger } from "../config/logger";
import { CustomPromise } from "../types/promise";
import { StatusCodes } from "http-status-codes";

const OAUTH_AUTHORIZE_URI: string =
  "https://authentication.logmeininc.com/oauth/authorize";
const OAUTH_TOKEN_URI: string =
  "https://authentication.logmeininc.com/oauth/token";

// Must match the redirect URI defined for your GoTo OAuth client.
const OAUTH_REDIRECT_PORT: number = 5000;
const OAUTH_REDIRECT_ENDPOINT: string = "/app/redirect";
const OAUTH_REDIRECT_URI: string =
  "http://localhost:" + OAUTH_REDIRECT_PORT + OAUTH_REDIRECT_ENDPOINT;

const EXPIRATION_THRESHOLD: number = 1.0 / 3.0;

const html = {
  root: path.join(__dirname, "..", "..", "html"),
};

export class TokenFetcher {
  private requiredOauthScopes: string;
  private serverReadyPromise: CustomPromise<void>;
  private oauthTokenPromise: CustomPromise<void>;
  private authorizationNonce: string;
  private app: Express;
  private server: Server<typeof IncomingMessage, typeof ServerResponse>;
  private done: boolean;
  private refreshHandle: NodeJS.Timeout | null;
  private token: any;
  private logger = new Logger("TOKEN-HELPER");

  constructor(requiredOauthScopes: string) {
    this.requiredOauthScopes = requiredOauthScopes;
    this.serverReadyPromise = new CustomPromise<void>(() => undefined);
    this.oauthTokenPromise = new CustomPromise<void>(() => undefined);
    this.authorizationNonce = crypto.randomBytes(15).toString("hex");
    this.app = express();
    this.app.get("/", async (req, res) => this.rootHandler(req, res));
    this.app.get(OAUTH_REDIRECT_ENDPOINT, async (req, res) =>
      this.redirectHandler(req, res),
    );

    this.server = this.app.listen(OAUTH_REDIRECT_PORT);
    this.server.on("listening", () => this.serverReadyPromise.resolve());
    this.server.on("error", (e) => this.serverReadyPromise.reject(e));
    this.server.on("close", () =>
      this.logger.info("Token handler server is shutting down"),
    );
    this.done = false;
    this.refreshHandle = null;
    this.token = null;
  }

  async fetch(): Promise<void> {
    if (this.token) {
      return Promise.resolve();
    }

    const params = new URLSearchParams();
    params.append("response_type", "code");
    params.append("client_id", process.env.OAUTH_CLIENT_ID);
    params.append("redirect_uri", OAUTH_REDIRECT_URI);
    params.append("scope", this.requiredOauthScopes);
    params.append("state", this.authorizationNonce);

    await this.serverReadyPromise;

    await axios
      .request({
        method: "GET",
        url: OAUTH_AUTHORIZE_URI,
        params: params,
        maxRedirects: 0,
        validateStatus: (status: number) =>
          status == StatusCodes.MOVED_TEMPORARILY,
      })
      .then((response: AxiosResponse) => {
        console.log("");
        console.log("Open this URL in a browser to start the web application:");
        console.log("-------------------------------------------");
        console.log(response.headers.location);
        console.log("-------------------------------------------");
        console.log();
      })
      .catch((e: { response: { data: string } }) => {
        this.logger.error("Could not fetch OAuth token");
        if (e.response) {
          this.logger.error("OAuth server error response:\n" + e.response.data);
        }
        return this.oauthTokenPromise.reject(e);
      });

    return this.oauthTokenPromise;
  }

  async shutdown(): Promise<void> {
    if (this.done) {
      return;
    }
    this.done = true;

    if (this.server.listening) {
      this.server.close();
    }

    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
    }

    this.serverReadyPromise.resolve();
    this.oauthTokenPromise.resolve();
  }

  async performTokenRefresh(): Promise<void> {
    try {
      this.logger.info("Refreshing auth token");

      const refreshToken = this.token.refresh_token;
      const response = await axios.request({
        method: "POST",
        url: OAUTH_TOKEN_URI,
        headers: {
          Authorization: this.getBasicAuth(),
          Accept: "application/json",
        },
        data: qs.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      // Reuse the current refresh token if response doesn't provide one
      this.token = response.data;
      this.token.refresh_token = this.token.refresh_token || refreshToken;

      this.logger.info(`Refreshed auth token`);

      // Adjust for potentially changing expiration
      this.configureBackgroundTokenRefresh();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to refresh auth token [${error.message}]`);
      } else {
        this.logger.error("Failed to refresh auth token", error);
      }
    }
  }

  async getBearerAccessToken(): Promise<string> {
    await this.oauthTokenPromise.resolve();
    if (this.token) {
      return `Bearer ${this.token.access_token}`;
    }
    throw new Error("Undefined token");
  }

  private getBasicAuth(): string {
    const creds =
      process.env.OAUTH_CLIENT_ID + ":" + process.env.OAUTH_CLIENT_SECRET;
    return "Basic " + Buffer.from(creds).toString("base64");
  }

  private async redirectHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    this.logger.info("Handling auth redirection");
    try {
      res.set("Connection", "close");
      if (req.query.state == this.authorizationNonce) {
        const response = await axios.request({
          method: "POST",
          url: OAUTH_TOKEN_URI,
          headers: {
            Authorization: this.getBasicAuth(),
            Accept: "application/json",
          },
          data: qs.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: OAUTH_REDIRECT_URI,
            client_id: process.env.OAUTH_CLIENT_ID,
          }),
        });

        this.logger.info(`Authorized principal is ${response.data.principal}`);

        // Prevents keeping the authorization code in the address bar
        res.redirect("/");

        this.token = response.data;
        this.configureBackgroundTokenRefresh();

        this.oauthTokenPromise.resolve();
      } else {
        res.status(403);
        res.sendFile("not_authorized.html", html);
        this.oauthTokenPromise.reject(
          "Ignoring authorization code with unexpected state",
        );
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage =
          "Failed to exchange code for token: [" + error.message + "]";
        this.logger.error(errorMessage);
      } else {
        errorMessage = "Failed to exchange code for token: [" + error + "]";
        this.logger.error("Failed to exchange code for token", error);
      }
      res.status(403);
      res.sendFile("not_authorized.html", html);
      this.oauthTokenPromise.reject(errorMessage);
    }
  }

  private async rootHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    if (!this.token) {
      res.status(403);
      res.sendFile("not_authorized.html", html);
    } else {
      res.status(200);
      res.sendFile("index.html", html);
    }
  }

  private configureBackgroundTokenRefresh(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }

    const refreshToken = this.token.refresh_token;
    const expiresIn = this.token.expires_in;
    if (refreshToken && expiresIn > 0) {
      this.refreshHandle = setInterval(
        this.performTokenRefresh.bind(this),
        1000 * expiresIn * EXPIRATION_THRESHOLD,
      );
    } else {
      this.logger.info("Background token refresh cannot be enabled");
    }
  }
}
