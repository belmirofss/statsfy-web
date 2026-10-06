import {
  SpotifyTimeRanges,
  SpotifyItemsResponse,
  SpotifyTrack,
} from "../types";
import API from "../api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

type Props = {
  timeRange: SpotifyTimeRanges;
  limit?: number;
  enabled?: boolean;
};

export const topTracksQuery = (
  token: string | undefined,
  timeRange: SpotifyTimeRanges,
  { limit = 50, background = false }: { limit?: number; background?: boolean } = {}
) =>
  queryOptions({
    queryKey: ["TOP_TRACKS", timeRange, limit],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyTrack>>("v1/me/top/tracks", {
        params: {
          limit,
          offset: 0,
          time_range: timeRange,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        background,
      }),
  });

export const useSpotifyTopTracks = ({
  timeRange,
  limit = 50,
  enabled = true,
}: Props) => {
  const token = useToken();

  return useQuery({
    ...topTracksQuery(token, timeRange, { limit }),
    select: (response) => response.data.items,
    enabled: !!token && enabled,
  });
};
