import {
  SpotifyTimeRanges,
  SpotifyItemsResponse,
  SpotifyTrack,
} from "../types";
import API from "../api";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

type Props = {
  timeRange: SpotifyTimeRanges;
  limit?: number;
};

export const useSpotifyTopTracks = ({ timeRange, limit = 50 }: Props) => {
  const token = useToken();

  return useQuery({
    queryKey: ["TOP_TRACKS", timeRange, limit],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyTrack>>("v1/me/top/tracks", {
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