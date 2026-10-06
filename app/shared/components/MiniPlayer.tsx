"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuPause, LuPlay } from "react-icons/lu";
import { formatArtistsToArtistNames } from "../helpers/formatArtistsToArtistNames";
import { usePlaybackProgress } from "../hooks/usePlaybackProgress";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { useSpotifyAccount } from "../hooks/useSpotifyAccount";
import { useSpotifyCurrentlyPlaying } from "../hooks/useSpotifyCurrentlyPlaying";
import { Cover } from "./Cover";
import { EqualizerIcon } from "./EqualizerIcon";

const useNowPlaying = () => {
  const pathname = usePathname();
  const { data, dataUpdatedAt } = useSpotifyCurrentlyPlaying();
  const durationMs = data?.item.duration_ms ?? 0;
  const progress = usePlaybackProgress({
    progressMs: data?.progress_ms ?? 0,
    durationMs,
    isPlaying: !!data?.is_playing,
    updatedAt: dataUpdatedAt,
  });

  // The full player already shows all of this
  const hidden = !data || pathname === "/now-playing";

  return {
    data,
    hidden,
    percent: durationMs > 0 ? (progress / durationMs) * 100 : 0,
  };
};

/** Compact "now playing" card at the bottom of the desktop sidebar. */
export const SidebarMiniPlayer = () => {
  const { data, hidden, percent } = useNowPlaying();

  if (hidden || !data) return null;

  const track = data.item;

  return (
    <Link
      href="/now-playing"
      className="flex flex-col gap-2.5 rounded-[14px] border border-edge bg-surface p-3 transition hover:bg-raised"
    >
      <span className="flex items-center gap-2 text-main">
        <EqualizerIcon />
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.1em]">
          {data.is_playing ? "Now playing" : "Paused"}
        </span>
      </span>
      <span className="flex items-center gap-2.5">
        <Cover src={track.album.images[0]?.url} alt="" size={40} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-fg">{track.name}</span>
          <span className="block truncate text-xs text-muted">
            {formatArtistsToArtistNames(track.artists)}
          </span>
        </span>
      </span>
      <span className="block h-1 rounded-sm bg-edge">
        <span className="block h-1 rounded-sm bg-fg" style={{ width: `${percent}%` }} />
      </span>
    </Link>
  );
};

/** Floating player above the mobile tab bar. */
export const MobileMiniPlayer = () => {
  const { data, hidden, percent } = useNowPlaying();
  const controls = usePlayerControls();
  const { data: account } = useSpotifyAccount();
  // Playback control is Premium only. Spotify no longer shares `product` with
  // every app, so only hide the button when we know it won't work.
  const canControl = account?.product !== "free" && account?.product !== "open";

  if (hidden || !data) return null;

  const track = data.item;

  return (
    <div className="relative mx-2 flex items-center gap-2.5 overflow-hidden rounded-[14px] border border-edge bg-raised py-2 pl-2 pr-1.5">
      <Link
        href="/now-playing"
        aria-label={`Now playing: ${track.name}. Open player`}
        className="flex min-w-0 flex-1 items-center gap-2.5"
      >
        <Cover src={track.album.images[0]?.url} alt="" size={40} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-fg">{track.name}</span>
          <span className="block truncate text-xs text-muted">
            {formatArtistsToArtistNames(track.artists)}
          </span>
        </span>
      </Link>
      {canControl && (
        <button
          type="button"
          aria-label={data.is_playing ? "Pause" : "Play"}
          onClick={() => controls.run(data.is_playing ? "pause" : "play")}
          disabled={controls.isPending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg disabled:opacity-50"
        >
          {data.is_playing ? <LuPause aria-hidden size={22} /> : <LuPlay aria-hidden size={22} />}
        </button>
      )}
      <span className="absolute inset-x-2.5 bottom-[3px] h-[3px] rounded-sm bg-edge">
        <span className="block h-[3px] rounded-sm bg-fg" style={{ width: `${percent}%` }} />
      </span>
    </div>
  );
};
