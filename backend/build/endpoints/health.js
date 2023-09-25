"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("../service/health"));
const app = express_1.default.Router();
app.get("/ping", health_1.default.check);
module.exports = app;
