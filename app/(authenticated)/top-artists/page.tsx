"use client";

import {
  TimeRangeAllTimeTab,
  TimeRangeLast4WeeksTab,
  TimeRangeLast6MonthsTab,
  TimeRangeTabs,
} from "@/app/shared/components/TimeRangeTabs";
import { TopArtistsRanking } from "./components/TopArtistsRanking";
import { SpotifyTimeRanges } from "@/app/shared/types";

export default function TopArtists() {
  return (
    <TimeRangeTabs>
      <TimeRangeAllTimeTab>
        <TopArtistsRanking timeRange={SpotifyTimeRanges.LONG} />
      </TimeRangeAllTimeTab>

      <TimeRangeLast6MonthsTab>
        <TopArtistsRanking timeRange={SpotifyTimeRanges.MEDIUM} />
      </TimeRangeLast6MonthsTab>

      <TimeRangeLast4WeeksTab>
        <TopArtistsRanking timeRange={SpotifyTimeRanges.SHORT} />
      </TimeRangeLast4WeeksTab>
    </TimeRangeTabs>
  );
}
