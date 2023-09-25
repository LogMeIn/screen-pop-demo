"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class NotificationResssources {
    constructor(gotoApiService) {
        this.app = express_1.default.Router();
        this.init = () => {
            this.app.post("/notification", this.gotoApiService.fetchData);
        };
        this.gotoApiService = gotoApiService;
    }
}
exports.default = NotificationResssources;
