import { SpotifyArtist, SpotifyItemsResponse, SpotifyTimeRanges } from "../types";
import API from "../api";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

type Props = {
  timeRange: SpotifyTimeRanges;
  limit?: number;
};

export const useSpotifyTopArtists = ({ timeRange, limit = 50 }: Props) => {
  const token = useToken();

  return useQuery({
    queryKey: ["TOP_ARTISTS", timeRange, limit],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyArtist>>("v1/me/top/artists", {
        params: {
          limit,
          offset: 0,
          time_range: timeRange,
        },
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }),
      select: (response) => response.data.items,
      enabled: !!token
  })
};