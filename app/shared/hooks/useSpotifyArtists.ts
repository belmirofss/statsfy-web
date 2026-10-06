import { useQueries } from "@tanstack/react-query";
import API from "../api";
import { SpotifyArtist } from "../types";
import { useToken } from "./useToken";

/**
 * Several artists by id. Spotify removed the batch endpoint for Development
 * Mode apps, so each artist is its own request; keep the list short.
 */
export const useSpotifyArtists = (ids: string[]) => {
  const token = useToken();

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["ARTIST", id],
      queryFn: () =>
        API.get<SpotifyArtist>(`v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      enabled: !!token,
      staleTime: Infinity,
    })),
    combine: (results) => ({
      artists: results
        .map((result) => result.data?.data)
        .filter((artist): artist is SpotifyArtist => !!artist),
      isLoading: results.some((result) => result.isLoading),
    }),
  });
};
