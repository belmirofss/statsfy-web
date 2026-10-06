import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { SpotifyCurrentlyPlaying } from "../types";
import { useToken } from "./useToken";

export const CURRENTLY_PLAYING_KEY = ["CURRENTLY_PLAYING"];

type Props = {
  // How often to ask Spotify what's playing, in ms
  refetchInterval?: number;
  enabled?: boolean;
};

/**
 * The track playing right now, or null when nothing (or a podcast) is on.
 * Spotify answers 204 with an empty body when nothing is playing.
 */
export const useSpotifyCurrentlyPlaying = ({
  refetchInterval = 15000,
  enabled = true,
}: Props = {}) => {
  const token = useToken();

  return useQuery({
    queryKey: CURRENTLY_PLAYING_KEY,
    queryFn: () =>
      API.get<SpotifyCurrentlyPlaying | "">("v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    select: (response) => {
      const data = response.data;
      if (!data || data.currently_playing_type !== "track" || !data.item) {
        return null;
      }
      return { ...data, item: data.item };
    },
    staleTime: 0,
    refetchInterval,
    enabled: !!token && enabled,
  });
};
