"use client";

import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuPlay, LuSmartphone, LuX, LuZap } from "react-icons/lu";
import API from "@/app/shared/api";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { EqualizerIcon } from "@/app/shared/components/EqualizerIcon";
import {
  CLIP_POINTS,
  CLIP_SECONDS,
  GameTrack,
  INTRO_ROUNDS,
  IntroRound,
  shuffle,
  toGameTrack,
} from "@/app/shared/helpers/knowYourself";
import { useToken } from "@/app/shared/hooks/useToken";
import { SpotifyTrack } from "@/app/shared/types";
import { RoundProgress } from "./RoundProgress";

// Songs from further down the top 50 are too hard to name from one second
const POOL = 30;
const OPTION_LETTERS = ["A", "B", "C", "D"];

type Question = { answer: GameTrack; options: GameTrack[] };

const createQuestions = (tracks: SpotifyTrack[]): Question[] => {
  const all = tracks.map(toGameTrack);
  return shuffle(all.slice(0, POOL))
    .slice(0, INTRO_ROUNDS)
    .map((answer) => {
      const index = answer.rank - 1;
      const artist = tracks[index].artists[0]?.id;
      const others = shuffle(all.filter(({ id }) => id !== answer.id));
      // One option by the same artist when there is one, so it's not too easy
      const sameArtist = others.find(
        ({ rank }) => tracks[rank - 1].artists[0]?.id === artist
      );
      const decoys = [
        ...(sameArtist ? [sameArtist] : []),
        ...others.filter((track) => track !== sameArtist),
      ].slice(0, 3);
      return { answer, options: shuffle([answer, ...decoys]) };
    });
};

/**
 * Plays the start of a track on the listener's own Spotify and pauses it
 * after a few seconds. Spotify allows this for Premium accounts only, with
 * Spotify open on some device.
 */
const useClipPlayer = () => {
  const token = useToken();
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  const headers = { Authorization: `Bearer ${token}` };

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (active.current) {
      active.current = false;
      API.put("v1/me/player/pause", null, { headers: { Authorization: `Bearer ${token}` } }).catch(
        () => undefined
      );
    }
    setPlaying(false);
  }, [token]);

  useEffect(() => stop, [stop]);

  const play = async (trackId: string, seconds: number) => {
    if (timer.current) clearTimeout(timer.current);
    setError(null);
    setPlaying(true);
    try {
      await API.put(
        "v1/me/player/play",
        { uris: [`spotify:track:${trackId}`], position_ms: 0 },
        { headers }
      );
      active.current = true;
      timer.current = setTimeout(stop, seconds * 1000);
    } catch (caught) {
      const status = (caught as AxiosError).response?.status;
      setPlaying(false);
      setError(
        status === 403
          ? "Playing songs needs Spotify Premium."
          : status === 404
            ? "Open Spotify on your phone or computer, then press play again."
            : "Spotify didn't respond. Try again."
      );
    }
  };

  return { play, stop, playing, error };
};

type Props = {
  tracks: SpotifyTrack[];
  onDone: (rounds: IntroRound[]) => void;
  onQuit: () => void;
};

