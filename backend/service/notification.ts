import {
  BadRequest, Unauthorized,
} from "http-errors";
import { Logger } from "../config/logger";
import { ChannelRequest } from "../types/channel";
import { GoToApiService } from "../types/externalApi";

export default class NotificationChannelApi implements GoToApiService {
  private channelNickname: string = "screen-pop-demo"
  private channel: ChannelRequest;
  private logger = new Logger("notification-channel-service");

  constructor(channel: ChannelRequest) {
    this.channel = channel;
  }

  public async fetchData(token: string) {
    const response = await fetch(`https://api.dev.goto.com/notification-channel/v1/channels/${this.channelNickname}`, this.channel.request(token));
    if (response.status != 201) {
      if (response.status == 401) {
        return Promise.reject(new Unauthorized);
      }
      // Put error handling here
      return Promise.reject(new BadRequest(`Status is ${response.status} and error: ${response.text}`));
    }
    this.logger.info("Channel has been created")
    return response.json();
  }
}