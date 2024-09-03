"use client";

import { FaClockRotateLeft } from "react-icons/fa6";
import { Image } from "@/app/shared/components/Image";
import { calculateTimestampDiffToNow } from "@/app/shared/helpers/calculateTimestampDiffToNow";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { generateTruncateWhenStyles } from "@/app/shared/helpers/generateTruncateWhenStyles";
import { SpotifyHistoryTrack } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { useDivWidth } from "@/app/shared/hooks/useDivWidth";

type Props = {
  historyTrack: SpotifyHistoryTrack;
};

export const ResumeRecentlyPlayedItem = ({ historyTrack }: Props) => {
  const { divRef, divWidth } = useDivWidth();

  return (
    <div ref={divRef} className="rounded-md relative">
      <Image
        size={divWidth}
        url={historyTrack.track.album.images[0].url}
        type="semi-rounded"
      />

      <span className="flex flex-row items-center gap-1 rounded-full absolute top-2 left-2 py-1 px-2 bg-black/50 text-white text-[9px]">
        <FaClockRotateLeft />
        {calculateTimestampDiffToNow(historyTrack.played_at)}
      </span>

      <div className="rounded-md absolute bottom-0 left-0 p-2 pt-4 bg-gradient-to-t from-black">
        <Text
          style={{ ...generateTruncateWhenStyles(2) }}
          weight="bold"
          className="text-white"
          size="2"
        >
          {historyTrack.track.name}
        </Text>
        <Text
          style={{ ...generateTruncateWhenStyles(2) }}
          className="text-white"
          size="1"
        >
          {formatArtistsToArtistNames(historyTrack.track.artists)}
        </Text>
      </div>
    </div>
  );
};
