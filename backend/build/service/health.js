"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const check = (req, res, next) => res.status(200).json({
    message: "pong",
});
exports.default = { check };
