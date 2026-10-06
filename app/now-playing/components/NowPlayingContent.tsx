"use client";

import { LuPause, LuPlay, LuSkipBack, LuSkipForward } from "react-icons/lu";
import { Cover } from "@/app/shared/components/Cover";
import { EqualizerIcon } from "@/app/shared/components/EqualizerIcon";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { TrackRow } from "@/app/shared/components/Rows";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { getTimeMachineStats } from "@/app/shared/helpers/getTimeMachineStats";
import { getReleaseYear } from "@/app/shared/helpers/releaseDates";
import { useLyrics } from "@/app/shared/hooks/useLyrics";
import { formatDuration, usePlaybackProgress } from "@/app/shared/hooks/usePlaybackProgress";
import { usePlayerControls } from "@/app/shared/hooks/usePlayerControls";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyCurrentlyPlaying } from "@/app/shared/hooks/useSpotifyCurrentlyPlaying";
import { useSpotifyQueue } from "@/app/shared/hooks/useSpotifyQueue";
import { useSpotifyRecentlyPlayed } from "@/app/shared/hooks/useSpotifyRecentlyPlayed";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { SpotifyTimeRanges, SpotifyTrack } from "@/app/shared/types";
import { SyncedLyrics } from "./SyncedLyrics";

const Fact = ({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) => (
  <span className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-raised p-3">
    <span className={`font-display text-2xl font-bold ${highlight ? "text-main" : ""}`}>{value}</span>
    <span className="text-xs leading-snug text-soft">{label}</span>
  </span>
);

const TrackFacts = ({ track }: { track: SpotifyTrack }) => {
  const topTracks = useSpotifyTopTracks({ timeRange: SpotifyTimeRanges.SHORT });
  const topArtists = useSpotifyTopArtists({ timeRange: SpotifyTimeRanges.SHORT });
  const recent = useSpotifyRecentlyPlayed();

  const trackRank = topTracks.data?.findIndex(({ id }) => id === track.id) ?? -1;
  const mainArtist = track.artists[0];
  const artistRank = topArtists.data?.findIndex(({ id }) => id === mainArtist?.id) ?? -1;
  const plays = recent.data?.filter((item) => item.track.id === track.id).length ?? 0;
  const year = getReleaseYear(track.album);
  const musicYear = topTracks.data ? getTimeMachineStats(topTracks.data)?.averageYear : undefined;

  const facts = [
    trackRank >= 0 && { value: `#${trackRank + 1}`, label: "in your top tracks, 4 weeks", highlight: true },
    { value: `${plays}×`, label: "in your last 50 plays" },
    artistRank >= 0 && { value: `#${artistRank + 1}`, label: `${mainArtist.name} in your top artists` },
    year && {
      value: String(year),
      label:
        musicYear && musicYear !== year
          ? `released, ${Math.abs(year - musicYear)} years ${year > musicYear ? "newer" : "older"} than your music year`
          : "released",
    },
  ].filter(Boolean) as { value: string; label: string; highlight?: boolean }[];

  return (
    <section className="card flex flex-col gap-3 p-5">
      <h2 className="font-display text-[17px] font-bold">You and this track</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {facts.map((fact) => (
          <Fact key={fact.label} {...fact} />
        ))}
      </div>
    </section>
  );
};

export const NowPlayingContent = () => {
  const { data, dataUpdatedAt, isLoading, isError } = useSpotifyCurrentlyPlaying({
    refetchInterval: 4000,
  });
  const account = useSpotifyAccount();
  const controls = usePlayerControls();
  const queue = useSpotifyQueue({ enabled: !!data });
  const track = data?.item;
  const lyrics = useLyrics(track);
  const durationMs = track?.duration_ms ?? 0;
  const progress = usePlaybackProgress({
    progressMs: data?.progress_ms ?? 0,
    durationMs,
    isPlaying: !!data?.is_playing,
    updatedAt: dataUpdatedAt,
  });
  // Playback control is Premium only; Spotify doesn't always tell us the plan
  const canControl = account.data?.product !== "free" && account.data?.product !== "open";

  if (isLoading || isError) {
    return (
      <div>
        <PageHeader title="Now playing" />
        {isError ? <Error /> : <Loading />}
      </div>
    );
  }

  if (!data || !track) {
    return (
      <div>
        <PageHeader title="Now playing" />
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-2 p-10 text-center">
          <EqualizerIcon size={28} className="text-muted" />
          <p className="font-display text-lg font-bold">Nothing playing right now</p>
          <p className="text-sm text-muted">
            Start something on Spotify and it&apos;ll show up here with lyrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <section className="card flex flex-col gap-4 rounded-3xl p-5">
          <p className="flex items-center gap-2 text-main">
            <EqualizerIcon />
            <span className="eyebrow">
              {data.is_playing ? "Now playing" : "Paused"}
              {data.device?.name ? ` on ${data.device.name}` : ""}
            </span>
          </p>
          <Cover
            src={track.album.images[0]?.url}
            alt={`${track.album.name} cover`}
            radius="rounded-2xl"
            className="aspect-square"
            sizes="380px"
            eager
          />
          <div>
            <h1 className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em]">
              {track.name}
            </h1>
            <p className="text-[15px] text-soft">
              {formatArtistsToArtistNames(track.artists)} · {track.album.name}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="h-1.5 rounded bg-edge">
              <span
                className="block h-1.5 rounded bg-fg"
                style={{ width: `${durationMs > 0 ? (progress / durationMs) * 100 : 0}%` }}
              />
            </span>
            <span className="flex justify-between text-xs font-bold text-muted">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(durationMs)}</span>
            </span>
          </div>
          {canControl && (
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => controls.run("previous")}
                disabled={controls.isPending}
                className="flex h-12 w-12 items-center justify-center rounded-full text-fg hover:bg-raised disabled:opacity-50"
              >
                <LuSkipBack aria-hidden size={22} />
              </button>
              <button
                type="button"
                aria-label={data.is_playing ? "Pause" : "Play"}
                onClick={() => controls.run(data.is_playing ? "pause" : "play")}
                disabled={controls.isPending}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-fg text-canvas hover:bg-white disabled:opacity-50"
              >
                {data.is_playing ? <LuPause aria-hidden size={24} /> : <LuPlay aria-hidden size={24} />}
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => controls.run("next")}
                disabled={controls.isPending}
                className="flex h-12 w-12 items-center justify-center rounded-full text-fg hover:bg-raised disabled:opacity-50"
              >
                <LuSkipForward aria-hidden size={22} />
              </button>
            </div>
          )}
          <p role="status" aria-live="polite" className="min-h-4 text-center text-xs text-muted">
            {controls.error ?? (canControl ? "Controls work with Spotify Premium" : "")}
          </p>
        </section>

        <TrackFacts track={track} />
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <section className="card flex flex-col gap-4 rounded-3xl p-5 lg:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold">Lyrics</h2>
            <p className="text-xs text-muted">
              From{" "}
              <a
                href="https://lrclib.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-subtle hover:text-white"
              >
                LRCLIB
              </a>
              {canControl && " · tap a line to jump there"}
            </p>
          </div>
          <SyncedLyrics
            lyrics={lyrics.data}
            isLoading={lyrics.isLoading}
            progressMs={progress}
            onSeek={canControl ? (ms) => controls.run({ seek: ms }) : undefined}
          />
        </section>

        {queue.data && queue.data.length > 0 && (
          <section className="card flex flex-col gap-2 p-5">
            <h2 className="font-display text-[17px] font-bold">Up next</h2>
            <ol>
              {queue.data.map((item, index) => (
                <TrackRow
                  key={`${item.id}-${index}`}
                  track={item}
                  right={
                    item.duration_ms ? (
                      <span className="text-xs font-bold text-muted">
                        {formatDuration(item.duration_ms)}
                      </span>
                    ) : undefined
                  }
                />
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};
