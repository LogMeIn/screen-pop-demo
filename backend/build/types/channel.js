"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelRequest = void 0;
const request_1 = __importDefault(require("./request"));
class ChannelRequest {
    constructor() {
        this.DATA = {
            channelType: "WebSockets",
            channelData: {
                channelType: "WebSockets",
                isConnected: false,
            },
        };
    }
    request(token) {
        return request_1.default.init(token, this.DATA);
    }
}
exports.ChannelRequest = ChannelRequest;
