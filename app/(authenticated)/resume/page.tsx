"use client";

import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { ResumeTopTracksOrArtists } from "./components/ResumeTopTracksOrArtists";
import { ResumeRecentlyPlayed } from "./components/ResumeRecentlyPlayed";
import { useSpotifyRecentlyPlayed } from "@/app/shared/hooks/useSpotifyRecentlyPlayed";

export default function Resume() {
  const {
    data: topArtistsData,
    isLoading: topArtistsIsLoading,
    isError: topArtistsIsError,
  } = useSpotifyTopArtists({
    timeRange: SpotifyTimeRanges.SHORT,
    limit: 3,
  });

  const {
    data: topTracksData,
    isLoading: topTracksIsLoading,
    isError: topTracksIsError,
  } = useSpotifyTopTracks({
    timeRange: SpotifyTimeRanges.SHORT,
    limit: 3,
  });

  const {
    data: recentlyPlayedData,
    isLoading: recentlyPlayedIsLoading,
    isError: recentlyPlayedIsError,
  } = useSpotifyRecentlyPlayed();

  const isLoading =
    topArtistsIsLoading || topTracksIsLoading || recentlyPlayedIsLoading;
  const isError =
    topArtistsIsError ||
    topTracksIsError ||
    recentlyPlayedIsError ||
    !topArtistsData ||
    !topTracksData ||
    !recentlyPlayedData;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Button type="primary">Share</Button>

      <ResumeTopTracksOrArtists
        topTracks={topTracksData}
        topArtists={topArtistsData}
      />

      <ResumeRecentlyPlayed recentlyPlayed={recentlyPlayedData} />
    </div>
  );
}
