"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Request {
    static init(token, data) {
        return {
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        };
    }
}
exports.default = Request;