export const NameThatIntro = ({ tracks, onDone, onQuit }: Props) => {
  const [questions] = useState(() => createQuestions(tracks));
  const [rounds, setRounds] = useState<IntroRound[]>([]);
  const [level, setLevel] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const player = useClipPlayer();

  const index = rounds.length - (picked ? 1 : 0);
  const { answer, options } = questions[index];
  const last = rounds[rounds.length - 1];
  const isLast = index + 1 >= questions.length;
  const score = rounds.reduce((sum, { points }) => sum + points, 0);
  const seconds = CLIP_SECONDS[level];
  const canHearMore = !picked && level < CLIP_SECONDS.length - 1;

  const pick = (track: GameTrack) => {
    if (picked) return;
    player.stop();
    const correct = track.id === answer.id;
    setPicked(track.id);
    setRounds((current) => [
      ...current,
      { track: answer, correct, points: correct ? CLIP_POINTS[level] : 0 },
    ]);
  };

  const next = () => {
    if (isLast) {
      onDone(rounds);
      return;
    }
    setPicked(null);
    setLevel(0);
  };

  const quit = () => {
    player.stop();
    onQuit();
  };

  return (
    <section className="card flex flex-col gap-5 rounded-3xl p-5 lg:p-7">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={quit}
          aria-label="Quit game"
          className="-m-2 flex h-11 w-11 items-center justify-center rounded-full text-subtle hover:bg-raised hover:text-white"
        >
          <LuX aria-hidden size={20} />
        </button>
        <p className="eyebrow text-muted">
          Round {index + 1} of {questions.length}
        </p>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-raised px-3 py-1.5 text-[13px] font-extrabold">
          <LuZap aria-hidden size={14} className="fill-[#8E7DFF] text-[#8E7DFF]" />
          {score} pts
        </span>
        <RoundProgress total={questions.length} results={rounds.map(({ correct }) => correct)} current={index} />
      </div>

      <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] lg:text-[36px]">
        Which song is this?
      </h2>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-[#10120F] p-5 lg:p-6">
          <p className="flex items-center gap-2 text-[13px] font-bold text-muted">
            <LuSmartphone aria-hidden size={16} className="text-main" />
            Plays where your Spotify is open
          </p>
          <div className="relative flex h-[184px] w-[184px] items-center justify-center lg:h-[200px] lg:w-[200px]">
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full border ${player.playing ? "animate-pulse border-main" : "border-line"}`}
            />
            <span
              aria-hidden
              className={`absolute inset-[18px] rounded-full border ${player.playing ? "border-main" : "border-line"}`}
            />
            <span aria-hidden className="absolute inset-[34px] overflow-hidden rounded-full border border-edge bg-surface">
              {picked && <Cover src={answer.image} alt="" radius="rounded-none" sizes="160px" />}
            </span>
            <button
              type="button"
              onClick={() => player.play(answer.id, seconds)}
              disabled={!!picked || player.playing}
              aria-label={`Play ${seconds} ${seconds === 1 ? "second" : "seconds"}`}
              className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-main text-on-main transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main disabled:cursor-default disabled:bg-edge disabled:text-muted"
            >
              {player.playing ? <EqualizerIcon size={26} /> : <LuPlay aria-hidden size={28} className="ml-1 fill-current" />}
            </button>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div aria-hidden className="flex h-2.5 gap-1">
              {CLIP_SECONDS.map((clip, clipIndex) => (
                <span
                  key={clip}
                  className={`rounded ${clipIndex <= level ? (player.playing ? "bg-main" : "bg-subtle") : "bg-edge"}`}
                  style={{ flex: clip }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-bold">
                {seconds} {seconds === 1 ? "second" : "seconds"} · worth {CLIP_POINTS[level]}{" "}
                {CLIP_POINTS[level] === 1 ? "pt" : "pts"}
              </span>
              <button
                type="button"
                onClick={() => setLevel((current) => current + 1)}
                disabled={!canHearMore}
                className="h-9 rounded-full border border-edge px-3.5 text-[13px] font-bold transition hover:bg-raised disabled:cursor-default disabled:text-[#4A5046] disabled:hover:bg-transparent"
              >
                Hear more +
              </button>
            </div>
          </div>
          {player.error && (
            <p role="alert" className="text-center text-sm font-semibold text-warn">
              {player.error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {options.map((option, optionIndex) => {
            const isAnswer = option.id === answer.id;
            const state = !picked ? "open" : isAnswer ? "right" : option.id === picked ? "wrong" : "revealed";
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => pick(option)}
                disabled={!!picked}
                className={`flex min-h-16 flex-1 items-center gap-3 rounded-[18px] border-2 px-4 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-default ${
                  state === "right"
                    ? "border-main bg-[#14241A]"
                    : state === "wrong"
                      ? "border-warn bg-[#10120F]"
                      : "border-line bg-[#10120F] enabled:hover:border-edge enabled:hover:bg-raised/40"
                }`}
              >
                <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-raised text-[13px] font-extrabold text-muted lg:flex">
                  {OPTION_LETTERS[optionIndex]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold lg:text-base">{option.name}</span>
                  <span className="block truncate text-xs text-muted lg:text-[13px]">{option.artists}</span>
                </span>
                {state === "right" && (
                  <span className="text-[13px] font-extrabold text-main">
                    {option.id === picked ? `+${last?.points ?? 0} pts` : "Answer"}
                  </span>
                )}
                {state === "wrong" && <span className="text-[13px] font-extrabold text-warn">0 pts</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-[52px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className={`text-[15px] font-semibold leading-snug lg:text-base ${
            !picked ? "text-muted" : last.correct ? "text-main" : "text-warn"
          }`}
        >
          {!picked
            ? "Press play, then pick the song. Fewer seconds, more points."
            : last.correct
              ? `Got it in ${seconds} ${seconds === 1 ? "second" : "seconds"}.`
              : `It was ${answer.name}.`}
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
