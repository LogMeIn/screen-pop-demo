import { Logger } from "../config/logger";
import { CallEvent, Participant, InboundCaller } from "../types/callEvents";
import { ScreenPopMessage } from "../types/screenPop";
import NotificationChannelApi from "./notification";
import CallEventsResources from "./callEvents";
import ScreenPopWs from "./screenPopWs";
import WebSocket from "ws";
import { TokenFetcher } from "./token";
import { v4 as uuidv4 } from "uuid";
import http from "http";

export default class CallEventsWs {
  private static readonly requiredOAuthScopes: string =
    "call-events.v1.notifications.manage";

  private callEventsWs?: WebSocket;
  private notificationChannelApi: NotificationChannelApi =
    new NotificationChannelApi();
  private callEvents: CallEventsResources = new CallEventsResources(
    this.notificationChannelApi,
  );
  private logger = new Logger("CALL-EVENTS-WS-SERVER");
  private screenPopWs: ScreenPopWs;
  private tokenFetcher: TokenFetcher;

  constructor(
    server: http.Server<
      typeof http.IncomingMessage,
      typeof http.ServerResponse
    >,
  ) {
    this.screenPopWs = new ScreenPopWs(server);
    this.tokenFetcher = new TokenFetcher(CallEventsWs.requiredOAuthScopes);
    this.init();
  }

  public async init() {
    await this.tokenFetcher.fetch();

    const { callEventsWebSocketURL } = await this.callEvents.fetchData(
      await this.tokenFetcher.getBearerAccessToken(),
    );
    this.listenOnCallEventsWs(callEventsWebSocketURL);
  }

  private listenOnCallEventsWs(wsUrl: string): void {
    this.callEventsWs = new WebSocket(wsUrl);
    this.callEventsWs.onmessage = (event) => {
      this.handleEvent(event);
    };
  }

  public async cleanUp() {
    if (this.notificationChannelApi.isCleanupNeeded()) {
      await this.notificationChannelApi.cleanUpChannel(
        await this.tokenFetcher.getBearerAccessToken(),
      );
    }
    await this.tokenFetcher.shutdown();
  }

  private channelNeedsRefresh(type: string): boolean {
    return type == "WEBSOCKET_REFRESH_REQUIRED";
  }

  private channelIsClosing(type: string): boolean {
    return type == "WEBSOCKET_TO_BE_CLOSED";
  }

  private filter(callEvent: CallEvent): boolean {
    return (
      callEvent.metadata.direction == "INBOUND" &&
      callEvent.state.sequenceNumber == 1
    );
  }

  private lookup(
    participant: Participant,
    timestamp: string,
  ): ScreenPopMessage {
    const inboundCaller = InboundCaller.get(participant.type);

    // "lastCall", "notes":
    // would be looked up in your CRM via an API call or storage lookup.
    // Here they are hard-coded.
    return {
      id: uuidv4(),
      timestamp: timestamp,
      name: inboundCaller.name,
      number: inboundCaller.number,
      lastCall: "1 hour ago",
      notes: "VIP, loyal customer",
    } as ScreenPopMessage;
  }

  private async handleEvent(event: WebSocket.MessageEvent): Promise<void> {
    try {
      const data = JSON.parse(event.data as string);
      this.logger.debug(`Received event of type ${data.data.type}`);
      if (this.channelNeedsRefresh(data.data.type)) {
        this.logger.info("Refreshing WebSocket channel");
        await this.notificationChannelApi.refreshChannel(
          await this.tokenFetcher.getBearerAccessToken(),
        );
      } else if (this.channelIsClosing(data.data.type)) {
        this.logger.info("Recreating WebSocket channel");
        this.init();
      } else {
        this.logger.debug(`Got notification ${JSON.stringify(data)}`);
        const callEvent = data.data.content as CallEvent;

        if (this.filter(callEvent)) {
          this.logger.info("Incoming call");
          const caller: Participant = callEvent.state.participants[0];
          const screenPopMessage: ScreenPopMessage = this.lookup(
            caller,
            callEvent.metadata.callCreated,
          );
          this.screenPopWs.broadcastMessage(screenPopMessage, this.logger);
        } else {
          this.logger.debug(
            "Ignored event (sequenceNumber > 1 OR not INBOUND)",
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Unexpected error occurred with message [${error.message}]`,
        );
      } else {
        this.logger.error("Unexpected error occurred", error);
      }
    }
  }
}
