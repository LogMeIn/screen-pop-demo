import Request from "./request"

export interface Channel {
    channelType: string;
    channelData: ChannelData;
}

export interface ChannelData {
    channelType: string;
    isConnected: boolean;
    channelURL?: string;
}

export interface ChannelResponse {
    channelId: string;
    channelNickname: string;
    channelData: ChannelData;
    channelLifetime: number;
    callbackURL: string;
    resourceURL: string;
    doNotDisturbAware: boolean   
}

export class ChannelRequest {
    private readonly DATA: Channel = {
        channelType: "WebSockets",
        channelData: {
          channelType: "WebSockets",
          isConnected: false,
        }
    }
    
    public request(token: string): RequestInit {
        return Request.init(token, this.DATA);
    }
}