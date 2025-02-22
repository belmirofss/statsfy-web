"use client";

import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { SpotifyTimeRanges } from "@/app/shared/types";

export const ResumeTopArtists = () => {
  const { data, isLoading, isError } = useSpotifyTopArtists({
    timeRange: SpotifyTimeRanges.SHORT,
    limit: 3,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  if (!data) {
    return null;
  }

  const [firstArtist, secondArtist, thirdArtist] = data;

  return (
    <Podium
      first={{
        title: firstArtist.name,
        imageUrl: firstArtist.images[0].url,
        alt: "Artist image",
      }}
      second={{
        title: secondArtist.name,
        imageUrl: secondArtist.images[0].url,
        alt: "Artist image",
      }}
      third={{
        title: thirdArtist.name,
        imageUrl: thirdArtist.images[0].url,
        alt: "Artist image",
      }}
    />
  );
};
