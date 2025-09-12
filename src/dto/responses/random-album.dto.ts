export interface RandomAlbum {
  id: number;
  deezerId: number;
  title: string;
  cover: string;
  coverSmall: string;
  coverMedium: string;
  coverBig: string;
  coverXl: string;
  releaseDate: string;
  duration: number;
  artists: RandomAlbumArtist[];
  tracks: RandomAlbumTrack[];
}

export interface RandomAlbumArtist {
  id: number;
  deezerId: number;
  name: string;
}

export interface RandomAlbumTrack {
  id: number;
  deezerId: number;
  title: string;
  duration: number;
  artists: string[];
}