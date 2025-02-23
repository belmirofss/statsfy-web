"use client";

import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Logo } from "@/app/shared/components/Logo";
import { Podium } from "@/app/shared/components/Podium";
import { Select } from "@/app/shared/components/Select";
import { downloadHtmlAsImg } from "@/app/shared/helpers/downloadHtmlAsImg";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { useRef, useState } from "react";

const SPOTIFY_TIME_RANGE_TO_TEXT: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "last 4 weeks",
  [SpotifyTimeRanges.MEDIUM]: "last 6 months",
  [SpotifyTimeRanges.LONG]: "all time",
};

export const ShareContent = () => {
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

  const handleDownloadImage = async () => {
    if (!downloadRef.current) {
      return;
    }

    await downloadHtmlAsImg(downloadRef.current, "my-spotify-stats");
  };

  if (accountIsLoading || topArtistsIsLoading || topTracksIsLoading) {
    return <Loading />;
  }

  if (accountIsError || topArtistsIsError || topTracksIsError) {
    return <Error />;
  }

  if (!accountData || !topArtistsData || !topTracksData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 w-full">
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
      </div>

      <div className="flex flex-col gap-4 bg-white p-4" ref={downloadRef}>
        <div className="flex flex-col">
          <Text size="6" weight="bold" className="text-main ">
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
              description: formatArtistsToArtistNames(topTracksData[0].artists),
              imageUrl: topTracksData[0].album.images[0].url,
              alt: "Track cover",
            }}
            second={{
              title: topTracksData[1].name,
              description: formatArtistsToArtistNames(topTracksData[1].artists),
              imageUrl: topTracksData[1].album.images[0].url,
              alt: "Track cover",
            }}
            third={{
              title: topTracksData[2].name,
              description: formatArtistsToArtistNames(topTracksData[2].artists),
              imageUrl: topTracksData[2].album.images[0].url,
              alt: "Track cover",
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
              alt: "Artist image",
            }}
            second={{
              title: topArtistsData[1].name,
              imageUrl: topArtistsData[1].images[0].url,
              alt: "Artist image",
            }}
            third={{
              title: topArtistsData[2].name,
              imageUrl: topArtistsData[2].images[0].url,
              alt: "Artist image",
            }}
          />
        </div>

        <div className="flex flex-row justify-between items-center">
          <Logo size="small" />
          <Text weight="bold">statsfy.app</Text>
        </div>
      </div>

      <div className="px-4">
        <Button type="primary" className="mt-4" onClick={handleDownloadImage}>
          Download
        </Button>
      </div>
    </div>
  );
};
