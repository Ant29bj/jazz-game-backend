import { DatabaseProvider } from "@/config/database/implementation/database-provider.config.js"
import type { FetchTracksParams } from "@/dto/requests/params/fetch-track.param.js";
import type { SearchArtistRequest } from "@/dto/requests/search-artist.request.js";
import type { SearchArtistResponse } from "@/dto/responses/local/search-artist.response.js";
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
    this.searchArtist = this.searchArtist.bind(this);
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


  async fetchTracks(request: Request<FetchTracksParams>, response: Response) {
    try {
      const { trackId } = request.params;

      if (trackId) {
        const result = await this.gameService.fetchTracks(trackId);
        response.status(200).json(result);
      }
    } catch (err) {
      response.status(500).json(`Error: ${err}`)
    }
  }


  async searchArtist(request: SearchArtistRequest, response: SearchArtistResponse) {
    try {
      const { artist } = request.params;
      const { limit = 20 } = request.query;
      if (!artist) throw new Error('Could no find artist param');
      const result = await this.gameService.searchArtist(artist, +limit);

      if (result.length === 0) {
        response.status(400).json({
          code: 404,
          errMessage: `Could not find any ${artist}`
        });
      }

      response.status(200).json({
        artists: result,
        itemCount: result ? result.length : 0,
        searchQuery: artist
      });

    } catch (err) {
      console.log(err)
      response.status(500).json({
        code: 500,
        errMessage: `something went wrong ${err}`
      });
    }
  }
}