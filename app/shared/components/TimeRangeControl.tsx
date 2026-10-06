"use client";

import { usePreferences } from "../providers/PreferencesProvider";
import { TIME_RANGE_OPTIONS } from "../timeRanges";
import { SegmentedControl } from "./SegmentedControl";

export const TimeRangeControl = ({ fullWidth }: { fullWidth?: boolean }) => {
  const { timeRange, setTimeRange } = usePreferences();

  return (
    <SegmentedControl
      label="Time range"
      options={TIME_RANGE_OPTIONS}
      value={timeRange}
      onChange={setTimeRange}
      fullWidth={fullWidth}
    />
  );
};
