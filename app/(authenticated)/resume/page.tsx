"use client";

import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { Podium } from "@/app/shared/components/Podium";
import { TracksOrArtistsSelect } from "@/app/shared/components/TracksOrArtistsSelect";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyModes, SpotifyTimeRanges } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { useState } from "react";

export default function Resume() {
  const [selectedMode, setSelectedMode] = useState<SpotifyModes>(
    SpotifyModes.TRACKS
  );

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

  const isLoading = topArtistsIsLoading || topTracksIsLoading;
  const isError =
    topArtistsIsError || topTracksIsError || !topArtistsData || !topTracksData;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const [firstArtist, secondArtist, thirdArtist] = topArtistsData;
  const [firstTrack, secondTrack, thirdTrack] = topTracksData;

  return (
    <div className="flex flex-col gap-4">
      <Button type="primary">Share</Button>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Text size="5" weight="bold">
            Top
          </Text>
          <TracksOrArtistsSelect
            value={selectedMode}
            onChange={setSelectedMode}
          />
        </div>
        <Text size="4">Last 4 weeks</Text>
      </div>

      {selectedMode === SpotifyModes.TRACKS ? (
        <Podium
          first={{
            title: firstTrack.name,
            description: formatArtistsToArtistNames(firstTrack.artists),
            imageUrl: firstTrack.album.images[0].url,
          }}
          second={{
            title: secondTrack.name,
            description: formatArtistsToArtistNames(secondTrack.artists),
            imageUrl: secondTrack.album.images[0].url,
          }}
          third={{
            title: thirdTrack.name,
            description: formatArtistsToArtistNames(thirdTrack.artists),
            imageUrl: thirdTrack.album.images[0].url,
          }}
        />
      ) : (
        <Podium
          first={{
            title: firstArtist.name,
            imageUrl: firstArtist.images[0].url,
          }}
          second={{
            title: secondArtist.name,
            imageUrl: secondArtist.images[0].url,
          }}
          third={{
            title: thirdArtist.name,
            imageUrl: thirdArtist.images[0].url,
          }}
        />
      )}

      <Text size="5" weight="bold">
        Recently played
      </Text>
    </div>
  );
}
