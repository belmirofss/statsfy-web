import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Modal } from "@/app/shared/components/Modal";
import { Podium } from "@/app/shared/components/Podium";
import { Select } from "@/app/shared/components/Select";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { ComponentProps, useState } from "react";

export const SPOTIFY_TIME_RANGE_TO_TEXT: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "last 4 weeks",
  [SpotifyTimeRanges.MEDIUM]: "last 6 months",
  [SpotifyTimeRanges.LONG]: "all time",
};

type Props = Pick<ComponentProps<typeof Modal>, "isOpen" | "onClose">;

export const ShareModal = ({ isOpen, onClose }: Props) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<SpotifyTimeRanges>(
    SpotifyTimeRanges.SHORT
  );

  const {
    data: accountData,
    isLoading: accountIsLoading,
    isError: accountIsError,
  } = useSpotifyAccount();

  const {
    data: topArtistsData,
    isLoading: topArtistsIsLoading,
    isError: topArtistsIsError,
  } = useSpotifyTopArtists({
    timeRange: selectedTimeRange,
    limit: 3,
  });

  const {
    data: topTracksData,
    isLoading: topTracksIsLoading,
    isError: topTracksIsError,
  } = useSpotifyTopTracks({
    timeRange: selectedTimeRange,
    limit: 3,
  });

  const isLoading =
    accountIsLoading || topArtistsIsLoading || topTracksIsLoading;
  const isError = accountIsError || topArtistsIsError || topTracksIsError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Share your Spotify stats"
      title={
        <Select
          value={selectedTimeRange}
          onChange={(value) => setSelectedTimeRange(value as SpotifyTimeRanges)}
          options={[
            {
              label: "Last 4 weeks",
              value: SpotifyTimeRanges.SHORT,
            },
            {
              label: "Last 6 months",
              value: SpotifyTimeRanges.MEDIUM,
            },
            {
              label: "All time",
              value: SpotifyTimeRanges.LONG,
            },
          ]}
        />
      }
    >
      {!isLoading &&
      !isError &&
      topArtistsData &&
      topTracksData &&
      accountData ? (
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Text size="5" weight="bold" className="text-main">
                {accountData.display_name}
              </Text>
              <Text size="5">
                Spotify stats of {SPOTIFY_TIME_RANGE_TO_TEXT[selectedTimeRange]}
              </Text>
            </div>

            <div className="flex flex-col">
              <Text size="4" weight="bold">
                Top tracks
              </Text>

              <Podium
                first={{
                  title: topTracksData[0].name,
                  description: formatArtistsToArtistNames(
                    topTracksData[0].artists
                  ),
                  imageUrl: topTracksData[0].album.images[0].url,
                }}
                second={{
                  title: topTracksData[1].name,
                  description: formatArtistsToArtistNames(
                    topTracksData[1].artists
                  ),
                  imageUrl: topTracksData[1].album.images[0].url,
                }}
                third={{
                  title: topTracksData[2].name,
                  description: formatArtistsToArtistNames(
                    topTracksData[2].artists
                  ),
                  imageUrl: topTracksData[2].album.images[0].url,
                }}
              />
            </div>

            <div className="flex flex-col">
              <Text size="4" weight="bold">
                Top artists
              </Text>
              <Podium
                first={{
                  title: topArtistsData[0].name,
                  imageUrl: topArtistsData[0].images[0].url,
                }}
                second={{
                  title: topArtistsData[1].name,
                  imageUrl: topArtistsData[1].images[0].url,
                }}
                third={{
                  title: topArtistsData[2].name,
                  imageUrl: topArtistsData[2].images[0].url,
                }}
              />
            </div>
          </div>

          <Button type="primary" className="mt-4">
            Download
          </Button>
        </div>
      ) : null}

      {isLoading && <Loading />}

      {isError && <Error />}
    </Modal>
  );
};
