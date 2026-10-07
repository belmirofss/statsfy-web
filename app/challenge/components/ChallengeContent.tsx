"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import { Loading } from "@/app/shared/components/Loading";
import { SpotifyLoginButton } from "@/app/shared/components/SpotifyLoginButton";
import {
  ChallengePayload,
  decodeChallengePayload,
  getBiggestSurprise,
  getChallengeTracks,
  getWinner,
  HIGHER_LOWER_ROUNDS,
  HigherLowerRound,
} from "@/app/shared/helpers/knowYourself";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { TIME_RANGE_LONG_LABELS } from "@/app/shared/timeRanges";
import { GameResults } from "../../know-yourself/components/GameResults";
import { HigherOrLower } from "../../know-yourself/components/HigherOrLower";

type LinkState =
  | { status: "reading" }
  | { status: "missing" }
  | { status: "ready"; payload: ChallengePayload };

const useChallengeLink = (): LinkState => {
  const [state, setState] = useState<LinkState>({ status: "reading" });

  useEffect(() => {
    const payload = decodeChallengePayload(window.location.hash.slice(1));
    setState(payload ? { status: "ready", payload } : { status: "missing" });
  }, []);

  return state;
};

const Invite = ({
  payload,
  ownLink,
  onPlay,
}: {
  payload: ChallengePayload;
  ownLink: boolean;
  onPlay: () => void;
}) => {
  const tracks = getChallengeTracks(payload);
  const name = payload.n;

  return (
    <section className="card mx-auto flex max-w-xl flex-col gap-6 px-6 py-9 lg:px-8">
      <span className="flex">
        <InitialsAvatar name={name} size={72} className="border-4 border-surface" />
        <InitialsAvatar name="" size={72} tone="unknown" className="-ml-4 border-4 border-surface" />
      </span>
      <div className="flex flex-col gap-2.5">
        <p className="eyebrow text-main">You&apos;ve been challenged</p>
        <h1 className="font-display text-[30px] font-bold leading-[1.05] tracking-[-0.03em] lg:text-[34px]">
          {payload.s
            ? `${name} knows their own taste ${payload.s[0]}/${payload.s[1]}. Do you know it better?`
            : `How well do you know ${name}'s music?`}
        </h1>
        <p className="text-[15px] leading-relaxed text-soft">
          {HIGHER_LOWER_ROUNDS} rounds of higher or lower with {name}&apos;s top songs from the{" "}
          {TIME_RANGE_LONG_LABELS[payload.r]?.toLowerCase() ?? "last few weeks"}. Guess which one{" "}
          {name} plays more.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-[#10120F] p-4">
        <p className="text-[13px] font-bold text-muted">From {name}&apos;s top 50</p>
        <div className="grid grid-cols-5 gap-2">
          {tracks.slice(0, 4).map((track) => (
            <span key={track.id} className="aspect-square overflow-hidden rounded-[10px]">
              <Cover src={track.image} alt="" radius="rounded-none" sizes="80px" />
            </span>
          ))}
          <span className="flex aspect-square items-center justify-center rounded-[10px] bg-raised text-xs font-extrabold text-muted">
            +{Math.max(tracks.length - 4, 0)}
          </span>
        </div>
      </div>
      {ownLink && (
        <p className="rounded-[14px] bg-raised p-3.5 text-sm leading-relaxed text-soft">
          This is your own challenge link. Send it to a friend and see if they know your taste.
        </p>
      )}
      <div className="flex flex-col gap-2.5">
        <Button onClick={onPlay} size="large" fullWidth>
          Play {name}&apos;s challenge
        </Button>
        <p className="text-center text-[13px] leading-relaxed text-muted">
          No login needed. Nothing is stored on our servers.
        </p>
      </div>
    </section>
  );
};

export const ChallengeContent = () => {
  const { status } = useSession();
  const account = useSpotifyAccount();
  const link = useChallengeLink();
  const [game, setGame] = useState(0);
  const [rounds, setRounds] = useState<HigherLowerRound[] | null>(null);

  const tracks = useMemo(
    () => (link.status === "ready" ? getChallengeTracks(link.payload) : []),
    [link]
  );

  if (link.status === "reading" || status === "loading") {
    return <Loading />;
  }

  if (link.status === "missing") {
    return (
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-10 text-center">
        <h1 className="font-display text-2xl font-bold">This challenge link doesn&apos;t work</h1>
        <p className="text-sm leading-relaxed text-muted">
          It may have been cut off when it was shared. Ask your friend to send it again, or play
          with your own songs.
        </p>
        <Button href="/know-yourself" size="small">
          Play with my songs
        </Button>
      </div>
    );
  }

  const { payload } = link;
  const name = payload.n;

  if (game === 0) {
    return (
      <Invite
        payload={payload}
        ownLink={account.data?.id === payload.u}
        onPlay={() => setGame(1)}
      />
    );
  }

  if (!rounds) {
    return (
      <HigherOrLower
        key={game}
        tracks={tracks}
        ownerName={name}
        rangeLabel={`${name}'s ${TIME_RANGE_LONG_LABELS[payload.r]?.toLowerCase() ?? "top songs"}`}
        onDone={setRounds}
        onQuit={() => setGame(0)}
      />
    );
  }

  const results = rounds.map(({ correct }) => correct);
  const score = results.filter(Boolean).length;
  const theirs = payload.s && Math.round((payload.s[0] / payload.s[1]) * results.length);
  const surprise = getBiggestSurprise(rounds);
  const winner = surprise && getWinner(surprise.pair);
  const loser = surprise && surprise.pair.find((track) => track !== winner);

  return (
    <GameResults
      eyebrow={`You vs ${name}'s taste`}
      score={score}
      total={results.length}
      results={results}
      headline={{
        title:
          theirs === undefined
            ? score >= results.length * 0.7
              ? `You know ${name}'s music`
              : `${name}'s taste surprised you`
            : score > theirs
              ? `Better than ${name}`
              : score === theirs
                ? `Tied with ${name}`
                : `${name} wins this one`,
        text: payload.s
          ? `${name} scored ${payload.s[0]}/${payload.s[1]} on their own taste. Now see how well you know yours.`
          : `Now see how well you know your own taste.`,
      }}
      surprise={
        winner && loser
          ? {
              text: `${name} plays ${winner.name} (#${winner.rank}) more than ${loser.name} (#${loser.rank}).`,
              image: winner.image,
            }
          : undefined
      }
      actions={
        <>
          {status === "authenticated" ? (
            <Button href="/know-yourself">Play with my songs</Button>
          ) : (
            <SpotifyLoginButton label="Play with my songs" size="regular" callbackPath="/know-yourself" />
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setRounds(null);
              setGame((current) => current + 1);
            }}
          >
            Play again
          </Button>
        </>
      }
    />
  );
};
