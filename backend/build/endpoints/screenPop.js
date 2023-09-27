"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const screenPop_1 = __importDefault(require("../ressources/screenPop"));
class ScreenPopEndpoint {
    constructor(gotoApiService) {
        this.app = express_1.default.Router();
        this.init = () => {
            this.app.post("/screen-pop", this.screenPop.ringingPopup);
        };
        this.screenPop = new screenPop_1.default(gotoApiService);
        this.init();
    }
}
exports.default = ScreenPopEndpoint;
