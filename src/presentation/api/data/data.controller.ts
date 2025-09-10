import { DreezerService } from "@/api/service/dreezer.api.service.js"
import type { Request, Response } from "express"

export class DataController {

  private dreezerApi = new DreezerService();
  constructor () {
  }

  fetchArtist = async (request: Request, response: Response) => {

    const { artistId = '', limit = '' } = request.query;

    try {
      await this.dreezerApi.getAlbums(
        String(artistId),
        String(limit)
      );
      response.json('Succes')

    } catch (error) {
      response.json('Error')
    }



  }
}