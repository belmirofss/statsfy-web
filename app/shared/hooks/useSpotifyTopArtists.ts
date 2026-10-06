import { SpotifyArtist, SpotifyItemsResponse, SpotifyTimeRanges } from "../types";
import API from "../api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

type Props = {
  timeRange: SpotifyTimeRanges;
  limit?: number;
  enabled?: boolean;
};

export const topArtistsQuery = (
  token: string | undefined,
  timeRange: SpotifyTimeRanges,
  { limit = 50, background = false }: { limit?: number; background?: boolean } = {}
) =>
  queryOptions({
    queryKey: ["TOP_ARTISTS", timeRange, limit],
    queryFn: () =>
      API.get<SpotifyItemsResponse<SpotifyArtist>>("v1/me/top/artists", {
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

export const useSpotifyTopArtists = ({
  timeRange,
  limit = 50,
  enabled = true,
}: Props) => {
  const token = useToken();

  return useQuery({
    ...topArtistsQuery(token, timeRange, { limit }),
    select: (response) => response.data.items,
    enabled: !!token && enabled,
  });
};
