import type { SearchParams } from "./params/search-artist.param.js";
import type { SearchQueries } from "./query/search-artist.query.js";
import type { Request } from "express"

export type SearchArtistRequest = Request<SearchParams, null, null, SearchQueries>;