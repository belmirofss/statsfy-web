"use client";

import { useRef, useState } from "react";
import { Text } from "@radix-ui/themes";
import { toJpeg } from "html-to-image";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Logo } from "@/app/shared/components/Logo";
import { Podium } from "@/app/shared/components/Podium";
import { Select } from "@/app/shared/components/Select";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";

const SPOTIFY_TIME_RANGE_TO_TEXT: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "last 4 weeks",
  [SpotifyTimeRanges.MEDIUM]: "last 6 months",
  [SpotifyTimeRanges.LONG]: "all time",
};

export default function Share() {
  const downloadRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadImage = async () => {
    if (!downloadRef.current) {
      return;
    }

    toJpeg(downloadRef.current, {
      cacheBust: false,
      backgroundColor: "white",
      quality: 1,
    }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "my-spotify-stats.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="flex flex-col items-center">
      {!isLoading &&
      !isError &&
      topArtistsData &&
      topTracksData &&
      accountData ? (
        <div className="flex flex-col gap-4">
          <Select
            value={selectedTimeRange}
            onChange={(value) =>
              setSelectedTimeRange(value as SpotifyTimeRanges)
            }
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
          <div className="flex flex-col gap-4 bg-white p-4" ref={downloadRef}>
            <div className="flex flex-col">
              <Text size="6" weight="bold" className="text-main">
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
            <div>
              <Logo size="small" />
            </div>
          </div>

          <Button type="primary" className="mt-4" onClick={handleDownloadImage}>
            Download
          </Button>
        </div>
      ) : null}

      {isLoading && <Loading />}

      {isError && <Error />}
    </div>
  );
}
