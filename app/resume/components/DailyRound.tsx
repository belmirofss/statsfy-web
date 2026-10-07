"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LuFlame } from "react-icons/lu";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { ChoiceState, OrBadge, SongChoice } from "@/app/shared/components/SongChoice";
import {
  DailyState,
  getCurrentStreak,
  getDailyPair,
  readDailyState,
  saveDailyAnswer,
  todayKey,
} from "@/app/shared/helpers/dailyRound";
import {
  GameTrack,
  getWinner,
  HIGHER_LOWER_ROUNDS,
  Pair,
  toGameTrack,
} from "@/app/shared/helpers/knowYourself";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges } from "@/app/shared/types";

/** One higher or lower question a day from the last 4 weeks, with a streak. */
export const DailyRound = () => {
  const account = useSpotifyAccount();
  // Always the last 4 weeks, so the question doesn't change with the time range
  const tracks = useSpotifyTopTracks({ timeRange: SpotifyTimeRanges.SHORT });
  // Undefined until read from this device
  const [state, setState] = useState<DailyState | null | undefined>(undefined);
  const [today, setToday] = useState("");

  const gameTracks = useMemo(() => tracks.data?.map(toGameTrack) ?? [], [tracks.data]);
  const owner = account.data?.id;

  useEffect(() => {
    setToday(todayKey());
    if (owner) setState(readDailyState(owner));
  }, [owner]);

  const pair = useMemo((): Pair | undefined => {
    if (!owner || !today || gameTracks.length < 10) return undefined;
    if (state?.date === today) {
      // Today's answer stays put even if the top 50 has shifted since
      const answered = state.pair.map((id) => gameTracks.find((track) => track.id === id));
      if (answered[0] && answered[1]) return [answered[0], answered[1]];
    }
    return getDailyPair(gameTracks, owner, today);
  }, [gameTracks, owner, today, state]);

  const shell = (children: ReactNode) => (
    <section className="card flex flex-col gap-4 p-5 lg:p-[22px]">{children}</section>
  );

  if (tracks.isLoading || account.isLoading || state === undefined) {
    return shell(<Loading label="Picking today's songs" />);
  }

  if (tracks.isError || account.isError || !owner) {
    return shell(<Error />);
  }

  if (!pair) {
    return shell(
      <p className="py-6 text-sm text-muted">
        Play a bit more on Spotify and a new question shows up here every day.
      </p>
    );
  }

  const answered = state?.date === today ? state : null;
  const winner = getWinner(pair);
  const streak = getCurrentStreak(state);

  const pick = (track: GameTrack) => {
    if (answered) return;
    setState(saveDailyAnswer(owner, { pair, picked: track.id, correct: track.id === winner.id }));
  };

  const stateOf = (track: GameTrack): ChoiceState =>
    !answered
      ? "open"
      : track.id === winner.id
        ? "right"
        : track.id === answered.picked
          ? "wrong"
          : "revealed";

  return shell(
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-main">Today&apos;s round · Know yourself</p>
          <h2 className="font-display text-[22px] font-bold lg:text-2xl">Which do you play more?</h2>
        </div>
        {streak > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 text-[13px] font-extrabold">
            <LuFlame aria-hidden size={14} className="fill-warn text-warn" />
            {streak}-day streak
          </span>
        )}
      </div>
      <div className="relative grid gap-3 sm:grid-cols-2">
        {pair.map((track) => (
          <SongChoice
            key={track.id}
            track={track}
            state={stateOf(track)}
            onPick={() => pick(track)}
            size="compact"
          />
        ))}
        <OrBadge className="hidden h-9 w-9 sm:flex" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          role="status"
          aria-live="polite"
          className={`text-sm font-semibold ${!answered ? "text-muted" : answered.correct ? "text-main" : "text-warn"}`}
        >
          {!answered
            ? "One question a day from your last 4 weeks. Keep your streak going."
            : answered.correct
              ? "Right! Come back tomorrow for a new pair."
              : `Not quite. ${winner.name} is your #${winner.rank}. New pair tomorrow.`}
        </p>
        <Link href="/know-yourself" className="py-1 text-sm font-extrabold text-main hover:brightness-110">
          Play {HIGHER_LOWER_ROUNDS} more rounds →
        </Link>
      </div>
    </>
  );
};
