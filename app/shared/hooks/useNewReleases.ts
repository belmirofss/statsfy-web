import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "../api";
import { getReleaseDate } from "../helpers/releaseDates";
import { SpotifyAlbum, SpotifyArtist, SpotifyItemsResponse, SpotifyTimeRanges } from "../types";
import { useSpotifyFollowedArtists } from "./useSpotifyFollowedArtists";
import { useSpotifyTopArtists } from "./useSpotifyTopArtists";
import { useToken } from "./useToken";

export const RELEASE_WINDOW_DAYS = 90;
const TOP_ARTISTS = 30;
const FOLLOWED_ARTISTS = 20;
const CONCURRENCY = 4;
const CACHE_KEY = "statsfy:new-releases";
const CACHE_TTL = 1000 * 60 * 60 * 6;

export type ReleaseReason = { type: "top"; rank: number } | { type: "follow" };

export type Release = {
  album: SpotifyAlbum;
  artist: SpotifyArtist;
  reason: ReleaseReason;
  date: Date;
};

type StoredRelease = Omit<Release, "date">;

type Candidate = { artist: SpotifyArtist; reason: ReleaseReason };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readCache = (key: string): StoredRelease[] | null => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "null");
    return stored?.key === key && Date.now() - stored.savedAt < CACHE_TTL ? stored.releases : null;
  } catch {
    return null;
  }
};

const writeCache = (key: string, releases: StoredRelease[]) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ key, savedAt: Date.now(), releases }));
  } catch {
    // Without storage the releases are fetched again next visit
  }
};

/**
 * Recent albums and singles from the artists you play most and the ones you
 * follow. Spotify has no "new releases for me" endpoint, so this asks for each
 * artist's latest albums and singles (max 10 per request since Feb 2026).
 */
export const useNewReleases = () => {
  const token = useToken();
  const top = useSpotifyTopArtists({ timeRange: SpotifyTimeRanges.MEDIUM });
  const followed = useSpotifyFollowedArtists();

  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  top.data?.slice(0, TOP_ARTISTS).forEach((artist, index) => {
    seen.add(artist.id);
    candidates.push({ artist, reason: { type: "top", rank: index + 1 } });
  });
  followed.data
    ?.filter((artist) => !seen.has(artist.id))
    .slice(0, FOLLOWED_ARTISTS)
    .forEach((artist) => candidates.push({ artist, reason: { type: "follow" } }));

  const ready = !!top.data && (!!followed.data || followed.isError);
  const key = candidates.map(({ artist }) => artist.id).join(",");

  const fetchGroup = async (artistId: string, group: "album" | "single") => {
    const request = () =>
      API.get<SpotifyItemsResponse<SpotifyAlbum>>(`v1/artists/${artistId}/albums`, {
        params: { include_groups: group, limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });

    try {
      return (await request()).data.items;
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response?.status !== 429) return [];
      const retryAfter = Number(response.headers["retry-after"] ?? 2);
      await wait(Math.min(retryAfter, 5) * 1000);
      return (await request().catch(() => null))?.data.items ?? [];
    }
  };

  const enabled = !!token && ready && candidates.length > 0;

  const query = useQuery({
    queryKey: ["NEW_RELEASES", key],
    queryFn: async () => {
      const cached = readCache(key);
      if (cached) return cached;

      const cutoff = Date.now() - RELEASE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
      const found = new Map<string, StoredRelease>();
      const queue = [...candidates];

      const worker = async () => {
        while (queue.length > 0) {
          const candidate = queue.shift() as Candidate;
          const [albums, singles] = await Promise.all([
            fetchGroup(candidate.artist.id, "album"),
            fetchGroup(candidate.artist.id, "single"),
          ]);
          [...albums, ...singles].forEach((album) => {
            const date = getReleaseDate(album);
            if (!date || date.getTime() < cutoff || found.has(album.id)) return;
            found.set(album.id, { album, artist: candidate.artist, reason: candidate.reason });
          });
        }
      };

      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
      const releases = Array.from(found.values());
      writeCache(key, releases);
      return releases;
    },
    select: (releases): Release[] =>
      releases
        .map((release) => ({ ...release, date: getReleaseDate(release.album) as Date }))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    enabled,
  });

  return {
    ...query,
    // isPending rather than isLoading so there is no gap before the first fetch starts
    isLoading:
      (!top.data && !top.isError) ||
      (!followed.data && !followed.isError) ||
      (enabled && query.isPending),
    isError: top.isError || query.isError,
    checkedArtists: candidates.length,
    followedCount: followed.data?.length ?? 0,
  };
};
