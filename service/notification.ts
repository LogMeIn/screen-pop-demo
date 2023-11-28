import { Logger } from "../config/logger";
import { ChannelRequest, ChannelResponse } from "../types/channel";
import { GoToApiService } from "../types/externalApi";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Request from "../types/request";
import { CustomPromise } from "../types/promise";

export default class NotificationChannelApi implements GoToApiService {
  private readonly channelNickname: string = "screen-pop-demo";
  private channel: ChannelRequest = new ChannelRequest();
  private demoChannelIdPromise?: CustomPromise<string>;
  private logger = new Logger("NOTIFICATION-CHANNEL");

  public async fetchData(token: string) {
    this.demoChannelIdPromise = new CustomPromise<string>(() => undefined);

    // [STEP3] Create a notification channel
    const response = await fetch(
      `https://api.goto.com/notification-channel/v1/channels/${this.channelNickname}`,
      this.channel.request(token),
    );
    if (response.status != StatusCodes.CREATED) {
      this.logger
        .error(`Error while creating notification channel, error status code: \
        [${response.status} (${getReasonPhrase(response.status)})]`);
      throw new Error("Failed to create notification channel");
    }
    this.logger.info("Channel has been created");
    const demoChannel: ChannelResponse =
      (await response.json()) as ChannelResponse;
    this.demoChannelIdPromise.resolve(demoChannel.channelId);
    return demoChannel;
  }

  public isCleanupNeeded(): boolean {
    return typeof this.demoChannelIdPromise !== "undefined";
  }

  public async cleanUpChannel(token: string) {
    if (this.demoChannelIdPromise) {
      this.logger.info(`Cleanup in progress...`);
      const response = await fetch(
        `https://api.goto.com/notification-channel/v1/channels/${
          this.channelNickname
        }/${await this.demoChannelIdPromise}`,
        Request.delete(token),
      );
      if (response.status == StatusCodes.NO_CONTENT) {
        this.logger.info("Channel was deleted");
      } else {
        this.logger.error(
          `Failed to delete channel with status ${response.status}`,
        );
      }
    } else {
      this.logger.info(`Channel was not created... skipping cleanup`);
    }
  }

  public async refreshChannel(token: string) {
    if (this.demoChannelIdPromise) {
      this.logger.info(`Refresh in progress...`);
      const response = await fetch(
        `https://api.goto.com/notification-channel/v1/channels/${
          this.channelNickname
        }/${await this.demoChannelIdPromise}`,
        this.channel.refresh(token),
      );
      if (response.status == StatusCodes.OK) {
        this.logger.info("Channel was refreshed successfully");
      } else {
        this.logger.error(
          `Failed to refresh channel with status ${response.status}`,
        );
      }
    } else {
      this.logger.info(`Channel was not created... skipping refresh`);
    }
  }
}
