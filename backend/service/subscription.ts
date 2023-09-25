import {
    BadRequest, Unauthorized,
  } from "http-errors";
  import { Logger } from "../config/logger";
  import { GoToApiService } from "../types/externalApi";
import { SubscriptionRequest } from "../types/subscription";
  
  export default class SubscriptionApi implements GoToApiService {
    private subscription: SubscriptionRequest;
    private logger = new Logger("subscription-service");
  
    constructor(subscription: SubscriptionRequest) {
      this.subscription = subscription;
    }
  
    public async fetchData(token: string) {
      const response = await fetch(`https://api.dev.goto.com/call-events/v1/subscriptions`, this.subscription.request(token));
      if (response.status != 207) {
        if (response.status == 401) {
          return Promise.reject(new Unauthorized);
        }
        // Put error handling here
        this.logger.error(`failed to fetch subscription with token ${token} and error: ${response.statusText}`)
        return Promise.reject(new BadRequest(`Status is ${response.status} and error: ${response.statusText}`));
      }
      this.logger.info("Subscription has been created")
      return response.json();
    }
  }