import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { SpotifyQueue } from "../types";
import { useToken } from "./useToken";

export const QUEUE_KEY = ["QUEUE"];

export const useSpotifyQueue = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const token = useToken();

  return useQuery({
    queryKey: QUEUE_KEY,
    queryFn: () =>
      API.get<SpotifyQueue>("v1/me/player/queue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    // The queue can also hold podcast episodes, which have no album
    select: (response) => response.data.queue.filter((item) => !!item?.album).slice(0, 5),
    staleTime: 1000 * 30,
    enabled: !!token && enabled,
  });
};
