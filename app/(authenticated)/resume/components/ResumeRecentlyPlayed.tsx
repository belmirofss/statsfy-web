import { SpotifyHistoryTrack } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { ResumeRecentlyPlayedItem } from "./ResumeRecentlyPlayedItem";

type Props = {
  recentlyPlayed: SpotifyHistoryTrack[];
};

export const ResumeRecentlyPlayed = ({ recentlyPlayed }: Props) => {
  return (
    <>
      <Text size="5" weight="bold">
        Recently played
      </Text>

      <div className="grid grid-cols-3 gap-4">
        {recentlyPlayed.map((item) => (
          <ResumeRecentlyPlayedItem key={item.track.id} historyTrack={item} />
        ))}
      </div>
    </>
  );
};
