import type { IDatabase } from "@/config/database/IDatabase.js";
import type { AlbumResponse, Contributor } from "@/dto/responses/album-response.dto.js";

interface GeneratedSQL {
  artistInserts: { sql: string; params: any[] }[];
  albumInsert: { sql: string; params: any[] };
  artistAlbumInserts: { sql: string; params: any[] }[];
  trackInserts: { sql: string; params: any[] }[];
  artistTrackInserts: { sql: string; params: any[] }[];
}

export class AlbumRepository {
  constructor (private db: IDatabase) { }

  private generateAlbumSQL(albumData: AlbumResponse): GeneratedSQL {
    const sql: GeneratedSQL = {
      artistInserts: [],
      albumInsert: { sql: '', params: [] },
      artistAlbumInserts: [],
      trackInserts: [],
      artistTrackInserts: []
    };

    const uniqueArtists = new Map<number, Contributor>();

    if (albumData.contributors && albumData.contributors.length > 0) {
      albumData.contributors.forEach(artist => {
        uniqueArtists.set(artist.id, artist);
      });
    }

    if (albumData.tracks?.data) {
      albumData.tracks.data.forEach(({ artist }) => {
        if (artist && !uniqueArtists.has(artist.id)) {
          uniqueArtists.set(artist.id, {
            id: artist.id,
            name: artist.name,
            link: "",
            share: "",
            picture: artist.picture ?? "",
            picture_small: "",
            picture_medium: "",
            picture_big: "",
            picture_xl: "",
            radio: false,
            tracklist: artist.tracklist ?? "",
            type: artist.type,
            role: ""
          });
        }
      });
    }

    // INSERTs to artists
    uniqueArtists.forEach(artist => {
      sql.artistInserts.push({
        sql: `INSERT OR IGNORE INTO ARTIST (dreezer_id, name) VALUES (?, ?)`,
        params: [artist.id, artist.name]
      });
    });

    // 2. INSERT album
    sql.albumInsert = {
      sql: `INSERT OR IGNORE INTO ALBUM (dreezer_id, title, cover, cover_small, cover_medium, cover_big, cover_xl, release_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        albumData.id,
        albumData.title,
        albumData.cover,
        albumData.cover_small,
        albumData.cover_medium,
        albumData.cover_big,
        albumData.cover_xl,
        albumData.release_date,
        albumData.duration
      ]
    };

    // 3. INSERTs to ARTIST_ALBUM
    uniqueArtists.forEach(artist => {
      sql.artistAlbumInserts.push({
        sql: `INSERT OR IGNORE INTO ARTIST_ALBUM (artist_id, album_id) VALUES ((SELECT id FROM ARTIST WHERE dreezer_id = ?), (SELECT id FROM ALBUM WHERE dreezer_id = ?))`,
        params: [artist.id, albumData.id]
      });
    });

    // 4. INSERTs to TRACKS
    if (albumData.tracks?.data) {
      albumData.tracks.data.forEach(track => {
        sql.trackInserts.push({
          sql: `INSERT OR IGNORE INTO TRACK (dreezer_id, title, duration, album_id) VALUES (?, ?, ?, (SELECT id FROM ALBUM WHERE dreezer_id = ?))`,
          params: [track.id, track.title, track.duration, albumData.id]
        });
      });
    }

    // 5. INSERTs to ARTIST_TRACK
    if (albumData.tracks?.data) {
      albumData.tracks.data.forEach(track => {
        uniqueArtists.forEach(artist => {
          sql.artistTrackInserts.push({
            sql: `INSERT OR IGNORE INTO ARTIST_TRACK (artist_id, track_id) VALUES ((SELECT id FROM ARTIST WHERE dreezer_id = ?), (SELECT id FROM TRACK WHERE dreezer_id = ?))`,
            params: [artist.id, track.id]
          });
        });
      });
    }

    return sql;
  }

  async processAlbum(albumData: AlbumResponse): Promise<void> {
    try {
      const sql = this.generateAlbumSQL(albumData);

      console.log(`Processing album: ${albumData.title}`);

      // Ejecutar en transacción para atomicidad
      this.db.execute('BEGIN TRANSACTION');

      try {
        // 1. Insertar artistas
        console.log('Inserting artists...');
        for (const { sql: insertSQL, params } of sql.artistInserts) {
          this.db.execute(insertSQL, params);
        }

        // 2. Insertar álbum
        console.log('Inserting album...');
        this.db.execute(sql.albumInsert.sql, sql.albumInsert.params);

        // 3. Relaciones artista-álbum
        console.log('Creating artist-album relationships...');
        for (const { sql: insertSQL, params } of sql.artistAlbumInserts) {
          this.db.execute(insertSQL, params);
        }

        // 4. Insertar tracks
        console.log('Inserting tracks...');
        for (const { sql: insertSQL, params } of sql.trackInserts) {
          this.db.execute(insertSQL, params);
        }

        // 5. Relaciones artista-track
        console.log('Creating artist-track relationships...');
        for (const { sql: insertSQL, params } of sql.artistTrackInserts) {
          this.db.execute(insertSQL, params);
        }

        this.db.execute('COMMIT');
        console.log('Album processing completed successfully!');

      } catch (error) {
        this.db.execute('ROLLBACK');
        console.error('Error during album processing, transaction rolled back:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error processing album:', error);
      throw error;
    }
  }

}
