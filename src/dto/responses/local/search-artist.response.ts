import type { Response } from "express"

interface SearchArtistResponseBody {
  artists: string[] | null;
  itemCount: number;
  searchQuery: string;
}

interface ErrorSearchArtistResponseBody {
  code?: number;
  errMessage: string;
}


export type SearchArtistResponse = Response<SearchArtistResponseBody | ErrorSearchArtistResponseBody>;
