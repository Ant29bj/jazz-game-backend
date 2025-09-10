WITH
    random_album AS (
        SELECT id
        FROM ALBUM
        WHERE
            EXISTS (
                SELECT 1
                FROM TRACK
                WHERE
                    album_id = ALBUM.id
            )
        ORDER BY RANDOM()
        LIMIT 1
    )
SELECT a.*, (
        SELECT GROUP_CONCAT(
                art.id || '|' || art.dreezer_id || '|' || art.name
            )
        FROM ARTIST art
            JOIN ARTIST_ALBUM aa ON art.id = aa.artist_id
        WHERE
            aa.album_id = a.id
    ) as artists, (
        SELECT GROUP_CONCAT(t.id)
        FROM TRACK t
        WHERE
            t.album_id = a.id
    ) as tracks
FROM ALBUM a
WHERE
    a.id = (
        SELECT id
        FROM random_album
    );