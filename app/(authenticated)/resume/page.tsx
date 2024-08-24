"use client";

import { Button } from "@/app/shared/components/Button";
import { TracksOrArtistsSelect } from "@/app/shared/components/TracksOrArtistsSelect";
import { SpotifyModes } from "@/app/shared/types";
import { Text } from "@radix-ui/themes";
import { useState } from "react";

export default function Resume() {
  const [selectedMode, setSelectedMode] = useState<SpotifyModes>(
    SpotifyModes.TRACKS
  );

  return (
    <div className="flex flex-col gap-4">
      <Button type="primary">Share</Button>
      <div className="flex flex-row items-center gap-2">
        <Text size="5" weight="bold">
          Top
        </Text>
        <TracksOrArtistsSelect
          value={selectedMode}
          onChange={setSelectedMode}
        />
      </div>
    </div>
  );
}
