import { SpotifyArtist, SpotifyTimeRanges, SpotifyTrack } from "../types";
import { getTopGenres } from "./getTopGenres";

// Number of artists and tracks a match link carries. Kept small so links stay
// short enough to paste into chats.
export const MATCH_ITEMS = 25;
const MATCH_GENRES = 12;

export type MatchPayload = {
  v: 1;
  // First name of the person who made the link
  n: string;
  // Spotify user id, to spot people opening their own link
  u: string;
  r: SpotifyTimeRanges;
  a: string[];
  t: string[];
  // [genre, percent of top artists]
  g: [string, number][];
};

const toBase64Url = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

export const createMatchPayload = ({
  firstName,
  userId,
  timeRange,
  artists,
  tracks,
}: {
  firstName: string;
  userId: string;
  timeRange: SpotifyTimeRanges;
  artists: SpotifyArtist[];
  tracks: SpotifyTrack[];
}): MatchPayload => ({
  v: 1,
  n: firstName,
  u: userId,
  r: timeRange,
  a: artists.slice(0, MATCH_ITEMS).map(({ id }) => id),
  t: tracks.slice(0, MATCH_ITEMS).map(({ id }) => id),
  g: getTopGenres(artists, MATCH_GENRES).map(({ name, percent }) => [name, percent]),
});

export const encodeMatchPayload = (payload: MatchPayload) => toBase64Url(JSON.stringify(payload));

export const decodeMatchPayload = (value: string): MatchPayload | null => {
  try {
    const payload = JSON.parse(fromBase64Url(value));
    const valid =
      payload?.v === 1 &&
      typeof payload.n === "string" &&
      typeof payload.u === "string" &&
      Array.isArray(payload.a) &&
      Array.isArray(payload.t) &&
      Array.isArray(payload.g);
    return valid ? (payload as MatchPayload) : null;
  } catch {
    return null;
  }
};

export type MatchTier = "Musical twins" | "Strong match" | "Some common ground" | "Opposites attract";

export const getMatchTier = (score: number): MatchTier =>
  score >= 80
    ? "Musical twins"
    : score >= 60
      ? "Strong match"
      : score >= 40
        ? "Some common ground"
        : "Opposites attract";

export type MatchPart = {
  label: string;
  value: number;
  weight: number;
  note: string;
};

export type SharedArtist = { artist: SpotifyArtist; myRank: number; theirRank: number };

export type GenreComparison = { name: string; mine: number; theirs: number };

export type MatchResult = {
  score: number;
  tier: MatchTier;
  parts: MatchPart[];
  sharedArtists: SharedArtist[];
  sharedTracks: SpotifyTrack[];
  // Their favourites that aren't in my top 50 (ids, details fetched separately)
  theirPicks: { id: string; rank: number }[];
  // My favourites that aren't in their list
  myPicks: { artist: SpotifyArtist; rank: number }[];
  genres: GenreComparison[];
};

// Rank 1 weighs 1, the last rank weighs close to 0
const rankWeight = (rank: number, total: number) => 1 - (rank - 1) / total;

const cosineSimilarity = (a: Map<string, number>, b: Map<string, number>) => {
  let dot = 0;
  a.forEach((value, key) => {
    dot += value * (b.get(key) ?? 0);
  });
  const norm = (map: Map<string, number>) =>
    Math.sqrt(Array.from(map.values()).reduce((sum, value) => sum + value * value, 0));
  const denominator = norm(a) * norm(b);
  return denominator === 0 ? 0 : dot / denominator;
};

/**
 * Compares my top items with the ones carried by a friend's match link.
 * Each part is 0-100; parts without data (no genres from Spotify) are left
 * out and the rest are re-weighted.
 */
