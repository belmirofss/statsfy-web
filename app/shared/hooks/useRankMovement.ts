import { usePreferences } from "../providers/PreferencesProvider";
import { COMPARISON_LABELS, COMPARISON_TIME_RANGE } from "../timeRanges";
import { SpotifyTimeRanges } from "../types";
import { useSpotifyTopArtists } from "./useSpotifyTopArtists";
import { useSpotifyTopTracks } from "./useSpotifyTopTracks";

export type RankMovement =
  | { type: "new" }
  | { type: "same" }
  | { type: "up" | "down"; places: number };

type Props = {
  kind: "tracks" | "artists";
  timeRange: SpotifyTimeRanges;
};

/**
 * Compares the current ranking with the next longer time range
 * (4 weeks vs 6 months, 6 months vs all time).
 */
export const useRankMovement = ({ kind, timeRange }: Props) => {
  const { preferences } = usePreferences();
  const comparisonRange = COMPARISON_TIME_RANGE[timeRange];
  const enabled = preferences.showRankMovement && comparisonRange !== null;
  const queryRange = comparisonRange ?? SpotifyTimeRanges.LONG;

  const tracks = useSpotifyTopTracks({
    timeRange: queryRange,
    enabled: enabled && kind === "tracks",
  });
  const artists = useSpotifyTopArtists({
    timeRange: queryRange,
    enabled: enabled && kind === "artists",
  });

  const comparison = kind === "tracks" ? tracks.data : artists.data;

  if (!enabled || !comparison) {
    return { available: false as const };
  }

  const previousIndexes = new Map(
    comparison.map((item, index) => [item.id, index])
  );

  const getMovement = (id: string, index: number): RankMovement => {
    const previousIndex = previousIndexes.get(id);

    if (previousIndex === undefined) {
      return { type: "new" };
    }

    if (previousIndex === index) {
      return { type: "same" };
    }

    return previousIndex > index
      ? { type: "up", places: previousIndex - index }
      : { type: "down", places: index - previousIndex };
  };

  return {
    available: true as const,
    comparisonLabel: COMPARISON_LABELS[timeRange],
    getMovement,
  };
};
