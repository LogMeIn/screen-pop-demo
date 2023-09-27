export default class Request {
  public static init(token: string, data: any): RequestInit {
    return {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    };
  }
}