export const computeMatch = ({
  payload,
  artists,
  tracks,
}: {
  payload: MatchPayload;
  artists: SpotifyArtist[];
  tracks: SpotifyTrack[];
}): MatchResult => {
  const myArtistRanks = new Map(artists.map((artist, index) => [artist.id, index + 1]));
  const myTrackIds = new Set(tracks.map(({ id }) => id));
  const theirArtistRanks = new Map(payload.a.map((id, index) => [id, index + 1]));

  const sharedArtists: SharedArtist[] = artists
    .filter((artist) => theirArtistRanks.has(artist.id))
    .map((artist) => ({
      artist,
      myRank: myArtistRanks.get(artist.id) as number,
      theirRank: theirArtistRanks.get(artist.id) as number,
    }));

  const theirTotal = Math.max(payload.a.length, 1);
  const myTotal = Math.max(artists.length, 1);
  const sharedWeight = sharedArtists.reduce(
    (sum, { myRank, theirRank }) =>
      sum + (rankWeight(myRank, myTotal) + rankWeight(theirRank, theirTotal)) / 2,
    0
  );
  // Best case: every one of their artists is in my list at the same rank
  const bestWeight = payload.a.reduce(
    (sum, _, index) =>
      sum + (rankWeight(index + 1, myTotal) + rankWeight(index + 1, theirTotal)) / 2,
    0
  );
  // Square root so a handful of shared favourites already reads as a real match
  const artistValue =
    bestWeight > 0 ? Math.min(1, Math.sqrt(sharedWeight / bestWeight)) : 0;

  const sharedTracks = tracks.filter(({ id }) => payload.t.includes(id));
  const trackValue = payload.t.length > 0 ? Math.sqrt(sharedTracks.length / payload.t.length) : 0;

  const myGenres = getTopGenres(artists, MATCH_GENRES);
  const myGenreMap = new Map(myGenres.map(({ name, percent }) => [name, percent]));
  const theirGenreMap = new Map(payload.g);
  const hasGenres = myGenreMap.size > 0 && theirGenreMap.size > 0;
  const genreValue = hasGenres ? cosineSimilarity(myGenreMap, theirGenreMap) : 0;

  const parts: MatchPart[] = [
    {
      label: "Artists",
      value: Math.round(artistValue * 100),
      weight: 0.45,
      note: `${sharedArtists.length} shared, weighted by how high you both rank them`,
    },
    ...(hasGenres
      ? [{ label: "Genres", value: Math.round(genreValue * 100), weight: 0.35, note: "How similar your genre mix is" }]
      : []),
    {
      label: "Tracks",
      value: Math.round(trackValue * 100),
      weight: 0.2,
      note: `${sharedTracks.length} ${sharedTracks.length === 1 ? "track" : "tracks"} in both lists`,
    },
  ];
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
  const score = Math.round(
    parts.reduce((sum, part) => sum + part.value * part.weight, 0) / totalWeight
  );

  const genreNames = Array.from(new Set([...myGenreMap.keys(), ...theirGenreMap.keys()]));
  const genres = genreNames
    .map((name) => ({
      name,
      mine: myGenreMap.get(name) ?? 0,
      theirs: theirGenreMap.get(name) ?? 0,
    }))
    .sort((a, b) => b.mine + b.theirs - (a.mine + a.theirs))
    .slice(0, 6);

  return {
    score,
    tier: getMatchTier(score),
    parts: parts.map((part) => ({ ...part, weight: part.weight / totalWeight })),
    sharedArtists,
    sharedTracks,
    theirPicks: payload.a
      .map((id, index) => ({ id, rank: index + 1 }))
      .filter(({ id }) => !myArtistRanks.has(id))
      .slice(0, 4),
    myPicks: artists
      .map((artist, index) => ({ artist, rank: index + 1 }))
      .filter(({ artist }) => !theirArtistRanks.has(artist.id))
      .slice(0, 4),
    genres,
  };
};

// Matches are remembered on this device only, like everything else in Statsfy
const MATCHES_KEY = "statsfy:matches";
const PENDING_MATCH_KEY = "statsfy:pending-match";
const MAX_SAVED_MATCHES = 10;

export type SavedMatch = {
  // Spotify id of whoever viewed the result, so shared devices don't mix people up
  owner: string;
  friendId: string;
  friendName: string;
  score: number;
  tier: MatchTier;
  sharedArtists: number;
  topSharedArtist: string | null;
  date: string;
  link: string;
};

export const readSavedMatches = (owner: string): SavedMatch[] => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(MATCHES_KEY) ?? "[]");
    return Array.isArray(stored)
      ? stored.filter((match: SavedMatch) => match.owner === owner)
      : [];
  } catch {
    return [];
  }
};

export const saveMatch = (match: SavedMatch) => {
  try {
    const stored: SavedMatch[] = JSON.parse(window.localStorage.getItem(MATCHES_KEY) ?? "[]");
    const others = (Array.isArray(stored) ? stored : []).filter(
      (item) => !(item.owner === match.owner && item.friendId === match.friendId)
    );
    window.localStorage.setItem(
      MATCHES_KEY,
      JSON.stringify([match, ...others].slice(0, MAX_SAVED_MATCHES))
    );
  } catch {
    // Storage can be unavailable (private mode); the match just isn't remembered
  }
};

// The hash never reaches the server, so it is lost on the Spotify login
// redirect. Keep it while the friend logs in.
export const storePendingMatch = (encoded: string) => {
  try {
    window.sessionStorage.setItem(PENDING_MATCH_KEY, encoded);
  } catch {
    // Without storage the friend just has to open the link again after logging in
  }
};

export const readPendingMatch = () => {
  try {
    return window.sessionStorage.getItem(PENDING_MATCH_KEY);
  } catch {
    return null;
  }
};
