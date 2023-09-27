"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
const error_1 = require("../types/error");
class SubscriptionApi {
    constructor(subscription) {
        this.logger = new logger_1.Logger("subscription-service");
        this.subscription = subscription;
    }
    fetchData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`https://api.goto.com/call-events/v1/subscriptions`, this.subscription.request(token));
            if (response.status != 207) {
                if (response.status == 401) {
                    this.logger.error(`Insufficient scope for subscription`);
                    return new error_1.HttpError(error_1.Status.UNAUTHORIZED, error_1.Code.UNAUTHORIZED, `missing scopes in the token`);
                }
                this.logger.error(`Bad request for subscription`);
                return new error_1.HttpError(error_1.Status.BAD_REQUEST, error_1.Code.BAD_REQUEST, `Bad request`);
            }
            this.logger.info("Subscription has been created");
            return response.json();
        });
    }
}
exports.default = SubscriptionApi;
