import { Box, Tabs, Text } from "@radix-ui/themes";
import {
  getMostStreamedTracks,
  getMostStreamedArtists,
} from "../chartMastersApi";
import { List } from "./List";
import { MostStreamedTrack, MostStreamedArtist } from "../types";

export const SpotifyGlobalRanking = async () => {
  const mostStreamedTracks = await getMostStreamedTracks();
  const mostStreamedArtists = await getMostStreamedArtists();

  return (
    <Tabs.Root defaultValue="tracks">
      <Tabs.List size="2" color="gray" highContrast className="justify-center">
        <Tabs.Trigger value="tracks">
          <Text size="3" className="font-bold">
            Tracks
          </Text>
        </Tabs.Trigger>
        <Tabs.Trigger value="artists">
          <Text size="3" className="font-bold">
            Artists
          </Text>
        </Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="tracks">
          <List
            startAt={1}
            data={mostStreamedTracks}
            getTitle={(item) => (item as MostStreamedTrack).title}
            getDescription={(item) => (item as MostStreamedTrack).artist}
            getImage={(item) => (item as MostStreamedTrack).image}
            right={(item) => {
              const _item = item as MostStreamedTrack;
              return (
                <div className="flex flex-col">
                  <Text weight="bold" size="1">
                    Streams
                  </Text>
                  <Text size="2">{_item.streams}</Text>
                </div>
              );
            }}
          />
        </Tabs.Content>
        <Tabs.Content value="artists">
          <List
            startAt={1}
            data={mostStreamedArtists}
            getTitle={(item) => (item as MostStreamedArtist).artist}
            getImage={(item) => (item as MostStreamedArtist).image}
            right={(item) => {
              const _item = item as MostStreamedArtist;
              return (
                <div className="flex flex-col">
                  <Text weight="bold" size="1">
                    Streams
                  </Text>
                  <Text size="2">{_item.streams}</Text>
                </div>
              );
            }}
          />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};
