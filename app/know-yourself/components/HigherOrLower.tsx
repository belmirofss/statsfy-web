"use client";

import { useState } from "react";
import { LuX, LuZap } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { ChoiceState, OrBadge, SongChoice } from "@/app/shared/components/SongChoice";
import {
  createPairs,
  GameTrack,
  getWinner,
  HIGHER_LOWER_ROUNDS,
  HigherLowerRound,
} from "@/app/shared/helpers/knowYourself";
import { RoundProgress } from "./RoundProgress";

type Props = {
  tracks: GameTrack[];
  rangeLabel: string;
  // Whose songs these are; leave empty for your own
  ownerName?: string;
  onDone: (rounds: HigherLowerRound[]) => void;
  onQuit: () => void;
};

export const HigherOrLower = ({ tracks, rangeLabel, ownerName, onDone, onQuit }: Props) => {
  const [pairs] = useState(() => createPairs(tracks, HIGHER_LOWER_ROUNDS));
  const [rounds, setRounds] = useState<HigherLowerRound[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const index = rounds.length - (picked ? 1 : 0);
  const pair = pairs[index];
  const winner = getWinner(pair);
  const last = rounds[rounds.length - 1];
  const isLast = index + 1 >= pairs.length;
  const streak = rounds.length - 1 - rounds.map(({ correct }) => correct).lastIndexOf(false);
  const possessive = ownerName ? `${ownerName}'s` : "your";

  const pick = (track: GameTrack) => {
    if (picked) return;
    setPicked(track.id);
    setRounds((current) => [...current, { pair, picked: track, correct: track.id === winner.id }]);
  };

  const next = () => {
    if (isLast) {
      onDone(rounds);
      return;
    }
    setPicked(null);
  };

  const stateOf = (track: GameTrack): ChoiceState =>
    !picked ? "open" : track.id === winner.id ? "right" : track.id === picked ? "wrong" : "revealed";

  return (
    <section className="card flex flex-col gap-5 rounded-3xl p-5 lg:p-7">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={onQuit}
          aria-label="Quit game"
          className="-m-2 flex h-11 w-11 items-center justify-center rounded-full text-subtle hover:bg-raised hover:text-white"
        >
          <LuX aria-hidden size={20} />
        </button>
        <p className="eyebrow text-muted">
          Round {index + 1} of {pairs.length} · {rangeLabel}
        </p>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-raised px-3 py-1.5 text-[13px] font-extrabold">
          <LuZap aria-hidden size={14} className="fill-main text-main" />
          {streak} in a row
        </span>
        <RoundProgress total={pairs.length} results={rounds.map(({ correct }) => correct)} current={index} />
      </div>

      <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] lg:text-[36px]">
        {ownerName ? `Which does ${ownerName} play more?` : "Which do you play more?"}
      </h2>

      <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-4">
        {pair.map((track) => (
          <SongChoice
            key={track.id}
            track={track}
            state={stateOf(track)}
            onPick={() => pick(track)}
            rankNote={`in ${possessive} top 50`}
          />
        ))}
        <OrBadge className="sm:top-[116px] lg:top-[136px] lg:h-[52px] lg:w-[52px]" />
      </div>

      <div className="flex min-h-[52px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className={`text-[15px] font-semibold leading-snug lg:text-base ${
            !picked ? "" : last.correct ? "text-main" : "text-warn"
          }`}
        >
          {picked &&
            (last.correct
              ? `Right. ${winner.name} is ${possessive} #${winner.rank}.`
              : `Not quite. ${winner.name} is #${winner.rank}, ${last.picked.name} is #${last.picked.rank}.`)}
        </p>
        {picked && (
          <Button onClick={next} className="sm:min-w-[160px]">
            {isLast ? "See results" : "Next round"}
          </Button>
        )}
      </div>
    </section>
  );
};
