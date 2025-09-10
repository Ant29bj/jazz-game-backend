import { dreezerApi } from "@/api/dreezer.api.js";
import type { AlbumResponse } from "@/dto/responses/album-response.dto.js";


export const fetchAlbumDetailAction = async (albumId: number): Promise<AlbumResponse> => {
  const { data } = await dreezerApi.get<AlbumResponse>(`/album/${albumId}`);

  return data;
}