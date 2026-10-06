import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "../api";
import { CURRENTLY_PLAYING_KEY } from "./useSpotifyCurrentlyPlaying";
import { QUEUE_KEY } from "./useSpotifyQueue";
import { useToken } from "./useToken";

export type PlayerAction =
  | "play"
  | "pause"
  | "next"
  | "previous"
  | { seek: number };

const REQUESTS: Record<"play" | "pause" | "next" | "previous", { method: "put" | "post"; path: string }> = {
  play: { method: "put", path: "v1/me/player/play" },
  pause: { method: "put", path: "v1/me/player/pause" },
  next: { method: "post", path: "v1/me/player/next" },
  previous: { method: "post", path: "v1/me/player/previous" },
};

/**
 * Play, pause and skip. Spotify only allows this for Premium accounts and
 * answers 403 otherwise.
 */
export const usePlayerControls = () => {
  const token = useToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (action: PlayerAction) => {
      const headers = { Authorization: `Bearer ${token}` };

      if (typeof action === "object") {
        return API.put("v1/me/player/seek", null, {
          params: { position_ms: Math.round(action.seek) },
          headers,
        });
      }

      const { method, path } = REQUESTS[action];
      return API.request({ method, url: path, headers });
    },
    onSettled: () => {
      // Spotify takes a moment to apply the change before reporting it
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: CURRENTLY_PLAYING_KEY });
        queryClient.invalidateQueries({ queryKey: QUEUE_KEY });
      }, 400);
    },
  });

  const status = (mutation.error as AxiosError | null)?.response?.status;

  return {
    run: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.isError
      ? status === 403
        ? "Playback controls need Spotify Premium."
        : status === 404
          ? "Open Spotify on a device to control playback."
          : "Spotify didn't respond. Try again."
      : null,
  };
};
