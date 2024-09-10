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
import Link from "next/link";
import { BuyMeACoffee } from "@/app/shared/components/BuyMeACoffee";

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
    topArtistsIsError || topTracksIsError || recentlyPlayedIsError;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  if (!topArtistsData || !topTracksData || !recentlyPlayedData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/share" className="w-full">
        <Button type="primary">Share</Button>
      </Link>

      <ResumeTopTracksOrArtists
        topTracks={topTracksData}
        topArtists={topArtistsData}
      />

      <BuyMeACoffee />

      <ResumeRecentlyPlayed recentlyPlayed={recentlyPlayedData} />
    </div>
  );
}
