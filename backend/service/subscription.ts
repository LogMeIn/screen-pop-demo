import { Logger } from "../config/logger";
import { Code, HttpError, Status } from "../types/error";
import { GoToApiService } from "../types/externalApi";
import { SubscriptionRequest } from "../types/subscription";

export default class SubscriptionApi implements GoToApiService {
  private subscription: SubscriptionRequest;
  private logger = new Logger("subscription-service");

  constructor(subscription: SubscriptionRequest) {
    this.subscription = subscription;
  }

  public async fetchData(token: string) {
    const response = await fetch(
      `https://api.goto.com/call-events/v1/subscriptions`,
      this.subscription.request(token),
    );
    if (response.status != 207) {
      if (response.status == 401) {
        this.logger.error(`Insufficient scope for subscription`);
        return new HttpError(
          Status.UNAUTHORIZED,
          Code.UNAUTHORIZED,
          `missing scopes in the token`,
        );
      }
      this.logger.error(`Bad request for subscription`);
      return new HttpError(Status.BAD_REQUEST, Code.BAD_REQUEST, `Bad request`);
    }
    this.logger.info("Subscription has been created");
    return response.json();
  }
}
