import { useQuery } from "react-query";
import { SpotifyHistoryTrack, SpotifyItemsResponse } from "../types";
import API from "../api";


export const useSpotifyRecentlyPlayed = () => {
  return useQuery(
    ["RECENTLY_PLAYED"],
    () =>
      API.get<SpotifyItemsResponse<SpotifyHistoryTrack>>("v1/me/player/recently-played", {
        params: {
          limit: 15,
          offset: 0,
        },
      }),
    {
      select: (response) => response.data.items,
    }
  );
};