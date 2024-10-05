import { SpotifyGlobalRanking } from "@/app/shared/components/SpotifyGlobalRanking";
import { Text } from "@radix-ui/themes";

export default function SpotifyAllTime() {
  return (
    <div className="flex flex-col gap-4">
      <Text size="5" weight="bold" align="center">
        Most streamed on Spotify of all time
      </Text>

      {/* <SpotifyGlobalRanking /> */}
    </div>
  );
}
