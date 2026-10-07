"use client";

import { useEffect, useMemo, useState } from "react";
import { LuArrowUpDown, LuChevronRight, LuHeadphones, LuLink } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import {
  CLIP_POINTS,
  GameRecord,
  getBiggestSurprise,
  getLongestStreak,
  getWinner,
  HIGHER_LOWER_ROUNDS,
  HigherLowerRound,
  INTRO_ROUNDS,
  IntroRound,
  readGameRecord,
  saveGameResult,
  toGameTrack,
} from "@/app/shared/helpers/knowYourself";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TIME_RANGE_LONG_LABELS } from "@/app/shared/timeRanges";
import { ChallengeLinkCard } from "./ChallengeLinkCard";
import { GameResults } from "./GameResults";
import { HigherOrLower } from "./HigherOrLower";
import { NameThatIntro } from "./NameThatIntro";

type Mode = "higherLower" | "intro";

type Finished =
  | { mode: "higherLower"; rounds: HigherLowerRound[] }
  | { mode: "intro"; rounds: IntroRound[] };

// Fewer top tracks than this don't make a game
const MIN_TRACKS = 12;

const MODES: {
  mode: Mode;
  title: string;
  text: string;
  tags: string[];
  Icon: typeof LuArrowUpDown;
  iconClass: string;
}[] = [
  {
    mode: "higherLower",
    title: "Higher or lower",
    text: "Two of your songs. Pick the one you play more.",
    tags: [`${HIGHER_LOWER_ROUNDS} rounds`, "No sound needed"],
    Icon: LuArrowUpDown,
    iconClass: "bg-main text-on-main",
  },
  {
    mode: "intro",
    title: "Name that intro",
    text: "Hear the first second of one of your top songs. Name it before it's gone.",
    tags: [`${INTRO_ROUNDS} rounds`, "Plays on your Spotify · Premium"],
    Icon: LuHeadphones,
    iconClass: "bg-[#8E7DFF] text-[#120D33]",
  },
];

