import { Router } from "express";
import { DataRouter } from "./data/data.routes.js";
import { GameRouter } from "./game/game.routes.js";

export class AppRoutes {

  static getRoutes(): Router {
    const router = Router();
    // router.use('/api/admin', DataRouter.getRoutes());
    router.use('/api', GameRouter.getRoutes());

    router.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
      });
    });
    return router;
  }
}