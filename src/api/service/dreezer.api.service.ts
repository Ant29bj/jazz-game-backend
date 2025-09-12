import { fetchAlbumDetailAction } from "@/actions/fetch-album-detail.action.js";
import { fetchAlbumsByArtis } from "@/actions/fetch-albums-by-artist.action.js";
import type { AlbumResponse } from "@/dto/responses/album-response.dto.js";
import type { AlbumInfo } from "@/dto/responses/searh-by-artist.dto.js";
import { sleep } from "../utils/utils.api.js";
import { DatabaseProvider } from "@/config/database/implementation/database-provider.config.js";
import { AlbumRepository } from "@/respository/album.respository.js";
import { fetchTrackAction } from "@/actions/fetch-track.action.js";

export class DreezerService {

  private databaseProvider = DatabaseProvider.getDatabase();

  constructor () {

  }
  async getAlbums(artistId: string, page: string) {

    if (artistId === '') {
      return [];
    }

    try {
      const { data } = await fetchAlbumsByArtis(artistId, { limit: page });
      console.log(`Found ${data.length} albums`);

      const result = await this.fetchAlbumDetails(data);

      const successfulAlbums = result.filter(
        (album): album is AlbumResponse => !('error' in album)
      );

      console.log(`Successfully fetched ${successfulAlbums.length}/${data.length} albums`);
      this.insertDatabaseData(successfulAlbums);
      return successfulAlbums;

    } catch (error) {
      console.error('Error in getAlbums:', error);
      throw error;
    }
  }

  async fetchAlbumDetails(albums: AlbumInfo[]) {
    const results: (AlbumResponse | { error: true; albumId: number; errorMessage: string })[] = [];

    for (const [index, album] of albums.entries()) {

      if (!album) {
        console.error(`[${index + 1}/${albums.length}] Album is undefined`);
        results.push({
          error: true,
          albumId: -1,
          errorMessage: 'Album is undefined'
        });
        continue;
      }
      const { id, title } = album;
      try {
        if (index > 0) await sleep(25);

        const result = await fetchAlbumDetailAction(id);
        console.log(`[${index + 1}/${albums.length}] ${title}`);
        results.push(result);

      } catch (error) {
        console.error(`[${index + 1}/${albums.length}] Failed: ${title}`);
        results.push({
          error: true,
          albumId: id,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }


  async insertDatabaseData(albums: AlbumResponse[]) {
    this.databaseProvider.connect();
    const repository = new AlbumRepository(this.databaseProvider);

    albums.map((album) => repository.processAlbum(album));

  }
}