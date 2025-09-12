import { fetchTrackAction } from "@/actions/fetch-track.action.js";
import type { IDatabase } from "@/config/database/IDatabase.js";
import { DatabaseProvider } from "@/config/database/implementation/database-provider.config.js";
import type { Album, Artist } from "@/dto/responses/album-response.dto.js";
import type { RandomAlbum, RandomAlbumArtist, RandomAlbumTrack } from "@/dto/responses/random-album.dto.js";
import { SqlLoader } from "@/utils/sql-loader.utils.js";

export class GameService {

  constructor (private databaseProvider: IDatabase) {
  }


  getRandomAlbum(): any {
    try {
      const albumQuery = SqlLoader.loadQuery('get_random_album');
      const tracksQuery = SqlLoader.loadQuery('get_tracks_with_artists');

      const albumResults = this.databaseProvider.query<any>(albumQuery);

      if (albumResults.length === 0) {
        return null;
      }

      const albumResult = albumResults[0];
      const rawTrackIds = albumResult.tracks.split(',');

      const tracksQueryFinal = tracksQuery.replace(':ids', rawTrackIds.join(','));

      const tracks = this.databaseProvider.query<any>(tracksQueryFinal);

      const result = albumResult ? this.parseAlbumResult(albumResult) : null;

      if (result) {
        result.tracks = tracks
      }

      return result;
    } catch (error) {
      console.error('Error executing random album query:', error);
      return null;
    }
  }


  private parseAlbumResult(result: any): RandomAlbum {
    return {
      id: result.id,
      deezerId: result.dreezer_id,
      title: result.title,
      cover: result.cover,
      coverSmall: result.cover_small,
      coverMedium: result.cover_medium,
      coverBig: result.cover_big,
      coverXl: result.cover_xl,
      releaseDate: result.release_date,
      duration: parseInt(result.duration),
      artists: this.parseArtists(result.artists),
      tracks: []
    };
  }

  private parseArtists(artistsStr: string | null): RandomAlbumArtist[] {

    if (!artistsStr) return [];

    return artistsStr.split(',').map(artistStr => {
      const [id = '', deezerId = '', name = ''] = artistStr.split('|');
      return {
        id: parseInt(id),
        deezerId: parseInt(deezerId),
        name
      };
    });
  }

  async fetchTracks(trackId: number) {
    return await fetchTrackAction(trackId);
  }
}