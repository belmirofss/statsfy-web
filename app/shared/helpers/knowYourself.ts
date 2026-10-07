import { SpotifyTimeRanges, SpotifyTrack } from "../types";
import { fromBase64Url, toBase64Url } from "./base64Url";
import { formatArtistsToArtistNames } from "./formatArtistsToArtistNames";

export const HIGHER_LOWER_ROUNDS = 10;
export const INTRO_ROUNDS = 5;
// Each "Hear more" plays a longer clip and the right answer is worth less
export const CLIP_SECONDS = [1, 2, 4, 8];
export const CLIP_POINTS = [3, 2, 1, 1];

// A track as the games need it. Challenge links rebuild these without Spotify,
// so there's no full SpotifyTrack here.
export type GameTrack = {
  id: string;
  rank: number;
  name: string;
  artists: string;
  image?: string;
};

const SPOTIFY_IMAGES = "https://i.scdn.co/image/";

// The 300px cover: sharp enough for the cards, light enough for a whole game
const pickImage = (track: SpotifyTrack) =>
  (track.album.images.find(({ width }) => width === 300) ?? track.album.images[0])?.url;

export const toGameTrack = (track: SpotifyTrack, index: number): GameTrack => ({
  id: track.id,
  rank: index + 1,
  name: track.name,
  artists: formatArtistsToArtistNames(track.artists),
  image: pickImage(track),
});

export type Random = () => number;

/** Repeatable random numbers, so a seed (like today's date) always gives the same game. */
export const createRandom = (seed: string): Random => {
  let hash = 1779033703 ^ seed.length;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffle = <T,>(items: T[], random: Random = Math.random) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};

export type Pair = [GameTrack, GameTrack];

/**
 * Pairs of tracks to compare. Each pair is at least `minGap` places apart so
 * there's a real answer, and tracks repeat only when the list runs out.
 */
export const createPairs = (
  tracks: GameTrack[],
  count: number,
  random: Random = Math.random,
  minGap = 2
): Pair[] => {
  const candidates: Pair[] = [];
  tracks.forEach((first, index) => {
    tracks.slice(index + 1).forEach((second) => {
      if (Math.abs(first.rank - second.rank) >= minGap) candidates.push([first, second]);
    });
  });

  const pairs: Pair[] = [];
  const used = new Set<string>();
  const add = ([first, second]: Pair) => {
    pairs.push(random() < 0.5 ? [first, second] : [second, first]);
    used.add(first.id);
    used.add(second.id);
  };
  const shuffled = shuffle(candidates, random);

  shuffled.forEach((pair) => {
    if (pairs.length < count && !used.has(pair[0].id) && !used.has(pair[1].id)) add(pair);
  });
  shuffled.forEach((pair) => {
    const repeated = pairs.some(
      ([first, second]) =>
        (first.id === pair[0].id && second.id === pair[1].id) ||
        (first.id === pair[1].id && second.id === pair[0].id)
    );
    if (pairs.length < count && !repeated) add(pair);
  });

  return pairs;
};

export const getWinner = ([first, second]: Pair) => (first.rank < second.rank ? first : second);

export type HigherLowerRound = { pair: Pair; picked: GameTrack; correct: boolean };

export type IntroRound = { track: GameTrack; correct: boolean; points: number };

export const TIERS = [
  { name: "Stranger", min: 0, text: "Your listening has a mind of its own. Time to get to know it." },
  {
    name: "Acquaintance",
    min: 0.4,
    text: "You know the hits, but the middle of your top 50 still surprises you.",
  },
  {
    name: "Self-aware",
    min: 0.7,
    text: "You know what you play. Only a couple of songs sneaked past you.",
  },
  { name: "Mind reader", min: 0.9, text: "You know your top 50 better than Spotify does." },
];

export const getTierIndex = (score: number, total: number) =>
  TIERS.reduce((found, tier, index) => (score / Math.max(total, 1) >= tier.min ? index : found), 0);

export const getLongestStreak = (results: boolean[]) =>
  results.reduce(
    ({ best, current }, correct) => {
      const next = correct ? current + 1 : 0;
      return { best: Math.max(best, next), current: next };
    },
    { best: 0, current: 0 }
  ).best;

/** The wrong answer with the biggest gap between the two songs. */
export const getBiggestSurprise = (rounds: HigherLowerRound[]) =>
  rounds
    .filter(({ correct }) => !correct)
    .sort(
      (a, b) =>
        Math.abs(b.pair[0].rank - b.pair[1].rank) - Math.abs(a.pair[0].rank - a.pair[1].rank)
    )[0];

