import SubscriptionApi from "./subscription";
import { ChannelResponse } from "../types/channel";

import { GoToApiService } from "../types/externalApi";
import { SubscriptionRequest } from "../types/subscription";
import { CallEventsSubscriptionResponse } from "../types/callEvents";

export default class CallEventsResources implements GoToApiService {
  private notificationApi: GoToApiService;
  constructor(notificationApi: GoToApiService) {
    this.notificationApi = notificationApi;
  }

  private getSubscriptionApi(channel: ChannelResponse): SubscriptionApi {
    const subscriptionRequest: SubscriptionRequest = new SubscriptionRequest(
      channel.channelId,
    );
    return new SubscriptionApi(subscriptionRequest);
  }

  public async fetchData(
    token: string,
  ): Promise<CallEventsSubscriptionResponse> {
    const channel: ChannelResponse =
      await this.notificationApi.fetchData(token);
    await this.getSubscriptionApi(channel).fetchData(token);
    return { callEventsWebSocketURL: channel.channelData.channelURL };
  }
}
