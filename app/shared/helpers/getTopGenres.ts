import { SpotifyArtist } from "../types";

export type GenreShare = {
  name: string;
  percent: number;
};

const capitalize = (value: string) =>
  value.replace(/\b\w/g, (letter) => letter.toUpperCase());

/**
 * Share of the given artists tagged with each genre. Spotify does not return
 * genres for every artist, so this can be empty.
 */
export const getTopGenres = (
  artists: SpotifyArtist[],
  count = 4
): GenreShare[] => {
  if (artists.length === 0) {
    return [];
  }

  const counts = new Map<string, number>();

  artists.forEach((artist) => {
    new Set(artist.genres ?? []).forEach((genre) => {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, total]) => ({
      name: capitalize(name),
      percent: Math.round((total / artists.length) * 100),
    }));
};