// Your record, kept on this device per Spotify account

const RECORD_KEY = "statsfy:know-yourself:v1";

export type GameRecord = {
  played: number;
  bestStreak: number;
  // The last higher or lower score, shown on challenge links
  last?: { score: number; total: number };
};

const EMPTY_RECORD: GameRecord = { played: 0, bestStreak: 0 };

const readRecords = (): Record<string, GameRecord> => {
  try {
    return JSON.parse(window.localStorage.getItem(RECORD_KEY) ?? "{}");
  } catch {
    return {};
  }
};

export const readGameRecord = (owner: string): GameRecord => readRecords()[owner] ?? EMPTY_RECORD;

export const saveGameResult = (
  owner: string,
  result: { mode: "higherLower" | "intro"; score: number; total: number; streak: number }
): GameRecord => {
  const records = readRecords();
  const current = records[owner] ?? EMPTY_RECORD;
  const next: GameRecord = {
    played: current.played + 1,
    bestStreak: Math.max(current.bestStreak, result.streak),
    last: result.mode === "higherLower" ? { score: result.score, total: result.total } : current.last,
  };
  try {
    window.localStorage.setItem(RECORD_KEY, JSON.stringify({ ...records, [owner]: next }));
  } catch {
    // Without storage the record only lasts for this visit
  }
  return next;
};

// Challenge links: a friend plays higher or lower with your songs, no login
// needed, so the link carries everything the game shows

// Ranks spread over the top 50, so rounds aren't all between neighbours
const CHALLENGE_RANKS = [1, 2, 3, 4, 6, 8, 10, 13, 16, 20, 24, 28, 33, 38, 44, 50];

export type ChallengePayload = {
  v: 1;
  // First name of the person who made the link
  n: string;
  // Spotify user id, to spot people opening their own link
  u: string;
  r: SpotifyTimeRanges;
  // [score, total] of their last higher or lower game
  s?: [number, number];
  // [rank, name, artists, cover image key]
  k: [number, string, string, string][];
};

const clip = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length - 1)}…` : text;

export const createChallengePayload = ({
  firstName,
  userId,
  timeRange,
  tracks,
  last,
}: {
  firstName: string;
  userId: string;
  timeRange: SpotifyTimeRanges;
  tracks: SpotifyTrack[];
  last?: GameRecord["last"];
}): ChallengePayload => ({
  v: 1,
  n: firstName,
  u: userId,
  r: timeRange,
  ...(last ? { s: [last.score, last.total] } : {}),
  k: CHALLENGE_RANKS.filter((rank) => rank <= tracks.length).map((rank) => {
    const track = toGameTrack(tracks[rank - 1], rank - 1);
    const image = track.image?.startsWith(SPOTIFY_IMAGES)
      ? track.image.slice(SPOTIFY_IMAGES.length)
      : "";
    return [rank, clip(track.name, 60), clip(track.artists, 40), image];
  }),
});

export const encodeChallengePayload = (payload: ChallengePayload) =>
  toBase64Url(JSON.stringify(payload));

export const decodeChallengePayload = (value: string): ChallengePayload | null => {
  try {
    const payload = JSON.parse(fromBase64Url(value));
    const valid =
      payload?.v === 1 &&
      typeof payload.n === "string" &&
      typeof payload.u === "string" &&
      Array.isArray(payload.k) &&
      payload.k.length >= 4 &&
      payload.k.every(
        (item: unknown) =>
          Array.isArray(item) &&
          typeof item[0] === "number" &&
          typeof item[1] === "string" &&
          typeof item[2] === "string" &&
          typeof item[3] === "string"
      );
    return valid ? (payload as ChallengePayload) : null;
  } catch {
    return null;
  }
};

export const getChallengeTracks = (payload: ChallengePayload): GameTrack[] =>
  payload.k.map(([rank, name, artists, image]) => ({
    id: `rank-${rank}`,
    rank,
    name,
    artists,
    // Only Spotify's own image host, whatever the link says
    image: /^[a-f0-9]+$/i.test(image) ? `${SPOTIFY_IMAGES}${image}` : undefined,
  }));

export const getChallengeLink = (payload: ChallengePayload) =>
  `${window.location.origin}/challenge#${encodeChallengePayload(payload)}`;
