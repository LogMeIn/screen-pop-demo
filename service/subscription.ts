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
    /*
     Fill in this function
     */
  }
}
