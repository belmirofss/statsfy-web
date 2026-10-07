import { AudioFeatures } from "../hooks/useAudioFeatures";
import { SpotifyTrack } from "../types";

export type MoodKey = "angsty" | "euphoric" | "melancholic" | "peaceful";

// Quadrants of the map: happiness (valence) left to right, energy bottom to top
export const MOODS: Record<MoodKey, { name: string; vibe: string; color: string }> = {
  angsty: { name: "Angsty", vibe: "Late-night drive", color: "#FF9F6B" },
  euphoric: { name: "Euphoric", vibe: "Main character", color: "#1ED760" },
  melancholic: { name: "Melancholic", vibe: "Rainy window", color: "#7EA6F7" },
  peaceful: { name: "Peaceful", vibe: "Sunday morning", color: "#B9AEFF" },
};

export const MOOD_ORDER: MoodKey[] = ["angsty", "euphoric", "melancholic", "peaceful"];

// Fewer songs than this with mood data doesn't say much about anyone's taste
const MIN_TRACKS = 5;

export const TEMPO_BINS = { from: 60, to: 190, step: 10 };
// The cadence of a steady run
export const RUNNING_ZONE = { from: 150, to: 180 };

export type MoodTrack = {
  track: SpotifyTrack;
  rank: number;
  features: AudioFeatures;
  mood: MoodKey;
};

export const getMood = ({ valence, energy }: AudioFeatures): MoodKey =>
  energy >= 0.5
    ? valence >= 0.5
      ? "euphoric"
      : "angsty"
    : valence >= 0.5
      ? "peaceful"
      : "melancholic";

const percent = (value: number) => Math.round(value * 100);

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

const extreme = (items: MoodTrack[], pick: (item: MoodTrack) => number, highest: boolean) =>
  items.reduce((best, item) =>
    highest ? (pick(item) > pick(best) ? item : best) : pick(item) < pick(best) ? item : best
  );

/**
 * Where a list of tracks sits between happy and sad, calm and intense.
 * Null when too few of them have mood data.
 */
export const getMoodStats = (
  tracks: SpotifyTrack[],
  features: Map<string, AudioFeatures | null>
) => {
  const items: MoodTrack[] = tracks.flatMap((track, index) => {
    const found = features.get(track.id);
    return found ? [{ track, rank: index + 1, features: found, mood: getMood(found) }] : [];
  });

  if (items.length < MIN_TRACKS) return null;

  const counts = MOOD_ORDER.map((key) => ({
    key,
    ...MOODS[key],
    count: items.filter(({ mood }) => mood === key).length,
  }));
  const mix = counts.map((mood) => ({ ...mood, percent: Math.round((mood.count / items.length) * 100) }));
  const top = [...mix].sort((a, b) => b.count - a.count)[0];

  const tempos = items.map(({ features: { tempo } }) => tempo);
  const bins = [];
  for (let from = TEMPO_BINS.from; from < TEMPO_BINS.to; from += TEMPO_BINS.step) {
    const isFirst = from === TEMPO_BINS.from;
    const isLast = from + TEMPO_BINS.step >= TEMPO_BINS.to;
    bins.push({
      from,
      // Slower and faster songs than the chart covers count in its end bars
      count: tempos.filter(
        (tempo) =>
          (isFirst || tempo >= from) && (isLast || tempo < from + TEMPO_BINS.step)
      ).length,
      running: from >= RUNNING_ZONE.from && from < RUNNING_ZONE.to,
    });
  }

  return {
    items,
    total: tracks.length,
    vibe: top.vibe,
    topMood: top,
    mix,
    averages: {
      valence: percent(average(items.map(({ features: { valence } }) => valence))),
      energy: percent(average(items.map(({ features: { energy } }) => energy))),
      danceability: percent(average(items.map(({ features: { danceability } }) => danceability))),
    },
    tempo: Math.round(average(tempos)),
    bins,
    runningCount: tempos.filter((tempo) => tempo >= RUNNING_ZONE.from && tempo < RUNNING_ZONE.to)
      .length,
    happiest: extreme(items, ({ features: { valence } }) => valence, true),
    saddest: extreme(items, ({ features: { valence } }) => valence, false),
    mostIntense: extreme(items, ({ features: { energy } }) => energy, true),
  };
};

export type MoodStats = NonNullable<ReturnType<typeof getMoodStats>>;

// Position on the map in percent, kept clear of the edges so dots stay whole
export const mapPosition = ({ valence, energy }: { valence: number; energy: number }) => ({
  left: `${5 + valence * 90}%`,
  top: `${5 + (1 - energy) * 90}%`,
});
