import { Logger } from "../config/logger";
import { GoToApiService } from "../types/externalApi";
import {
  SubscriptionRequest,
  SubscriptionResponse,
} from "../types/subscription";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export default class SubscriptionApi implements GoToApiService {
  private subscription: SubscriptionRequest;
  private logger = new Logger("SUBSCRIPTION");

  constructor(subscription: SubscriptionRequest) {
    this.subscription = subscription;
  }

  public async fetchData(token: string) {
    // [STEP4] Create a Subscription
    const response = await fetch(
      `https://api.goto.com/call-events/v1/subscriptions`,
      this.subscription.request(token),
    );
    if (response.status != StatusCodes.MULTI_STATUS) {
      this.logger
        .error(`Error while subscribing to Call Events, error status code: \
        [${response.status} (${getReasonPhrase(response.status)})]`);
      throw new Error("Failed to request subscription to Call Events");
    }
    const subscriptions: SubscriptionResponse =
      (await response.json()) as SubscriptionResponse;

    subscriptions.accountKeys.forEach((account) => {
      if (account.status !== StatusCodes.OK) {
        this.logger.error(
          `Subscription failed for account key [${account.id}] \
          with status [${account.status}] (error code: [${account.errorCode}])`,
        );

        // stop at the first error
        throw new Error(
          `Failed to request subscription to Call Events for account key: [${account.id}]`,
        );
      }
    });

    this.logger.info("Subscription has been created");
    return subscriptions;
  }
}
