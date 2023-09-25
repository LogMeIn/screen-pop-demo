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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
const logger_1 = require("../config/logger");
const subscription_1 = __importDefault(require("../service/subscription"));
const subscription_2 = require("../types/subscription");
class ScreenPopRessources {
    constructor(notificationApi) {
        this.logger = new logger_1.Logger("screen-pop-ressources");
        this.ringingPopup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const token = this.token(req);
            if (token === undefined) {
                return Promise.reject(new http_errors_1.BadRequest("Token is missing"));
            }
            return Promise.resolve(yield this.notificationApi.fetchData(token))
                .then((channel) => __awaiter(this, void 0, void 0, function* () {
                this.channel = channel;
                const subscriptionApi = this.subscription;
                return Promise.resolve(yield subscriptionApi.fetchData(token)).
                    then((subscription) => {
                    res.status(207).json(subscription);
                });
            }))
                .catch((error) => {
                res.status(error.statusCode ? error.statusCode : 400).json({
                    message: res.statusMessage
                });
            });
        });
        this.notificationApi = notificationApi;
    }
    token(req) {
        return req.headers.authorization ? req.headers.authorization : undefined;
    }
    get subscription() {
        var _a;
        const subscriptionRequest = new subscription_2.SubscriptionRequest(((_a = this.channel) === null || _a === void 0 ? void 0 : _a.channelId) || "");
        return new subscription_1.default(subscriptionRequest);
    }
}
exports.default = ScreenPopRessources;
