export default class Request {
  public static post<T>(token: string, data: T): RequestInit {
    return {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    };
  }

  public static delete(token: string): RequestInit {
    return {
      headers: {
        Authorization: `${token}`,
      },
      method: "DELETE",
    };
  }

  public static put<T>(token: string, data: T): RequestInit {
    return {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    };
  }
}
