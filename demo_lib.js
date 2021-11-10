class LocationUtil {
  redirect(url) {
    window.location.assign(url);
    // return a never resolving promise to wait for location change
    return new Promise(() => undefined);
  }

  parseHashParams(hashstring) {
    return this.parseParams(hashstring.substring(1));
  }

  parseParams(querystring) {
    // parse query string
    return new URLSearchParams(querystring);
  }
}

class Encoder {
  stringify(obj) {
    if (typeof obj !== "object") {
      return encodeURIComponent(obj);
    }

    const str = [];
    Object.keys(obj || {}).forEach((key) => {
      let value = obj[key];
      if (value !== "" && value !== undefined) {
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        str.push([key, value].map(encodeURIComponent).join("="));
      }
    });

    return str.join("&");
  }
}

class OAuth {
  constructor({
    clientId,
    redirectUri = window.location.origin,
    oauthHost = "https://authentication.logmeininc.com",
  }) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.oauthHost = oauthHost;

    // Local Classes
    this.encoder = new Encoder();
    this.locationUtil = new LocationUtil();
  }

  async getToken() {
    const params = this.locationUtil.parseHashParams(window.location.hash);
    const token = params.get("access_token");
    if (token) {
      return token;
    }

    return this.implicit();
  }

  async implicit() {
    const params = {
      client_id: this.clientId,
      response_type: "token",
      redirect_uri: this.redirectUri,
    };
    return this.locationUtil.redirect(
      `${this.oauthHost}/oauth/authorize?${this.encoder.stringify(params)}`
    );
  }
}
