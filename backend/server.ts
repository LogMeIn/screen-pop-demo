import http from "http";
import express, { Express, Request, Response } from 'express';
import { Logger } from "./config/logger";
import { Util } from "./config/util";
import health from "./ressources/health"


const logger = new Logger("server")
const app: Express = express();

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

// Create notification-channel
// Create subscription to the channel
// Listen for call-events notifications