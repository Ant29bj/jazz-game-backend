import { dreezerApi } from "@/api/dreezer.api.js";
import type { FetchTrackResponse } from "@/dto/responses/fetch-track.dto.js";

export const fetchTrackAction = async (trackId: number): Promise<FetchTrackResponse> => {

  const { data } = await dreezerApi.get<FetchTrackResponse>(`/track/${trackId}`);

  return data;
}