import { queryOptions, useQuery } from "@tanstack/react-query";
import API from "../api";
import { getReleaseDate } from "../helpers/releaseDates";
import { SpotifyAlbum, SpotifyArtist, SpotifyItemsResponse, SpotifyTimeRanges } from "../types";
import { useSpotifyFollowedArtists } from "./useSpotifyFollowedArtists";
import { useSpotifyTopArtists } from "./useSpotifyTopArtists";
import { useToken } from "./useToken";

export const RELEASE_WINDOW_DAYS = 90;
// Candidates come from the 6 month top artists
export const RELEASE_TIME_RANGE = SpotifyTimeRanges.MEDIUM;
const TOP_ARTISTS = 30;
const FOLLOWED_ARTISTS = 20;
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

export const getReleaseCandidates = (
  top: SpotifyArtist[] | undefined,
  followed: SpotifyArtist[] | undefined
) => {
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  top?.slice(0, TOP_ARTISTS).forEach((artist, index) => {
    seen.add(artist.id);
    candidates.push({ artist, reason: { type: "top", rank: index + 1 } });
  });
  followed
    ?.filter((artist) => !seen.has(artist.id))
    .slice(0, FOLLOWED_ARTISTS)
    .forEach((artist) => candidates.push({ artist, reason: { type: "follow" } }));
  return candidates;
};

const fetchGroup = (token: string | undefined, artistId: string, group: "album" | "single") =>
  API.get<SpotifyItemsResponse<SpotifyAlbum>>(`v1/artists/${artistId}/albums`, {
    params: { include_groups: group, limit: 5 },
    headers: { Authorization: `Bearer ${token}` },
    // Up to 100 requests: let the scheduler trickle them out behind the page's own
    background: true,
  })
    .then((response) => response.data.items)
    .catch(() => []);

export const newReleasesQuery = (token: string | undefined, candidates: Candidate[]) => {
  const key = candidates.map(({ artist }) => artist.id).join(",");

  return queryOptions({
    queryKey: ["NEW_RELEASES", key],
    queryFn: async () => {
      const cached = readCache(key);
      if (cached) return cached;

      const cutoff = Date.now() - RELEASE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
      const found = new Map<string, StoredRelease>();

      await Promise.all(
        candidates.map(async (candidate) => {
          const [albums, singles] = await Promise.all([
            fetchGroup(token, candidate.artist.id, "album"),
            fetchGroup(token, candidate.artist.id, "single"),
          ]);
          [...albums, ...singles].forEach((album) => {
            const date = getReleaseDate(album);
            if (!date || date.getTime() < cutoff || found.has(album.id)) return;
            found.set(album.id, { album, artist: candidate.artist, reason: candidate.reason });
          });
        })
      );

      const releases = Array.from(found.values());
      writeCache(key, releases);
      return releases;
    },
  });
};

/**
 * Recent albums and singles from the artists you play most and the ones you
 * follow. Spotify has no "new releases for me" endpoint, so this asks for each
 * artist's latest albums and singles (max 10 per request since Feb 2026).
 */
export const useNewReleases = () => {
  const token = useToken();
  const top = useSpotifyTopArtists({ timeRange: RELEASE_TIME_RANGE });
  const followed = useSpotifyFollowedArtists();

  const candidates = getReleaseCandidates(top.data, followed.data);
  const ready = !!top.data && (!!followed.data || followed.isError);
  const enabled = !!token && ready && candidates.length > 0;

  const query = useQuery({
    ...newReleasesQuery(token, candidates),
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
