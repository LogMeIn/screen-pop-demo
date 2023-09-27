import dotenv from "dotenv";
import { Logger } from "./logger";
import { NextFunction, Request, Response } from "express";
import cors from "cors";

dotenv.config();

export class Util {
  public static get hostname(): string {
    return process.env.HOSTNAME || "localhost";
  }

  public static get port(): number {
    return Number(process.env.PORT) || 8000;
  }

  public static get corsOptions(): cors.CorsOptions {
    return {
      origin: "http://127.0.0.1:5000",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    };
  }

  public static setupLogger(
    logger: Logger,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    logger.info(`METHOD: [${req.method}] - URL: [${req.url}]`);

    res.on("finish", () => {
      logger.info(
        `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`,
      );
    });

    next();
  }
}
