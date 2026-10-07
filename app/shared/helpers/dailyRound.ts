import { createPairs, createRandom, GameTrack, Pair } from "./knowYourself";

// One higher or lower question a day on the overview, with a streak. Kept on
// this device, like everything else Statsfy remembers.

const DAILY_KEY = "statsfy:daily-round:v1";

export type DailyState = {
  date: string;
  // Track ids of today's pair, so the answer survives the top 50 shifting
  pair: [string, string];
  picked: string;
  correct: boolean;
  streak: number;
  // Date of the last right answer, to tell if the streak is still alive
  lastCorrect: string | null;
};

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const todayKey = () => toDateKey(new Date());

const yesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toDateKey(date);
};

const readAll = (): Record<string, DailyState> => {
  try {
    return JSON.parse(window.localStorage.getItem(DAILY_KEY) ?? "{}");
  } catch {
    return {};
  }
};

export const readDailyState = (owner: string): DailyState | null => readAll()[owner] ?? null;

/** The same pair all day for the same person. */
export const getDailyPair = (tracks: GameTrack[], owner: string, date: string): Pair | undefined =>
  createPairs(tracks, 1, createRandom(`${owner}:${date}`), 3)[0];

/** The streak as it stands today: it ends once a day goes by without a right answer. */
export const getCurrentStreak = (state: DailyState | null) =>
  state && (state.lastCorrect === todayKey() || state.lastCorrect === yesterdayKey())
    ? state.streak
    : 0;

export const saveDailyAnswer = (
  owner: string,
  { pair, picked, correct }: { pair: Pair; picked: string; correct: boolean }
): DailyState => {
  const all = readAll();
  const previous = all[owner] ?? null;
  const today = todayKey();
  const next: DailyState = {
    date: today,
    pair: [pair[0].id, pair[1].id],
    picked,
    correct,
    streak: correct ? getCurrentStreak(previous) + 1 : 0,
    lastCorrect: correct ? today : (previous?.lastCorrect ?? null),
  };
  try {
    window.localStorage.setItem(DAILY_KEY, JSON.stringify({ ...all, [owner]: next }));
  } catch {
    // Without storage the answer only lasts for this visit
  }
  return next;
};
