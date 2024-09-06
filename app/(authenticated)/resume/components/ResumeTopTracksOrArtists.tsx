import { Podium } from "@/app/shared/components/Podium";
import { Select } from "@/app/shared/components/Select";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { SpotifyArtist, SpotifyModes, SpotifyTrack } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { useState } from "react";

type Props = {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
};

export const ResumeTopTracksOrArtists = ({ topTracks, topArtists }: Props) => {
  const [selectedMode, setSelectedMode] = useState<SpotifyModes>(
    SpotifyModes.TRACKS
  );

  const [firstTrack, secondTrack, thirdTrack] = topTracks;
  const [firstArtist, secondArtist, thirdArtist] = topArtists;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Text size="5" weight="bold">
            Top
          </Text>
          <Select
            value={selectedMode}
            onChange={(value) => setSelectedMode(value as SpotifyModes)}
            options={[
              {
                label: "Tracks",
                value: SpotifyModes.TRACKS,
              },
              {
                label: "Artists",
                value: SpotifyModes.ARTISTS,
              },
            ]}
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
    </>
  );
};
