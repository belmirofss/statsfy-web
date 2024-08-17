import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyArtist, SpotifyTimeRanges } from "@/app/shared/types";

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

  const formatArtistsToArtistNames = (artists: SpotifyArtist[]): string =>
    artists.map((item) => item.name).join(", ");

  const [first, second, third, ...rest] = data;

  return (
    <div>
      <Podium
        first={{
          title: first.name,
          description: formatArtistsToArtistNames(first.artists),
          imageUrl: first.album.images[0].url,
        }}
        second={{
          title: second.name,
          description: formatArtistsToArtistNames(second.artists),
          imageUrl: second.album.images[0].url,
        }}
        third={{
          title: third.name,
          description: formatArtistsToArtistNames(third.artists),
          imageUrl: third.album.images[0].url,
        }}
      />
    </div>
  );
};
