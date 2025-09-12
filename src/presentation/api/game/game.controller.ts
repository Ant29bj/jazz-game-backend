import { DatabaseProvider } from "@/config/database/implementation/database-provider.config.js"
import { GameService } from "@/service/game.service.js";
import { error } from "console";
import type { Request, Response } from "express"

export class GameCotroller {

  private databaseProvider = DatabaseProvider.getDatabase();
  private readonly gameService: GameService;
  constructor () {
    this.gameService = new GameService(this.databaseProvider);

    this.findAlbum = this.findAlbum.bind(this);
    this.fetchTracks = this.fetchTracks.bind(this);
  }


  async findAlbum(request: Request, response: Response) {

    try {
      this.databaseProvider.connect();

      const result = this.gameService.getRandomAlbum();

      if (result === null) {
        throw error;
      }

      response.json(result);
    } catch (err) {
      response.json(err);
    } finally {
      this.databaseProvider.disconnect();
    }
  }


  async fetchTracks(request: Request, response: Response) {
    try {
      const { trackId } = request.params;

      if (trackId) {
        const result = await this.gameService.fetchTracks(+trackId);
        response.status(200).json(result);
      }
    } catch (err) {
      response.status(500).json(`Error: ${err}`)
    }
  }

}