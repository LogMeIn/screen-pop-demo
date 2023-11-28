# Screen Pop Demo Template

Follow the detailed steps from [this guide](https://developer.goto.com/guides/GoToConnect/11_Screen_Pop/) to fill this template and run the Screen Pop Demo project.

## Prerequisites

For this tutorial you will need:

- an access to an account, please request a trial account by contacting sales [here](https://buy.goto.com/connect/trial?utm_source=developer.goto.com&utm_medium=referral&utm_campaign=trial). An SMS limit may apply.
- access to an 'Admin' user on said account (will be used in the demo).
- [Node.js (20.6 or newer)](https://nodejs.org/en/download/).
- a code editor of your choice. A popular choice is [VSCode](https://code.visualstudio.com/).

## OAuth Client Creation

Your OAuth client will be used to create tokens, which provide authorization to your API calls.

To create your first client,
1. Navigate to the [OAuth Client Management Portal](https://developer.logmeininc.com/clients). You might have to log in again. If you do, use the user account that you created for the trial setup. Note that the user account used to create OAuth clients is the only user account which can manage the clients. This tutorial will use the [Authorization Code Grant flow](https://developer.goto.com/Authentication/#section/Authorization-Flows/Authorization-Code-Grant) for authorization. Interactions with this flow have been created for you in the template used further down.

2. Click 'Create a client' to begin filling out your client information. Name your client something meaningful. For this tutorial we named our client "screen-pop-demo" to match the application we are creating it for. The redirect URI must equal `http://localhost:5000/app/redirect` for this tutorial.

3. Check the GoToConnect scopes for your client. We will be interacting with the GoToConnect APIs for this tutorial and only require the following scope to be selected: `call-events.v1.notifications.manage`. Scopes are requested to be able to subscribe to channels and be notified of Call Events.

4. Your client ID and client secret will be displayed. Remember, you can re-view your client id in the [OAuth Client Management Portal](https://developer.logmeininc.com/clients).

## Create your `.env` Configuration File

Create a `.env` configuration file in the same directory as the application source code with
the following content, replacing placeholder `<your_client_id>`/`<your_client_secret>` with information noted in the 'OAuth Client Creation' step above.
You can retrieve your account key by calling [the Admin API](https://developer.goto.com/guides/GoToConnect/09_HOW_fetchAccountUsers/).

```
OAUTH_CLIENT_ID=<your_client_id>
OAUTH_CLIENT_SECRET=<your_client_secret>
ACCOUNT_KEY=<your_account_key>
```

## Create a Notification Channel

Set up your application so that it creates a notification channel through which Call Events will flow. For this tutorial, you will use a WebSocket-based notification channel. You can also refer to the [notification channel documentation](https://developer.goto.com/GoToConnect/#tag/Notification-Channel-Overview) for more information.

In `service/notification.ts`:

```typescript
  public async fetchData(token: string) {
    this.demoChannelIdPromise = new CustomPromise<string>(() => undefined);

    // [STEP3] Create a notification channel
    const response = await fetch(
      `https://api.goto.com/notification-channel/v1/channels/${this.channelNickname}`,
      this.channel.request(token),
    );
    if (response.status != StatusCodes.CREATED) {
      this.logger
        .error(`Error while creating notification channel, error status code: \
        [${response.status} (${getReasonPhrase(response.status)})]`);
      throw new Error("Failed to create notification channel");
    }
    this.logger.info("Channel has been created");
    const demoChannel: ChannelResponse =
      (await response.json()) as ChannelResponse;
    this.demoChannelIdPromise.resolve(demoChannel.channelId);
    return demoChannel;
  }
```

Response Example:

```json
{
    "channelId": "0vTpo-UTMtHMl3lE4EI22OebVueT17KEDiOUV8H6ZEscG1qeZhW30kVeRj5UryQBHMA5mM58BzCvaAtpWl7vYKw",
    "channelNickname": "screen-pop-demo",
    "channelData": {
        "channelType": "WebSockets",
        "channelURL": "wss://webrtc.jive.com/notification-channel/v1/channels/0vTpo-UTMtHMl3lE4EI22OebVueT17KEDiOUV8H6ZEscG1qeZhW30kVeRj5UryQBHMA5mM58BzCvaAtpWl7vYKw/channelId/ws",
        "isConnected": false
    },
    "channelLifetime": 10800
}
```

The fields that require your attention are `channelId` and `channelURL`. The application will provide the `channelId` to the request for subscribing to Call Events at the next step. Your application will listen to Call Events through the `channelURL` WebSocket.

## Create a Subscription

Set up your application so that it subscribes to [Call Events](https://developer.goto.com/GoToConnect/#tag/Call-Events-Overview) (will flow through the WebSocket obtained at the previous step).

In `service/subscription.ts`:

```typescript
  public async fetchData(token: string) {
    // [STEP4] Create a Subscription
    const response = await fetch(
      `https://api.goto.com/call-events/v1/subscriptions`,
      this.subscription.request(token),
    );
    if (response.status != StatusCodes.MULTI_STATUS) {
      this.logger
        .error(`Error while subscribing to Call Events, error status code: \
        [${response.status} (${getReasonPhrase(response.status)})]`);
      throw new Error("Failed to request subscription to Call Events");
    }
    const subscriptions: SubscriptionResponse =
      (await response.json()) as SubscriptionResponse;

    subscriptions.accountKeys.forEach((account) => {
      if (account.status !== StatusCodes.OK) {
        this.logger.error(
          `Subscription failed for account key [${account.id}] \
          with status [${account.status}] (error code: [${account.errorCode}])`,
        );

        // stop at the first error
        throw new Error(
          `Failed to request subscription to Call Events for account key: [${account.id}]`,
        );
      }
    });

    this.logger.info("Subscription has been created");
    return subscriptions;
  }
```

Response Example:

```json
{
  "accountKeys": [
    {
      "id": "2930718022414574861",
      "status": 200,
      "message": "Success"
    }
  ]
}
```

## Start Application

1. `$ npm install`
2. `$ npm start`

At any point in time, press **Ctrl-C** in your terminal to exit.

When the application starts, you will get prompted to follow a login link before the demo
can continue. The `client_id` and `state` parameter will differ.

```
[2023-11-14T14:54:27.342Z] [INFO] [SERVER] Server is created at ws://localhost:3000

Open this URL in a browser to start the web application:
-------------------------------------------
https://authentication.logmeininc.com/login?service=https%3A%2F%2Fauthentication.logmeininc.com%2FOAuth%2Fapprove
%3Fclient_id%3D11111111-1111-1111-1111-111111111111
%26response_type%3Dcode
%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A5000%252Fapp%252Fredirect
%26scope%3Dcall-events.v1.notifications.manage
%26state%3D1111111111111111111111111111111
-------------------------------------------
```

The first time, you will be prompted to accept the scopes the app is requesting before being redirected back to your application.

After authenticating, the application will:
1. exchange the authorization code for an OAuth token to use with subsequent API calls.
2. create a WebSocket Notification Channel.
3. create a Call Events subscription attached to this channel.
4. redirect your browser to http://localhost:5000/app/redirect which shall give you the Screen Pop demo screen.
5. connect to the WebSocket, listen for Call Events notifications.

Any inbound call to your account will send events to your demo application. To trigger one such event, your user has to be online on [GoTo Connect](https://app.goto.com) and ready to receive calls.
Provisioned hardware phones or using the [GoTo Connect Mobile application](https://www.goto.com/connect/applications) will also work.

Test your demo application by calling your user at its provisioned number using another phone (you will **have** to call the account using a phone number that is external to the account). You should see an event pop displaying the caller's information.
