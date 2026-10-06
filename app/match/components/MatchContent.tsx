"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/app/shared/components/Button";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import { Loading } from "@/app/shared/components/Loading";
import { SpotifyLoginButton } from "@/app/shared/components/SpotifyLoginButton";
import {
  decodeMatchPayload,
  MatchPayload,
  readPendingMatch,
  storePendingMatch,
} from "@/app/shared/helpers/tasteMatch";
import { MatchResultView } from "./MatchResultView";

type LinkState =
  | { status: "reading" }
  | { status: "missing" }
  | { status: "ready"; payload: MatchPayload; encoded: string };

const useMatchLink = (): LinkState => {
  const [state, setState] = useState<LinkState>({ status: "reading" });

  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    const encoded = fromHash || readPendingMatch() || "";
    const payload = encoded ? decodeMatchPayload(encoded) : null;

    if (!payload) {
      setState({ status: "missing" });
      return;
    }

    storePendingMatch(encoded);
    // Put the data back in the address bar so the page can be reloaded or bookmarked
    if (!fromHash) {
      window.history.replaceState(null, "", `/match#${encoded}`);
    }
    setState({ status: "ready", payload, encoded });
  }, []);

  return state;
};

const Invite = ({ payload }: { payload: MatchPayload }) => (
  <div className="card mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-10 text-center">
    <span className="flex">
      <InitialsAvatar name={payload.n} size={76} className="border-4 border-surface" />
      <InitialsAvatar name="" size={76} tone="unknown" className="-ml-5 border-4 border-surface" />
    </span>
    <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em]">
      {payload.n} wants to compare music taste with you
    </h1>
    <p className="text-base leading-relaxed text-soft">
      Log in with Spotify to see your match score, the artists you share and what to play next.
      Nothing is stored on our servers.
    </p>
    <SpotifyLoginButton callbackPath="/match" />
  </div>
);

export const MatchContent = () => {
  const { status } = useSession();
  const link = useMatchLink();

  if (link.status === "reading" || status === "loading") {
    return <Loading />;
  }

  if (link.status === "missing") {
    return (
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-10 text-center">
        <h1 className="font-display text-2xl font-bold">This match link doesn&apos;t work</h1>
        <p className="text-sm leading-relaxed text-muted">
          It may have been cut off when it was shared. Ask your friend to send it again, or make
          your own link to compare with someone.
        </p>
        <Button href="/share/compare" size="small">
          Get my match link
        </Button>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Invite payload={link.payload} />;
  }

  return <MatchResultView payload={link.payload} encoded={link.encoded} />;
};
