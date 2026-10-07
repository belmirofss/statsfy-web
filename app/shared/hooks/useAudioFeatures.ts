import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SpotifyTrack } from "../types";

// Spotify removed audio features for new apps in 2024; ReccoBeats serves the
// same measurements by Spotify track id, for free and without a key
const RECCOBEATS = "https://api.reccobeats.com/v1/audio-features";
// ReccoBeats accepts at most 40 ids per request
const BATCH = 40;
const CACHE_KEY = "statsfy:audio-features:v1";
// Tracks ReccoBeats doesn't know are retried after a month
const UNKNOWN_TTL = 1000 * 60 * 60 * 24 * 30;

export type AudioFeatures = {
  // 0–1: how positive the track sounds
  valence: number;
  // 0–1: how intense and active it feels
  energy: number;
  danceability: number;
  // BPM
  tempo: number;
};

// Stored compactly: [valence, energy, danceability, tempo], or null when unknown
type CacheEntry = { f: [number, number, number, number] | null; at: number };
type Cache = Record<string, CacheEntry>;

// Spotify track id → features, or null when ReccoBeats has none
type Features = Record<string, AudioFeatures | null>;

type ReccoBeatsFeatures = {
  href?: string;
  valence?: number;
  energy?: number;
  danceability?: number;
  tempo?: number;
};

const readCache = (): Cache => {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const fromEntry = (entry: CacheEntry): AudioFeatures | null =>
  entry.f && { valence: entry.f[0], energy: entry.f[1], danceability: entry.f[2], tempo: entry.f[3] };

const writeCacheEntries = (entries: Features) => {
  try {
    const cache = readCache();
    const at = Date.now();
    Object.entries(entries).forEach(([id, features]) => {
      cache[id] = {
        f: features && [features.valence, features.energy, features.danceability, features.tempo],
        at,
      };
    });
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Without storage, features are looked up again next visit
  }
};

const isFresh = (entry: CacheEntry | undefined): entry is CacheEntry =>
  !!entry && (entry.f !== null || Date.now() - entry.at < UNKNOWN_TTL);

const readCachedFeatures = (ids: string[]) => {
  const cache = readCache();
  const known: Features = {};
  ids.forEach((id) => {
    const entry = cache[id];
    if (isFresh(entry)) known[id] = fromEntry(entry);
  });
  return known;
};

const isFeatures = (item: ReccoBeatsFeatures): item is Required<ReccoBeatsFeatures> =>
  typeof item.href === "string" &&
  typeof item.valence === "number" &&
  typeof item.energy === "number" &&
  typeof item.danceability === "number" &&
  typeof item.tempo === "number";

const lookUpBatch = async (ids: string[], found: Features) => {
  const response = await fetch(`${RECCOBEATS}?ids=${ids.join(",")}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`ReccoBeats answered ${response.status}`);
  const data: { content?: ReccoBeatsFeatures[] } = await response.json();

  // Results come back in any order, matched to tracks by their Spotify link
  data.content?.filter(isFeatures).forEach((item) => {
    const id = item.href.split("/track/")[1]?.split("?")[0];
    if (id) {
      found[id] = {
        valence: item.valence,
        energy: item.energy,
        danceability: item.danceability,
        tempo: item.tempo,
      };
    }
  });
  // Tracks left out of the answer are unknown to ReccoBeats
  ids.forEach((id) => {
    if (!(id in found)) found[id] = null;
  });
};

const lookUpFeatures = async (ids: string[]): Promise<Features> => {
  const known = readCachedFeatures(ids);
  const missing = ids.filter((id) => !(id in known));
  const found: Features = {};

  for (let start = 0; start < missing.length; start += BATCH) {
    await lookUpBatch(missing.slice(start, start + BATCH), found);
  }

  writeCacheEntries(found);
  return { ...known, ...found };
};

export const audioFeaturesQuery = (ids: string[]) =>
  queryOptions({
    queryKey: ["AUDIO_FEATURES", ids.join(",")],
    queryFn: () => lookUpFeatures(ids),
    // Cached on this device; a failed lookup is retried on the next visit
    staleTime: Infinity,
    retry: 1,
  });

export type TrackFeatures = {
  // Spotify track id → features, or null when unknown
  features: Map<string, AudioFeatures | null>;
  done: boolean;
  isError: boolean;
};

/**
 * Mood and tempo for each track, from ReccoBeats, cached on this device.
 * One request covers 40 tracks, so a top 50 takes two.
 */
export const useAudioFeatures = (tracks: SpotifyTrack[] | undefined): TrackFeatures => {
  const ids = useMemo(() => (tracks ?? []).map(({ id }) => id), [tracks]);
  const query = useQuery({
    ...audioFeaturesQuery(ids),
    // Everything already cached: show it on the first render, no lookup
    initialData: () => {
      if (ids.length === 0) return undefined;
      const known = readCachedFeatures(ids);
      return Object.keys(known).length === ids.length ? known : undefined;
    },
    enabled: ids.length > 0,
  });

  const features = useMemo(() => new Map(Object.entries(query.data ?? {})), [query.data]);

  return { features, done: !!query.data, isError: query.isError };
};
