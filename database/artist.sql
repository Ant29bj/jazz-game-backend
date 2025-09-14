-- Tabla de artistas
CREATE TABLE ARTIST (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dreezer_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Tabla de álbumes
CREATE TABLE ALBUM (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dreezer_id INTEGER NOT NULL UNIQUE,
    title TEXT,
    cover TEXT,
    cover_small TEXT,
    cover_medium TEXT,
    cover_big TEXT,
    cover_xl TEXT,
    release_date TEXT,
    duration INTEGER
);

-- Tabla de tracks
CREATE TABLE TRACK (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dreezer_id INTEGER NOT NULL UNIQUE,
    title TEXT,
    duration INTEGER,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (album_id) REFERENCES ALBUM (id)
);

-- Relación muchos a muchos entre ARTIST y ALBUM
CREATE TABLE ARTIST_ALBUM (
    artist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    PRIMARY KEY (artist_id, album_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (id),
    FOREIGN KEY (album_id) REFERENCES ALBUM (id)
);

-- Relación muchos a muchos entre ARTIST y TRACK (colaboraciones)
CREATE TABLE ARTIST_TRACK (
    artist_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    PRIMARY KEY (artist_id, track_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (id),
    FOREIGN KEY (track_id) REFERENCES TRACK (id)
);

SELECT TRACK.*, GROUP_CONCAT(ARTIST.name) AS artists
FROM
    TRACK
    JOIN ARTIST_TRACK ON TRACK.id = ARTIST_TRACK.track_id
    JOIN ARTIST ON ARTIST_TRACK.artist_id = ARTIST.id
WHERE
    TRACK.id = 3572
GROUP BY
    TRACK.id;

SELECT COUNT(*) FROM "TRACK";

SELECT COUNT(*) FROM "ALBUM";