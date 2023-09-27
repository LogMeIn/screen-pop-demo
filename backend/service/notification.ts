import { Logger } from "../config/logger";
import { ChannelRequest } from "../types/channel";
import { Code, HttpError, Status } from "../types/error";
import { GoToApiService } from "../types/externalApi";

export default class NotificationChannelApi implements GoToApiService {
  private channelNickname: string = "screen-pop-demo";
  private channel: ChannelRequest;
  private logger = new Logger("notification-channel-service");

  constructor(channel: ChannelRequest) {
    this.channel = channel;
  }

  public async fetchData(token: string) {
    const response = await fetch(
      `https://api.goto.com/notification-channel/v1/channels/${this.channelNickname}`,
      this.channel.request(token),
    );
    if (response.status != 201) {
      if (response.status == 401) {
        this.logger.error(`Insufficient scope for notification channel`);
        return new HttpError(
          Status.UNAUTHORIZED,
          Code.UNAUTHORIZED,
          `missing scopes in the token`,
        );
      }

      if (response.status == 403) {
        this.logger.error(`Token is missing for notification channel`);
        return new HttpError(
          Status.FORBIDDEN,
          Code.FORBIDDEN,
          `missing token in the token`,
        );
      }
      this.logger.error(`Bad request for notification channel`);
      return new HttpError(Status.BAD_REQUEST, Code.BAD_REQUEST, `Bad request`);
    }
    this.logger.info("Channel has been created");
    return response.json();
  }
}
