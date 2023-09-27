import express from "express";
import health from "../service/health";

const app = express.Router();

app.get("/ping", health.check);

export = app;
