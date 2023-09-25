import express from "express";

import { GoToApiService } from "../types/externalApi";

export default class NotificationResssources {
  gotoApiService: GoToApiService;
  app = express.Router();

  constructor(gotoApiService: GoToApiService) {
    this.gotoApiService = gotoApiService;
  }
  
  init = () => {
      this.app.post("/notification", this.gotoApiService.fetchData);
  }
}