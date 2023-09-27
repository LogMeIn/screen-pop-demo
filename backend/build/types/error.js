"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = exports.Status = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        console.log(`Error code created with message:${message} with code ${typeof this
            .code} and status ${this.status}`);
    }
}
exports.HttpError = HttpError;
var Status;
(function (Status) {
    Status["BAD_REQUEST"] = "BAD_REQUEST";
    Status["UNAUTHORIZED"] = "UNAUTHORIZED";
    Status["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    Status["FORBIDDEN"] = "FORBIDDEN";
})(Status || (exports.Status = Status = {}));
var Code;
(function (Code) {
    Code[Code["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    Code[Code["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Code[Code["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    Code[Code["FORBIDDEN"] = 403] = "FORBIDDEN";
})(Code || (exports.Code = Code = {}));
