"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuCheck, LuCopy, LuShare2, LuShieldCheck } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { SegmentedControl } from "@/app/shared/components/SegmentedControl";
import {
  createMatchPayload,
  encodeMatchPayload,
  MATCH_ITEMS,
  readSavedMatches,
  SavedMatch,
} from "@/app/shared/helpers/tasteMatch";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { TIME_RANGE_OPTIONS } from "@/app/shared/timeRanges";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { ShareTabs } from "./ShareTabs";

const STEPS = ["Send your link", "They log in with Spotify", "They see your match"];

export const CompareContent = () => {
  const [timeRange, setTimeRange] = useState(SpotifyTimeRanges.MEDIUM);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const account = useSpotifyAccount();
  const artists = useSpotifyTopArtists({ timeRange });
  const tracks = useSpotifyTopTracks({ timeRange });

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (account.data) setMatches(readSavedMatches(account.data.id));
  }, [account.data]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const header = (
    <>
      <PageHeader title="Share" subtitle="Design your image, or compare your taste with a friend." />
      <ShareTabs />
    </>
  );

  if (account.isLoading || artists.isLoading || tracks.isLoading) {
    return (
      <div>
        {header}
        <Loading />
      </div>
    );
  }

  if (account.isError || artists.isError || tracks.isError || !account.data || !artists.data || !tracks.data) {
    return (
      <div>
        {header}
        <Error />
      </div>
    );
  }

  const name = account.data.display_name || "Someone";
  const firstName = name.split(" ")[0];
  const payload = createMatchPayload({
    firstName,
    userId: account.data.id,
    timeRange,
    artists: artists.data,
    tracks: tracks.data,
  });
  const link = `${window.location.origin}/match#${encodeMatchPayload(payload)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the link is still selectable in the field
    }
  };

  const share = async () => {
    try {
      await navigator.share({
        title: "Compare music taste on Statsfy",
        text: `${firstName} wants to compare music taste with you`,
        url: link,
      });
    } catch {
      // Closing the share sheet is not an error
    }
  };

  return (
    <div>
      {header}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-5 rounded-3xl p-5 lg:p-7">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-[22px] font-bold lg:text-2xl">Your match link</h2>
            <p className="text-[15px] leading-relaxed text-soft">
              Send it to anyone with Spotify. When they open it and log in, they see how well
              your taste matches and a few artists to try.
            </p>
          </div>

          <ol className="grid gap-2.5 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-[14px] bg-raised p-3.5 sm:flex-col sm:items-start">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                    index === 0 ? "bg-main text-on-main" : "bg-edge text-fg"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-bold">{step}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-2">
            <label htmlFor="match-link" className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
              Link
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="match-link"
                type="text"
                readOnly
                value={link}
                onFocus={(event) => event.target.select()}
                className="h-12 min-w-0 flex-1 rounded-xl border border-edge bg-canvas px-4 text-sm font-semibold text-fg"
              />
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button onClick={copy} size="regular" variant={copied ? "secondary" : "primary"}>
                  {copied ? <LuCheck aria-hidden size={18} /> : <LuCopy aria-hidden size={18} />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
                {canShare && (
                  <Button onClick={share} size="regular" variant="secondary">
                    <LuShare2 aria-hidden size={16} />
                    Share…
                  </Button>
                )}
              </div>
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {copied ? "Link copied" : ""}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold">Compare using</p>
            <SegmentedControl
              label="Compare using"
              shape="rounded"
              options={TIME_RANGE_OPTIONS}
              value={timeRange}
              onChange={setTimeRange}
            />
          </div>

          <p className="flex gap-2.5 rounded-[14px] bg-raised p-3.5 text-[13px] leading-relaxed text-soft">
            <LuShieldCheck aria-hidden size={18} className="mt-px shrink-0 text-main" />
            The link carries your first name and your top {MATCH_ITEMS} artists and tracks, nothing
            else. It isn&apos;t stored on our servers, so anyone you send it to can see those lists.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl border border-line bg-[#121411] p-5 lg:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
            What your friend sees
          </p>
          <div className="flex flex-col items-center gap-4 rounded-[20px] border border-line bg-canvas px-5 py-7 text-center">
            <span className="flex">
              <InitialsAvatar name={name} size={64} imageUrl={account.data.images?.[0]?.url} className="border-[3px] border-canvas" />
              <InitialsAvatar name="" size={64} tone="unknown" className="-ml-4 border-[3px] border-canvas" />
            </span>
            <p className="font-display text-2xl font-bold leading-tight">
              {firstName} wants to compare music taste with you
            </p>
            <p className="text-sm leading-relaxed text-soft">
              Log in with Spotify to see your match score, the artists you share and what to play
              next.
            </p>
          </div>
        </section>
      </div>

      {matches.length > 0 && (
        <section className="mt-6 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold">Your matches</h2>
            <p className="text-[13px] text-muted">Saved on this device only</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <li key={match.friendId}>
                <Link
                  href={match.link}
                  className="card flex items-center gap-3 p-3.5 transition hover:bg-raised"
                >
                  <InitialsAvatar name={match.friendName} size={44} tone="friend" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{match.friendName}</span>
                    <span className="block text-xs text-muted">
                      {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" · "}
                      {match.tier}
                    </span>
                  </span>
                  <span
                    className={`font-display text-[22px] font-bold ${match.score >= 60 ? "text-main" : "text-subtle"}`}
                  >
                    {match.score}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
