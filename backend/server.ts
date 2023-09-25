import http from "http";
import express, { Express, Request, Response } from 'express';
import { Logger } from "./config/logger";
import { Util } from "./config/util";
import health from "./endpoints/health"
import { GoToApiService } from "./types/externalApi";
import NotificationChannelApi from "./service/notification";
import { ChannelRequest } from "./types/channel";
import ScreenPopEndpoint from "./endpoints/screenPop";

const logger = new Logger("server")
const app: Express = express();
const notificationChannelApi: GoToApiService = new NotificationChannelApi(new ChannelRequest());
const screenPopEndpoint = new ScreenPopEndpoint(notificationChannelApi);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use((req, res, next) => Util.setupLogger(logger, req, res, next));

const httpServer = http.createServer(app);

httpServer.listen(Util.port, () =>
  logger.info(
    `Server is running at http://${Util.hostname}:${Util.port}`
  )
);

// Add your endpoint here
app.use("/", health);
app.use("/", screenPopEndpoint.app);