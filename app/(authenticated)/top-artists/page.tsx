"use client";

import {
  TimeRangeAllTimeTab,
  TimeRangeLast4WeeksTab,
  TimeRangeLast6MonthsTab,
  TimeRangeTabs,
} from "@/app/shared/components/TimeRangeTabs";
import { Text } from "@radix-ui/themes";

export default function TopArtists() {
  return (
    <TimeRangeTabs>
      <TimeRangeAllTimeTab>
        <Text size="2">all-time</Text>
      </TimeRangeAllTimeTab>

      <TimeRangeLast6MonthsTab>
        <Text size="2">last-6-months</Text>
      </TimeRangeLast6MonthsTab>

      <TimeRangeLast4WeeksTab>
        <Text size="2">last-4-weeks</Text>
      </TimeRangeLast4WeeksTab>
    </TimeRangeTabs>
  );
}
