"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./config/logger");
const util_1 = require("./config/util");
const health_1 = __importDefault(require("./ressources/health"));
const logger = new logger_1.Logger("server");
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.use((req, res, next) => util_1.Util.setupLogger(logger, req, res, next));
const httpServer = http_1.default.createServer(app);
httpServer.listen(util_1.Util.port, () => logger.info(`Server is running at http://${util_1.Util.hostname}:${util_1.Util.port}`));
// /** Set your endpoint here */
app.use("/api/", health_1.default);
// app.use("/api", userRoutes.router);
// Create notification-channel
// Create subscription to the channel
// Listen for call-events notifications
