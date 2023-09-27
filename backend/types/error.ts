export class HttpError extends Error {
  status: Status;
  code: Code;

  constructor(status: Status, code: Code, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export enum Status {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  FORBIDDEN = "FORBIDDEN",
}

export enum Code {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
  FORBIDDEN = 403,
}
