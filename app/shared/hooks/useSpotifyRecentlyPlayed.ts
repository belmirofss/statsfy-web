import { SpotifyHistoryTrack, SpotifyItemsResponse } from "../types";
import API from "../api";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";


export const useSpotifyRecentlyPlayed = () => {
  const token = useToken();

  return useQuery({
    queryKey: ["RECENTLY_PLAYED"],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyHistoryTrack>>("v1/me/player/recently-played", {
        params: {
          limit: 15,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }),
    select: (response) => response.data.items,
    enabled: !!token
  })
};