import Request from "./request";

interface AccountKey {
  id: string;
  // will subscribe to all types of events if not provided
  events?: Array<string>;
  // fields from the return object:
  message?: string;
  status?: number;
  errorCode?: string;
}

interface Subscription {
  channelId: string;
  accountKeys: Array<AccountKey>;
}

export interface SubscriptionResponse {
  accountKeys: Array<AccountKey>;
}

export class SubscriptionRequest {
  private data: Subscription;

  constructor(channelId: string) {
    this.data = {
      channelId: channelId,
      accountKeys: [{ id: process.env.ACCOUNT_KEY, events: ["STARTING"] }],
    };
  }

  public request(token: string): RequestInit {
    return Request.post(token, this.data);
  }
}
