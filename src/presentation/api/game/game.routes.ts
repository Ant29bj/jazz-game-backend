import { Router } from "express";
import { GameCotroller } from "./game.controller.js";

export class GameRouter {
  constructor () { }

  static getRoutes(): Router {
    const router = Router();
    const controller = new GameCotroller();

    router.get('/game', (req, res) => controller.findAlbum(req, res));
    router.get('/game/tracks/:trackId', controller.fetchTracks)
    return router;
  }
}