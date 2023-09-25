"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check = (req, res, next) => res.status(200).json({
    message: "pong",
});
exports.default = { check };
