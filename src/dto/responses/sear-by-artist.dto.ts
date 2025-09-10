export interface SearchByResponse {
  data: AlbumInfo[];
  total: number;
  next: string;
}

export interface AlbumInfo {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id: number;
  fans: number;
  release_date: Date;
  record_type: Type;
  tracklist: string;
  explicit_lyrics: boolean;
  type: Type;
}

export enum Type {
  Album = "album",
}
