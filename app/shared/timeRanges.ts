import { SpotifyTimeRanges } from "./types";

export const TIME_RANGE_OPTIONS = [
  { value: SpotifyTimeRanges.SHORT, label: "4 weeks" },
  { value: SpotifyTimeRanges.MEDIUM, label: "6 months" },
  { value: SpotifyTimeRanges.LONG, label: "All time" },
];

export const TIME_RANGE_LONG_LABELS: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "Last 4 weeks",
  [SpotifyTimeRanges.MEDIUM]: "Last 6 months",
  [SpotifyTimeRanges.LONG]: "All time",
};

// The range each one is compared against to show rank movement
export const COMPARISON_TIME_RANGE: Record<
  SpotifyTimeRanges,
  SpotifyTimeRanges | null
> = {
  [SpotifyTimeRanges.SHORT]: SpotifyTimeRanges.MEDIUM,
  [SpotifyTimeRanges.MEDIUM]: SpotifyTimeRanges.LONG,
  [SpotifyTimeRanges.LONG]: null,
};

export const COMPARISON_LABELS: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "6 months",
  [SpotifyTimeRanges.MEDIUM]: "all time",
  [SpotifyTimeRanges.LONG]: "",
};
