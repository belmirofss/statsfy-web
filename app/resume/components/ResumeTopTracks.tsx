"use client";

import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";

export const ResumeTopTracks = () => {
  const { data, isLoading, isError } = useSpotifyTopTracks({
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

  const [firstTrack, secondTrack, thirdTrack] = data;

  return (
    <Podium
      first={{
        title: firstTrack.name,
        description: formatArtistsToArtistNames(firstTrack.artists),
        imageUrl: firstTrack.album.images[0].url,
        alt: "Track cover",
      }}
      second={{
        title: secondTrack.name,
        description: formatArtistsToArtistNames(secondTrack.artists),
        imageUrl: secondTrack.album.images[0].url,
        alt: "Track cover",
      }}
      third={{
        title: thirdTrack.name,
        description: formatArtistsToArtistNames(thirdTrack.artists),
        imageUrl: thirdTrack.album.images[0].url,
        alt: "Track cover",
      }}
    />
  );
};
