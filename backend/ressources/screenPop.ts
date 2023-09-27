import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthorized } from "http-errors";

import { Logger } from "../config/logger";
import SubscriptionApi from "../service/subscription";
import { ChannelResponse } from "../types/channel";
import { Code, HttpError, Status } from "../types/error";

import { GoToApiService } from "../types/externalApi";
import { ScreenPopResponse } from "../types/screenPop";
import {
  SubscriptionRequest,
  SubscriptionResponse,
} from "../types/subscription";

export default class ScreenPopRessources {
  private notificationApi: GoToApiService;
  logger: Logger = new Logger("screen-pop-ressources");
  private channel: ChannelResponse | undefined;
  private response?: ScreenPopResponse;
  constructor(notificationApi: GoToApiService) {
    this.notificationApi = notificationApi;
  }

  private token(req: Request): string {
    return req.headers.authorization ? req.headers.authorization : "";
  }

  private get subscription(): SubscriptionApi {
    const subscriptionRequest: SubscriptionRequest = new SubscriptionRequest(
      this.channel?.channelId || "",
    );
    return new SubscriptionApi(subscriptionRequest);
  }

  public ringingPopup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const token = this.token(req);
    return Promise.resolve(await this.notificationApi.fetchData(token))
      .then(async (channel: ChannelResponse | HttpError) => {
        if (channel instanceof HttpError) {
          throw channel;
        }
        this.channel = channel;
        const subscriptionApi: SubscriptionApi = this.subscription;
        return Promise.resolve(await subscriptionApi.fetchData(token))
          .then(() => {
            this.response = { websocketUrl: channel.channelData.channelURL };
            res.status(201).json(this.response);
          })
          .catch((error: HttpError) => {
            res.status(error.code).json({
              message: error.message,
            });
          });
      })
      .catch((error: HttpError) => {
        res.status(error.code).json({
          message: error.message,
        });
      });
  };
}
