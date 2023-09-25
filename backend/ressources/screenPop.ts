import { NextFunction, Request, Response } from "express";
import { BadRequest } from "http-errors";

import { Logger } from "../config/logger";
import SubscriptionApi from "../service/subscription";
import { ChannelResponse } from "../types/channel";

import { GoToApiService } from "../types/externalApi";
import { SubscriptionRequest, SubscriptionResponse } from "../types/subscription";

export default class ScreenPopRessources {
  private notificationApi: GoToApiService;
  logger: Logger = new Logger("screen-pop-ressources");
  private channel: ChannelResponse | undefined;

  constructor(notificationApi: GoToApiService) {
    this.notificationApi = notificationApi;
  }

  private token(req: Request): string | undefined {
      return req.headers.authorization ? req.headers.authorization : undefined;
  }

  private get subscription(): SubscriptionApi {
      const subscriptionRequest: SubscriptionRequest = new SubscriptionRequest(this.channel?.channelId || "")  
      return new SubscriptionApi(subscriptionRequest)
  }

  public ringingPopup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
      const token = this.token(req)
      if (token === undefined) {
        return Promise.reject(new BadRequest("Token is missing"));
    }
    return Promise.resolve(await this.notificationApi.fetchData(token))
      .then(async (channel: ChannelResponse) => {
          this.channel = channel;
        const subscriptionApi: SubscriptionApi = this.subscription;
        return Promise.resolve(await subscriptionApi.fetchData(token)).
        then((subscription: SubscriptionResponse) => {
            res.status(207).json(subscription);            
        })
      })
      .catch((error) => {
        res.status(error.statusCode? error.statusCode: 400).json({
            message: res.statusMessage
        });
      });
  };
}