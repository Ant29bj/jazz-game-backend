import { Router } from "express";
import { DataController } from "./data.controller.js";

export class DataRouter {
  constructor () { }

  static getRoutes(): Router {
    const router = Router();
    const controller = new DataController();

    router.get('/fetch', controller.fetchArtist)
    return router;
  }
}