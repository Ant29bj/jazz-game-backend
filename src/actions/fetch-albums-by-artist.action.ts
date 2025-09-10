import { dreezerApi } from "@/api/dreezer.api.js";
import type { SearchByResponse } from "@/dto/responses/sear-by-artist.dto.js";

export interface QueryParams {
  limit?: string;
}

export const fetchAlbumsByArtis = async (artistId: string, { limit = '50' }: QueryParams): Promise<SearchByResponse> => {

  const { data } = await dreezerApi.get<SearchByResponse>(`artist/${artistId}/albums?limit=${limit}`);

  return data;
}