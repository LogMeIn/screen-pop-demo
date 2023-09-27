import { NextFunction, Request, Response } from "express";

const check = (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({
    message: "pong",
  });

export default { check };
