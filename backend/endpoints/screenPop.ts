import express from "express";
import ScreenPopRessources from "../ressources/screenPop";
import { GoToApiService } from "../types/externalApi";

export default class ScreenPopEndpoint {
  private screenPop: ScreenPopRessources;
  app = express.Router();
  constructor(gotoApiService: GoToApiService) {
    this.screenPop = new ScreenPopRessources(gotoApiService);
    this.init();
  }
  private init = () => {
    this.app.post("/screen-pop/ringings", this.screenPop.ringingPopup);
  };
}