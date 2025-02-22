"use client";

import { Error } from "@/app/shared/components/Error";
import { List } from "@/app/shared/components/List";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { SpotifyArtist, SpotifyTimeRanges } from "@/app/shared/types";

type Props = {
  timeRange: SpotifyTimeRanges;
};

export const TopArtistsRanking = ({ timeRange }: Props) => {
  const { data, isLoading, isError } = useSpotifyTopArtists({
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
          imageUrl: first.images[0].url,
          alt: "Artist image",
        }}
        second={{
          title: second.name,
          imageUrl: second.images[0].url,
          alt: "Artist image",
        }}
        third={{
          title: third.name,
          imageUrl: third.images[0].url,
          alt: "Artist image",
        }}
      />
      <List
        startAt={4}
        data={rest}
        getTitle={(item) => (item as SpotifyArtist).name}
        getImage={(item) => (item as SpotifyArtist).images[0].url}
        getAlt={() => "Artist image"}
      />
    </div>
  );
};
