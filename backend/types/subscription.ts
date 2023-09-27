import Request from "./request";

interface Subscription {
  channelId?: string;
  accountKeys: Array<AccountKey>;
}

interface AccountKey {
  id: string;
  status?: string;
  message?: string;
  errorCode?: string;
}

export interface SubscriptionResponse {
  accountKeys: Array<AccountKey>;
}

export class SubscriptionRequest {
  private channelId: string;
  private data: Subscription = {
    accountKeys: [{ id: "4395980921202798602" }], // Put your account keys here
  };

  constructor(channelId: string) {
    this.channelId = channelId;
  }

  public request(token: string): RequestInit {
    this.data.channelId = this.channelId;
    return Request.init(token, this.data);
  }
}
