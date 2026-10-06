"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { artistOriginsQuery } from "../hooks/useArtistOrigins";
import { getReleaseCandidates, newReleasesQuery, RELEASE_TIME_RANGE } from "../hooks/useNewReleases";
import { accountQuery } from "../hooks/useSpotifyAccount";
import { followedArtistsQuery } from "../hooks/useSpotifyFollowedArtists";
import { recentlyPlayedQuery } from "../hooks/useSpotifyRecentlyPlayed";
import { topArtistsQuery } from "../hooks/useSpotifyTopArtists";
import { topTracksQuery } from "../hooks/useSpotifyTopTracks";
import { useToken } from "../hooks/useToken";
import { TIME_RANGE_OPTIONS } from "../timeRanges";
import { usePreferences } from "./PreferencesProvider";

/**
 * Warms the query cache once you're logged in, so pages open with their data
 * ready instead of each one starting its own lookups. Nothing waits on it:
 * pages that need something sooner ask for it themselves and get it first,
 * since everything here past the essentials runs at background priority.
 */
export const AppDataPrefetcher = () => {
  const token = useToken();
  const { timeRange } = usePreferences();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const topArtists = (range: typeof timeRange, background = false) =>
      queryClient
        .fetchQuery(topArtistsQuery(token, range, { background }))
        .then((response) => response.data.items)
        .catch(() => undefined);

    const warmOrigins = (artists: Awaited<ReturnType<typeof topArtists>>) => {
      // MusicBrainz has its own queue, so this doesn't hold up Spotify requests
      if (!cancelled && artists?.length) queryClient.prefetchQuery(artistOriginsQuery(artists));
    };

    const warm = async () => {
      // The selected range first, at page priority: almost every page opens with it
      const [artists] = await Promise.all([
        topArtists(timeRange),
        queryClient.prefetchQuery(topTracksQuery(token, timeRange)),
        queryClient.prefetchQuery(accountQuery(token)),
        queryClient.prefetchQuery(recentlyPlayedQuery(token)),
      ]);
      warmOrigins(artists);
      if (cancelled) return;

      const otherRanges = TIME_RANGE_OPTIONS.map(({ value }) => value).filter(
        (range) => range !== timeRange
      );
      const [otherArtists, followed] = await Promise.all([
        Promise.all(otherRanges.map((range) => topArtists(range, true))),
        queryClient.fetchQuery(followedArtistsQuery(token, true)).catch(() => undefined),
        ...otherRanges.map((range) =>
          queryClient.prefetchQuery(topTracksQuery(token, range, { background: true }))
        ),
      ]);
      otherArtists.forEach(warmOrigins);
      if (cancelled) return;

      const releaseArtists =
        RELEASE_TIME_RANGE === timeRange
          ? artists
          : otherArtists[otherRanges.indexOf(RELEASE_TIME_RANGE)];
      const candidates = getReleaseCandidates(releaseArtists, followed);
      if (candidates.length > 0) {
        queryClient.prefetchQuery(newReleasesQuery(token, candidates));
      }
    };

    warm();

    return () => {
      cancelled = true;
    };
  }, [token, timeRange, queryClient]);

  return null;
};
