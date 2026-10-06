import { useQuery } from "@tanstack/react-query";
import { SpotifyTrack } from "../types";

const LRCLIB = "https://lrclib.net/api";

export type LyricLine = { time: number; text: string };

export type Lyrics = {
  synced: LyricLine[] | null;
  plain: string | null;
  instrumental: boolean;
};

type LrclibRecord = {
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
};

const TIMESTAMP = /\[(\d+):(\d+(?:\.\d+)?)\]/g;

/** Parses LRC ("[01:02.50] line") into lines sorted by time in ms. */
export const parseSyncedLyrics = (lrc: string): LyricLine[] => {
  const lines: LyricLine[] = [];

  lrc.split("\n").forEach((row) => {
    const text = row.replace(TIMESTAMP, "").trim();
    if (!text) return;
    for (const match of Array.from(row.matchAll(TIMESTAMP))) {
      lines.push({
        time: Math.round((Number(match[1]) * 60 + Number(match[2])) * 1000),
        text,
      });
    }
  });

  return lines.sort((a, b) => a.time - b.time);
};

const toLyrics = (record: LrclibRecord): Lyrics => ({
  synced: record.syncedLyrics ? parseSyncedLyrics(record.syncedLyrics) : null,
  plain: record.plainLyrics,
  instrumental: record.instrumental,
});

const findLyrics = async (track: SpotifyTrack): Promise<Lyrics | null> => {
  const artist = track.artists[0]?.name ?? "";
  const params = new URLSearchParams({
    track_name: track.name,
    artist_name: artist,
    album_name: track.album.name,
  });
  if (track.duration_ms) {
    params.set("duration", String(Math.round(track.duration_ms / 1000)));
  }

  // Exact match on title, artist, album and duration first
  const exact = await fetch(`${LRCLIB}/get?${params}`);
  if (exact.ok) {
    return toLyrics(await exact.json());
  }

  // Then a looser search, preferring a result with synced lyrics
  const search = await fetch(
    `${LRCLIB}/search?${new URLSearchParams({ track_name: track.name, artist_name: artist })}`
  );
  if (!search.ok) return null;
  const results: LrclibRecord[] = await search.json();
  const best = results.find((record) => record.syncedLyrics) ?? results[0];
  return best ? toLyrics(best) : null;
};

/** Lyrics from LRCLIB, a free community lyrics database. */
export const useLyrics = (track: SpotifyTrack | null | undefined) =>
  useQuery({
    queryKey: ["LYRICS", track?.id],
    queryFn: () => findLyrics(track as SpotifyTrack),
    enabled: !!track,
    staleTime: Infinity,
    retry: false,
  });
