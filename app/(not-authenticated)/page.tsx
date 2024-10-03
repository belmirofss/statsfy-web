import { Button } from "../shared/components/Button";
import { Box, Heading, Tabs, Text } from "@radix-ui/themes";
import Link from "next/link";
import { Logo } from "@/app/shared/components/Logo";
import { SpotifyLoginButton } from "./components/SpotifyLoginButton";
import {
  getChartMastersMostStreamedArtists,
  getChartMastersMostStreamedTracks,
} from "../shared/chartMastersApi";
import { List } from "../shared/components/List";
import { ChartMastersArtist, ChartMastersTrack } from "../shared/types";

export default async function Login() {
  const mostStreamedTracks = await getChartMastersMostStreamedTracks(10);
  const mostStreamedArtists = await getChartMastersMostStreamedArtists(10);

  return (
    <div className="h-full">
      <div className="p-6 flex flex-col justify-center items-center gap-6 h-full w-full">
        <Logo />

        <div>
          <Heading as="h1" weight="bold" size="6" align="center">
            Hello! Are you looking for your stats?
          </Heading>

          <Heading as="h2" weight="regular" size="4" align="center">
            Log in with your Spotify account to see your stats
          </Heading>
        </div>

        <div className="flex flex-col items-center w-full gap-2">
          <SpotifyLoginButton />
          <Link href="/about" className="w-full md:max-w-sm">
            <Button type="secondary">About the website</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center w-full p-6">
        <div className="flex flex-col w-full md:max-w-lg gap-4">
          <Text weight="bold" size="5" align="center">
            Most streamed on Spotify all time
          </Text>
          <Tabs.Root defaultValue="tracks">
            <Tabs.List
              size="2"
              color="gray"
              highContrast
              className="justify-center"
            >
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
                />
              </Tabs.Content>
              <Tabs.Content value="artists">
                <List
                  startAt={1}
                  data={mostStreamedArtists}
                  getTitle={(item) => (item as ChartMastersArtist).artist}
                  getImage={(item) => (item as ChartMastersArtist).imageUrl}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </div>

      <div className="flex flex-col items-center w-full bg-main p-6">
        <div className="flex flex-col w-full md:max-w-lg gap-4">
          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              See your stats
            </Text>
            <Text className="text-white" size="4">
              Discover what tracks you have been listening the most in the last
              4 weeks. See what is the artists that you have listened the most
              of all time. You will get surprised!
            </Text>
          </div>

          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Share now
            </Text>
            <Text className="text-white" size="4">
              Share with your friends those interesting stats from your account
              with your friends and ask them to also share their ones.
            </Text>
          </div>

          {/* <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Create playlists
            </Text>
            <Text className="text-white" size="4">
              Create an amazing playlist from your personal stats and listen to
              it in the Spotify app.
            </Text>
          </div> */}

          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Safe, no data will be collected
            </Text>
            <Text className="text-white" size="4">
              All your data is saved exclusively on your device. Statsfy will
              never save or collect any information about you or your account.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
