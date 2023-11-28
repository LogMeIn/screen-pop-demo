import http from "http";
import WebSocket from "ws";
import { ScreenPopMessage } from "../types/screenPop";
import { Logger } from "../config/logger";

export default class ScreenPopWs {
  private clients: Set<WebSocket>; // Keeps track of active WebSocket connections
  private wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>;
  private logger = new Logger("SCREEN-POP-WS-SERVER");

  constructor(
    server: http.Server<
      typeof http.IncomingMessage,
      typeof http.ServerResponse
    >,
  ) {
    this.clients = new Set();
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  private init() {
    this.wss.on(
      "connection",
      async (ws: WebSocket, req: http.IncomingMessage) => {
        this.logger.info(`Client connected`);
        // Add the new WebSocket connection to the clients set
        this.clients.add(ws);

        ws.on("close", async () => {
          this.logger.error("Client disconnected");

          this.clients.delete(ws);
        });
      },
    );
  }

  public broadcastMessage(message: ScreenPopMessage, logger: Logger): void {
    for (const client of this.clients) {
      logger.info(`Broadcasting message`);
      client.send(JSON.stringify(message));
    }
  }
}
