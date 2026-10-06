import { SpotifyTrack } from "../types";
import { getReleaseYear } from "./releaseDates";

export type DecadeShare = {
  decade: number;
  label: string;
  count: number;
  percent: number;
};

export type DatedTrack = {
  track: SpotifyTrack;
  year: number;
  rank: number;
};

export type TimeMachineStats = {
  averageYear: number;
  medianYear: number;
  nostalgiaPercent: number;
  sweetSpot: { start: number; end: number; count: number };
  decades: DecadeShare[];
  topDecade: DecadeShare;
  oldest: DatedTrack[];
  newest: DatedTrack[];
  dated: DatedTrack[];
  minYear: number;
  maxYear: number;
};

const SWEET_SPOT_YEARS = 5;
const NOSTALGIA_YEARS = 10;

/**
 * Release-year stats for a ranking of tracks. Returns null when Spotify gave
 * no release dates.
 */
export const getTimeMachineStats = (
  tracks: SpotifyTrack[]
): TimeMachineStats | null => {
  const dated = tracks
    .map((track, index) => ({
      track,
      year: getReleaseYear(track.album),
      rank: index + 1,
    }))
    .filter((item): item is DatedTrack => item.year !== null);

  if (dated.length === 0) {
    return null;
  }

  const years = dated.map(({ year }) => year);
  const sorted = [...years].sort((a, b) => a - b);
  const total = years.length;
  const middle = Math.floor(total / 2);
  const medianYear =
    total % 2 === 0
      ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
      : sorted[middle];
  const currentYear = new Date().getFullYear();

  let sweetSpot = { start: sorted[0], end: sorted[0], count: 0 };
  for (let start = sorted[0]; start <= sorted[total - 1]; start++) {
    const end = start + SWEET_SPOT_YEARS - 1;
    const count = years.filter((year) => year >= start && year <= end).length;
    if (count > sweetSpot.count) {
      sweetSpot = { start, end, count };
    }
  }

  const firstDecade = Math.floor(sorted[0] / 10) * 10;
  const lastDecade = Math.floor(sorted[total - 1] / 10) * 10;
  // Always show at least five decades so a narrow taste still reads as a chart
  const startDecade = Math.min(firstDecade, lastDecade - 40);
  const decades: DecadeShare[] = [];
  for (let decade = startDecade; decade <= lastDecade; decade += 10) {
    const count = years.filter((year) => year >= decade && year < decade + 10).length;
    decades.push({
      decade,
      label: `${String(decade).slice(2)}s`,
      count,
      percent: Math.round((count / total) * 100),
    });
  }
  const topDecade = decades.reduce((best, item) => (item.count > best.count ? item : best));

  const byYear = [...dated].sort((a, b) => a.year - b.year || a.rank - b.rank);

  return {
    averageYear: Math.round(years.reduce((sum, year) => sum + year, 0) / total),
    medianYear,
    nostalgiaPercent: Math.round(
      (years.filter((year) => currentYear - year > NOSTALGIA_YEARS).length / total) * 100
    ),
    sweetSpot,
    decades,
    topDecade,
    oldest: byYear.slice(0, 3),
    newest: byYear.slice(-3).reverse(),
    dated,
    minYear: sorted[0],
    maxYear: sorted[total - 1],
  };
};
