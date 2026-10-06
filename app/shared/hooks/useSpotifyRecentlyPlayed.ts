import { SpotifyHistoryTrack, SpotifyItemsResponse } from "../types";
import API from "../api";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

// 50 is the maximum the Spotify API returns for recently played
export const useSpotifyRecentlyPlayed = ({ limit = 50 }: { limit?: number } = {}) => {
  const token = useToken();

  return useQuery({
    queryKey: ["RECENTLY_PLAYED", limit],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyHistoryTrack>>(
        "v1/me/player/recently-played",
        {
          params: {
            limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    select: (response) => response.data.items,
    enabled: !!token,
  });
};
