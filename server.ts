import http from "http";
import { Logger } from "./config/logger";
import { Util } from "./config/util";
import CallEventsWs from "./service/callEventsWs";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCOUNT_KEY: string;
      OAUTH_CLIENT_ID: string;
      OAUTH_CLIENT_SECRET: string;
      SHOW_DEBUG_LOGS: string | undefined;
    }
  }
}

const configured =
  process.env.ACCOUNT_KEY &&
  process.env.OAUTH_CLIENT_ID &&
  process.env.OAUTH_CLIENT_SECRET;
if (!configured) {
  console.error(
    "You must create a valid .env configuration file. Refer to our Call Events Screen Pop Tutorial developer guide on https://developer.goto.com/ for more information",
  );
  process.exit(1);
}

let shutdownInProgress = false;
const logger = new Logger("SERVER");
const response = {
  message: "ScreenPop WebSocket Server",
  status: "Created",
};
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(response));
});

const callEventWs = new CallEventsWs(server);

server.listen(Util.port, () =>
  logger.info(`Server is created at ws://localhost:${Util.port}`),
);

/**
 * Configures signal handlers to initiate orderly termination.
 */
process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);
process.on("exit", (code: number) =>
  logger.info(`Terminating with exit code ${code}`),
);

async function shutdownHandler(sig: string) {
  // filter duplicate SIGINT which can happen if running with 'npm start'
  if (shutdownInProgress) {
    return;
  }
  shutdownInProgress = true;

  console.log("");
  logger.info(`Received signal ${sig}: shutting down...`);

  await callEventWs.cleanUp();
  process.exit(1);
}
