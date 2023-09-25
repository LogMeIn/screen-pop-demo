"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Util {
    static get hostname() {
        return process.env.HOSTNAME || "localhost";
    }
    static get port() {
        return Number(process.env.PORT) || 8000;
    }
    static setupLogger(logger, req, res, next) {
        logger.info(`METHOD: [${req.method}] - URL: [${req.url}]`);
        res.on("finish", () => {
            logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`);
        });
        next();
    }
}
exports.Util = Util;
