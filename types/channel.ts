import Request from "./request";

export interface Channel {
  channelType: ChannelType;
}

enum ChannelType {
  WebSockets = "WebSockets",
}

export interface ChannelData {
  isConnected: boolean;
  channelURL: string;
}

export interface ChannelResponse {
  channelId: string;
  channelNickname: string;
  channelData: ChannelData;
  channelLifetime: number;
}

export class ChannelRequest {
  private static readonly data: Channel = {
    channelType: ChannelType.WebSockets,
  };

  public request(token: string): RequestInit {
    return Request.post(token, ChannelRequest.data);
  }

  public refresh(token: string): RequestInit {
    return Request.put(token, ChannelRequest.data);
  }
}
