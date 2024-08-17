import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { SpotifyTimeRanges } from "@/app/shared/types";

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
        }}
        second={{ title: second.name, imageUrl: second.images[0].url }}
        third={{ title: third.name, imageUrl: third.images[0].url }}
      />
    </div>
  );
};