const RecordCard = ({ record }: { record: GameRecord }) => (
  <section className="card flex flex-col gap-3.5 rounded-3xl p-5">
    <h2 className="font-display text-lg font-bold">Your record</h2>
    <dl className="grid grid-cols-3 gap-2">
      {[
        ["Best streak", record.bestStreak],
        ["Last score", record.last ? `${record.last.score}/${record.last.total}` : "–"],
        ["Played", record.played],
      ].map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 rounded-[14px] bg-raised p-3">
          <dt className="text-[11px] font-bold text-muted">{label}</dt>
          <dd className="font-display text-2xl font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

export const KnowYourselfContent = () => {
  const { timeRange } = usePreferences();
  const account = useSpotifyAccount();
  const tracks = useSpotifyTopTracks({ timeRange });
  const [mode, setMode] = useState<Mode | null>(null);
  const [finished, setFinished] = useState<Finished | null>(null);
  const [game, setGame] = useState(0);
  const [record, setRecord] = useState<GameRecord>({ played: 0, bestStreak: 0 });

  const gameTracks = useMemo(() => tracks.data?.map(toGameTrack) ?? [], [tracks.data]);

  useEffect(() => {
    if (account.data) setRecord(readGameRecord(account.data.id));
  }, [account.data]);

  // Links to #challenge arrive before the card exists; scroll once it's there
  const ready = !!account.data && !!tracks.data;
  useEffect(() => {
    if (ready && window.location.hash === "#challenge") {
      document.getElementById("challenge")?.scrollIntoView({ block: "start" });
    }
  }, [ready]);

  // A different time range is a different top 50: back to the start
  useEffect(() => {
    setMode(null);
    setFinished(null);
  }, [timeRange]);

  const playing = mode !== null && finished === null;

  const header = (
    <PageHeader
      title="Know yourself"
      subtitle="How well do you know your own listening?"
      actions={
        !playing && (
          <div className="w-full sm:w-auto">
            <TimeRangeControl fullWidth />
          </div>
        )
      }
    />
  );

  if (account.isLoading || tracks.isLoading) {
    return (
      <div>
        {header}
        <Loading />
      </div>
    );
  }

  if (account.isError || tracks.isError || !account.data || !tracks.data) {
    return (
      <div>
        {header}
        <Error />
      </div>
    );
  }

  const owner = account.data.id;
  const rangeLabel = TIME_RANGE_LONG_LABELS[timeRange].toLowerCase();

  const start = (next: Mode) => {
    setMode(next);
    setFinished(null);
    setGame((current) => current + 1);
  };

  const finish = (result: Finished) => {
    const results = result.rounds.map(({ correct }) => correct);
    const score =
      result.mode === "higherLower"
        ? results.filter(Boolean).length
        : (result.rounds as IntroRound[]).reduce((sum, { points }) => sum + points, 0);
    const total =
      result.mode === "higherLower" ? result.rounds.length : result.rounds.length * CLIP_POINTS[0];
    setRecord(saveGameResult(owner, { mode: result.mode, score, total, streak: getLongestStreak(results) }));
    setFinished(result);
  };

  const quit = () => {
    setMode(null);
    setFinished(null);
  };

  let board;
  if (gameTracks.length < MIN_TRACKS) {
    board = (
      <div className="card flex flex-col gap-2 p-8 text-center">
        <p className="font-display text-lg font-bold">Not enough songs to play yet</p>
        <p className="text-sm leading-relaxed text-muted">
          Spotify needs more listening history to rank your top songs. Try a longer time range.
        </p>
      </div>
    );
  } else if (finished) {
    const results = finished.rounds.map(({ correct }) => correct);
    const other = MODES.find((item) => item.mode !== finished.mode) as (typeof MODES)[number];
    const actions = (
      <>
        <Button onClick={() => start(finished.mode)}>Play again</Button>
        <Button variant="secondary" onClick={() => start(other.mode)}>
          Try {other.title}
        </Button>
        {finished.mode === "higherLower" && (
          <Button href="#challenge" variant="ghost">
            <LuLink aria-hidden size={16} />
            Challenge a friend
          </Button>
        )}
      </>
    );

    if (finished.mode === "higherLower") {
      const surprise = getBiggestSurprise(finished.rounds);
      const winner = surprise && getWinner(surprise.pair);
      const loser = surprise && surprise.pair.find((track) => track !== winner);
      board = (
        <GameResults
          eyebrow="Higher or lower · results"
          score={results.filter(Boolean).length}
          total={results.length}
          results={results}
          surprise={
            winner && loser
              ? {
                  text: `You play ${winner.name} (#${winner.rank}) more than ${loser.name} (#${loser.rank}).`,
                  image: winner.image,
                }
              : undefined
          }
          actions={actions}
        />
      );
    } else {
      const missed = finished.rounds.find(({ correct }) => !correct);
      board = (
        <GameResults
          eyebrow="Name that intro · results"
          score={finished.rounds.reduce((sum, { points }) => sum + points, 0)}
          total={finished.rounds.length * CLIP_POINTS[0]}
          results={results}
          surprise={
            missed
              ? { text: `You didn't recognise ${missed.track.name} from its intro.`, image: missed.track.image }
              : undefined
          }
          actions={actions}
        />
      );
    }
  } else if (mode === "higherLower") {
    board = (
      <HigherOrLower
        key={game}
        tracks={gameTracks}
        rangeLabel={rangeLabel}
        onDone={(rounds) => finish({ mode: "higherLower", rounds })}
        onQuit={quit}
      />
    );
  } else if (mode === "intro") {
    board = (
      <NameThatIntro
        key={game}
        tracks={tracks.data}
        onDone={(rounds) => finish({ mode: "intro", rounds })}
        onQuit={quit}
      />
    );
  } else {
    board = (
      <div className="grid gap-4 sm:grid-cols-2">
        {MODES.map(({ mode: item, title, text, tags, Icon, iconClass }) => (
          <button
            key={item}
            type="button"
            onClick={() => start(item)}
            className="card flex flex-col gap-3 rounded-3xl p-5 text-left transition hover:border-edge hover:bg-raised/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main lg:p-6"
          >
            <span className="flex w-full items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${iconClass}`}>
                <Icon aria-hidden size={24} />
              </span>
              <LuChevronRight aria-hidden size={22} className="text-muted" />
            </span>
            <span className="font-display text-[22px] font-bold">{title}</span>
            <span className="text-sm leading-relaxed text-soft">{text}</span>
            <span className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-raised px-2.5 py-1 text-xs font-bold text-subtle">
                  {tag}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">{board}</div>
        <aside className={`flex-col gap-4 ${playing ? "hidden lg:flex" : "flex"}`}>
          <RecordCard record={record} />
          <ChallengeLinkCard
            account={account.data}
            tracks={tracks.data}
            timeRange={timeRange}
            last={record.last}
          />
          <section className="card flex flex-col gap-3 rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold">How it works</h2>
            <p className="text-sm leading-relaxed text-soft">
              <strong className="text-fg">Higher or lower</strong> uses the ranking of your top 50
              for the time range you pick.
            </p>
            <p className="text-sm leading-relaxed text-soft">
              <strong className="text-fg">Name that intro</strong> plays the first seconds on your
              Spotify, so it takes over what&apos;s playing. It needs Premium and Spotify open on a
              phone or computer.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
