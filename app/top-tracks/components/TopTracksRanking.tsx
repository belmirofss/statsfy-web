"use client";

import { Error } from "@/app/shared/components/Error";
import { List } from "@/app/shared/components/List";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges, SpotifyTrack } from "@/app/shared/types";

type Props = {
  timeRange: SpotifyTimeRanges;
};

export const TopTracksRanking = ({ timeRange }: Props) => {
  const { data, isLoading, isError } = useSpotifyTopTracks({
    timeRange,
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

  const [first, second, third, ...rest] = data;

  return (
    <div>
      <Podium
        first={{
          title: first.name,
          description: formatArtistsToArtistNames(first.artists),
          imageUrl: first.album.images[0].url,
          alt: "Track cover",
        }}
        second={{
          title: second.name,
          description: formatArtistsToArtistNames(second.artists),
          imageUrl: second.album.images[0].url,
          alt: "Track cover",
        }}
        third={{
          title: third.name,
          description: formatArtistsToArtistNames(third.artists),
          imageUrl: third.album.images[0].url,
          alt: "Track cover",
        }}
      />
      <List
        startAt={4}
        data={rest}
        getTitle={(item) => (item as SpotifyTrack).name}
        getDescription={(item) =>
          formatArtistsToArtistNames((item as SpotifyTrack).artists)
        }
        getImage={(item) => (item as SpotifyTrack).album.images[0].url}
        getAlt={() => "Track cover"}
      />
    </div>
  );
};
