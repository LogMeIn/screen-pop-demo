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
class NotificationChannelApi {
    constructor(channel) {
        this.channelNickname = "screen-pop-demo";
        this.logger = new logger_1.Logger("notification-channel-service");
        this.channel = channel;
    }
    fetchData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`https://api.dev.goto.com/notification-channel/v1/channels/${this.channelNickname}`, this.channel.request(token));
            if (response.status != 201) {
                if (response.status == 401) {
                    this.logger.error(`Insufficient scope for notification channel with token ${token}`);
                    return new error_1.HttpError(error_1.Status.UNAUTHORIZED, error_1.Code.UNAUTHORIZED, `missing scopes in the token`);
                }
                if (response.status == 403) {
                    this.logger.error(`Token is missing for notification channel`);
                    return new error_1.HttpError(error_1.Status.FORBIDDEN, error_1.Code.FORBIDDEN, `missing token in the token`);
                }
                this.logger.error(`Bad request for notification channel`);
                return new error_1.HttpError(error_1.Status.BAD_REQUEST, error_1.Code.BAD_REQUEST, `Bad request`);
            }
            this.logger.info("Channel has been created");
            return response.json();
        });
    }
}
exports.default = NotificationChannelApi;
