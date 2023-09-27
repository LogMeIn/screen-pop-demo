"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./config/logger");
const util_1 = require("./config/util");
const health_1 = __importDefault(require("./endpoints/health"));
const notification_1 = __importDefault(require("./service/notification"));
const channel_1 = require("./types/channel");
const screenPop_1 = __importDefault(require("./endpoints/screenPop"));
const cors_1 = __importDefault(require("cors"));
const logger = new logger_1.Logger("server");
const app = (0, express_1.default)();
const notificationChannelApi = new notification_1.default(new channel_1.ChannelRequest());
const screenPopEndpoint = new screenPop_1.default(notificationChannelApi);
// Add cors support
app.use((0, cors_1.default)(util_1.Util.corsOptions));
app.use((req, res, next) => util_1.Util.setupLogger(logger, req, res, next));
const httpServer = http_1.default.createServer(app);
httpServer.listen(util_1.Util.port, () => logger.info(`Server is running at http://${util_1.Util.hostname}:${util_1.Util.port}`));
// Add your endpoint here
app.use("/", health_1.default);
app.use("/", screenPopEndpoint.app);
