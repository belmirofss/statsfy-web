import { Box, Tabs, Text } from "@radix-ui/themes";
import {
  getChartMastersMostStreamedArtists,
  getChartMastersMostStreamedTracks,
} from "../chartMastersApi";
import { List } from "./List";
import { ChartMastersArtist, ChartMastersTrack } from "../types";

export const SpotifyGlobalRanking = async () => {
  const mostStreamedTracks = await getChartMastersMostStreamedTracks(10);
  const mostStreamedArtists = await getChartMastersMostStreamedArtists(10);

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
            getTitle={(item) => (item as ChartMastersTrack).title}
            getDescription={(item) => (item as ChartMastersTrack).artist}
            getImage={(item) => (item as ChartMastersTrack).imageUrl}
            right={(item) => {
              const _item = item as ChartMastersTrack;
              return (
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col">
                    <Text weight="bold" size="1">
                      Streams
                    </Text>
                    <Text size="2">{_item.playcount}</Text>
                  </div>

                  <div className="flex flex-col">
                    <Text weight="bold" size="1">
                      Daily
                    </Text>
                    <Text size="2">{_item.dailyStreams}</Text>
                  </div>
                </div>
              );
            }}
          />
        </Tabs.Content>
        <Tabs.Content value="artists">
          <List
            startAt={1}
            data={mostStreamedArtists}
            getTitle={(item) => (item as ChartMastersArtist).artist}
            getImage={(item) => (item as ChartMastersArtist).imageUrl}
            right={(item) => {
              const _item = item as ChartMastersArtist;
              return (
                <div className="flex flex-col">
                  <Text weight="bold" size="1">
                    Streams
                  </Text>
                  <Text size="2">{_item.leadSteams}</Text>
                </div>
              );
            }}
          />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};
