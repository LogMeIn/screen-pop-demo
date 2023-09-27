"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRequest = void 0;
const request_1 = __importDefault(require("./request"));
class SubscriptionRequest {
    constructor(channelId) {
        this.data = {
            accountKeys: [{ id: "4395980921202798602" }], // put your account keys here
        };
        this.channelId = channelId;
    }
    request(token) {
        this.data.channelId = this.channelId;
        return request_1.default.init(token, this.data);
    }
}
exports.SubscriptionRequest = SubscriptionRequest;
