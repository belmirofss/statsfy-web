"use client";

import {
  TimeRangeAllTimeTab,
  TimeRangeLast4WeeksTab,
  TimeRangeLast6MonthsTab,
  TimeRangeTabs,
} from "@/app/shared/components/TimeRangeTabs";
import { TopTracksRanking } from "./components/TopTracksRanking";
import { SpotifyTimeRanges } from "@/app/shared/types";

export default function TopTracks() {
  return (
    <TimeRangeTabs>
      <TimeRangeAllTimeTab>
        <TopTracksRanking timeRange={SpotifyTimeRanges.LONG} />
      </TimeRangeAllTimeTab>

      <TimeRangeLast6MonthsTab>
        <TopTracksRanking timeRange={SpotifyTimeRanges.MEDIUM} />
      </TimeRangeLast6MonthsTab>

      <TimeRangeLast4WeeksTab>
        <TopTracksRanking timeRange={SpotifyTimeRanges.SHORT} />
      </TimeRangeLast4WeeksTab>
    </TimeRangeTabs>
  );
}
