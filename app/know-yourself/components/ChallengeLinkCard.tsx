"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuCopy, LuShare2 } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import {
  createChallengePayload,
  GameRecord,
  getChallengeLink,
  HIGHER_LOWER_ROUNDS,
} from "@/app/shared/helpers/knowYourself";
import { SpotifyAccount, SpotifyTimeRanges, SpotifyTrack } from "@/app/shared/types";

type Props = {
  account: SpotifyAccount;
  tracks: SpotifyTrack[];
  timeRange: SpotifyTimeRanges;
  last?: GameRecord["last"];
};

/** A link a friend opens to play higher or lower with your songs. */
export const ChallengeLinkCard = ({ account, tracks, timeRange, last }: Props) => {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const firstName = (account.display_name || "Someone").split(" ")[0];

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    setLink(
      getChallengeLink(
        createChallengePayload({ firstName, userId: account.id, timeRange, tracks, last })
      )
    );
  }, [firstName, account.id, timeRange, tracks, last]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

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
        title: "Know yourself challenge on Statsfy",
        text: last
          ? `I got ${last.score}/${last.total} guessing my own top songs. Can you beat me?`
          : `Can you guess which of my songs I play more?`,
        url: link,
      });
    } catch {
      // Closing the share sheet is not an error
    }
  };

  return (
    <section id="challenge" className="flex scroll-mt-6 flex-col gap-3.5 rounded-3xl border border-line bg-raised p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex shrink-0">
          <InitialsAvatar
            name={account.display_name ?? ""}
            imageUrl={account.images?.[0]?.url}
            size={48}
            className="border-[3px] border-raised"
          />
          <InitialsAvatar name="" size={48} tone="unknown" className="-ml-3.5 border-[3px] border-raised" />
        </span>
        <h2 className="font-display text-lg font-bold leading-tight">
          {last ? `Can a friend beat your ${last.score}/${last.total}?` : "Challenge a friend"}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-soft">
        They get {HIGHER_LOWER_ROUNDS} rounds of higher or lower with your songs, no login needed. The link holds your
        first name, 16 of your top songs and your score, nothing else.
      </p>
      <label htmlFor="challenge-link" className="sr-only">
        Challenge link
      </label>
      <input
        id="challenge-link"
        type="text"
        readOnly
        value={link}
        onFocus={(event) => event.target.select()}
        className="h-11 min-w-0 rounded-xl border border-line bg-canvas px-3.5 text-[13px] font-semibold text-subtle"
      />
      <div className={`grid gap-2 ${canShare ? "grid-cols-2" : ""}`}>
        <Button onClick={copy} size="small" variant={copied ? "secondary" : "light"} disabled={!link}>
          {copied ? <LuCheck aria-hidden size={16} /> : <LuCopy aria-hidden size={16} />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        {canShare && (
          <Button onClick={share} size="small" variant="secondary" disabled={!link}>
            <LuShare2 aria-hidden size={16} />
            Share…
          </Button>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </p>
    </section>
  );
};
