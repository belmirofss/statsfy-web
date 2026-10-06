import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { SpotifyArtist, SpotifyFollowedArtistsResponse } from "../types";
import { useToken } from "./useToken";

// 50 is the page size limit; 4 pages is plenty for a release radar
const MAX_PAGES = 4;

export const useSpotifyFollowedArtists = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const token = useToken();

  return useQuery({
    queryKey: ["FOLLOWED_ARTISTS"],
    queryFn: async () => {
      const artists: SpotifyArtist[] = [];
      let after: string | null = null;

      for (let page = 0; page < MAX_PAGES; page++) {
        const response: { data: SpotifyFollowedArtistsResponse } = await API.get(
          "v1/me/following",
          {
            params: { type: "artist", limit: 50, ...(after ? { after } : {}) },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        artists.push(...response.data.artists.items);
        after = response.data.artists.cursors.after;
        if (!response.data.artists.next || !after) break;
      }

      return artists;
    },
    enabled: !!token && enabled,
  });
};
