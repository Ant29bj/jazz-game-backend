-- Tabla de artistas
CREATE TABLE IF NOT EXISTS ARTIST (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dreezer_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Tabla de álbumes
CREATE TABLE IF NOT EXISTS ALBUM (
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
CREATE TABLE IF NOT EXISTS TRACK (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dreezer_id INTEGER NOT NULL UNIQUE,
    title TEXT,
    duration INTEGER,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (album_id) REFERENCES ALBUM (id)
);

-- Relación muchos a muchos entre ARTIST y ALBUM
CREATE TABLE IF NOT EXISTS ARTIST_ALBUM (
    artist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    PRIMARY KEY (artist_id, album_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (id),
    FOREIGN KEY (album_id) REFERENCES ALBUM (id)
);

-- Relación muchos a muchos entre ARTIST y TRACK (colaboraciones)
CREATE TABLE IF NOT EXISTS ARTIST_TRACK (
    artist_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    PRIMARY KEY (artist_id, track_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (id),
    FOREIGN KEY (track_id) REFERENCES TRACK (id)
);