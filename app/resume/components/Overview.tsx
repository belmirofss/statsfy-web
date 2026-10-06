"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { ArtistRow, TrackRow } from "@/app/shared/components/Rows";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { calculateTimestampDiffToNow } from "@/app/shared/helpers/calculateTimestampDiffToNow";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { getInitials } from "@/app/shared/helpers/getInitials";
import { getTopGenres } from "@/app/shared/helpers/getTopGenres";
import { EqualizerIcon } from "@/app/shared/components/EqualizerIcon";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import { ReleaseCard } from "@/app/shared/components/ReleaseCard";
import { useNewReleases } from "@/app/shared/hooks/useNewReleases";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyCurrentlyPlaying } from "@/app/shared/hooks/useSpotifyCurrentlyPlaying";
import { useSpotifyRecentlyPlayed } from "@/app/shared/hooks/useSpotifyRecentlyPlayed";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TasteTiles } from "./TasteTiles";

// Releases this recent get a "New release" badge in the top artists panel
const FRESH_RELEASE_DAYS = 30;

const useGreeting = () => {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    );
  }, []);

  return greeting;
};

const Panel = ({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`card flex flex-col gap-2.5 p-5 ${className}`}>
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const SeeAll = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="py-1 text-[13px] font-bold text-subtle hover:text-white">
    {label} →
  </Link>
);

export const Overview = () => {
  const { timeRange } = usePreferences();
  const greeting = useGreeting();
  const account = useSpotifyAccount();
  const tracks = useSpotifyTopTracks({ timeRange });
  const artists = useSpotifyTopArtists({ timeRange });
  const recent = useSpotifyRecentlyPlayed();
  const nowPlaying = useSpotifyCurrentlyPlaying();
  const releases = useNewReleases();

  const firstName = account.data?.display_name?.split(" ")[0];
  const topTrack = tracks.data?.[0];
  const topArtist = artists.data?.[0];
  const genres = getTopGenres(artists.data ?? [], 3);
  const freshCutoff = Date.now() - FRESH_RELEASE_DAYS * 24 * 60 * 60 * 1000;
  const freshArtistIds = new Set(
    releases.data
      ?.filter((release) => release.date.getTime() >= freshCutoff)
      .map((release) => release.artist.id)
  );
  const playingTrack = nowPlaying.data?.item;

  const renderState = (query: { isLoading: boolean; isError: boolean }) => {
    if (query.isLoading) return <Loading />;
    if (query.isError) return <Error />;
    return null;
  };

  return (
    <div>
      <PageHeader
        title={`${greeting}${firstName ? `, ${firstName}` : ""}`}
        subtitle="Here's what you've been playing."
        actions={
          <>
            <div className="w-full sm:w-auto">
              <TimeRangeControl fullWidth />
            </div>
            <Button href="/share" size="small" className="hidden sm:inline-flex">
              <LuShare aria-hidden size={16} />
              Share
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <section className="card flex items-center gap-4 p-4 md:col-span-2 lg:gap-5 lg:p-5">
          {renderState(tracks) ??
            (topTrack && (
              <>
                <Cover
                  src={topTrack.album.images[0]?.url}
                  alt={`${topTrack.album.name} cover`}
                  size={148}
                  radius="rounded-[14px]"
                  className="hidden sm:block"
                  eager
                />
                <Cover
                  src={topTrack.album.images[0]?.url}
                  alt={`${topTrack.album.name} cover`}
                  size={88}
                  radius="rounded-xl"
                  className="sm:hidden"
                  eager
                />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <p className="eyebrow text-main">#1 track</p>
                  <p className="font-display text-[22px] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[30px]">
                    {topTrack.name}
                  </p>
                  <p className="text-sm text-muted lg:text-[15px]">
                    {formatArtistsToArtistNames(topTrack.artists)} ·{" "}
                    {topTrack.album.name}
                  </p>
                </div>
              </>
            ))}
        </section>

        <section className="card flex flex-col items-start gap-3 p-5">
          <p className="eyebrow text-main">#1 artist</p>
          {renderState(artists) ??
            (topArtist && (
              <>
                <Cover
                  src={topArtist.images?.[0]?.url}
                  alt={topArtist.name}
                  size={76}
                  shape="circle"
                  fallback={getInitials(topArtist.name)}
                  eager
                />
                <p className="font-display text-[22px] font-bold leading-tight">
                  {topArtist.name}
                </p>
              </>
            ))}
        </section>

        <section className="card flex flex-col gap-2.5 p-5">
          <p className="eyebrow text-muted">Top genres</p>
          {renderState(artists) ??
            (genres.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {genres.map((genre) => (
                  <li key={genre.name} className="flex flex-col gap-1">
                    <span className="flex justify-between gap-2 text-[13px] font-semibold">
                      <span className="truncate">{genre.name}</span>
                      <span className="text-muted">{genre.percent}%</span>
                    </span>
                    <span className="h-1.5 rounded bg-line">
                      <span
                        className="block h-1.5 rounded bg-main"
                        style={{ width: `${genre.percent}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                Spotify hasn&apos;t shared genres for your top artists yet.
              </p>
            ))}
        </section>
      </div>

      <div className="mt-6">
        <TasteTiles tracks={tracks.data} artists={artists.data} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Panel title="Top tracks" action={<SeeAll href="/top-tracks" label="See all 50" />}>
          {renderState(tracks) ?? (
            <ol>
              {tracks.data?.slice(0, 5).map((track, index) => (
                <TrackRow key={track.id} track={track} rank={index + 1} />
              ))}
            </ol>
          )}
        </Panel>

        <Panel title="Top artists" action={<SeeAll href="/top-artists" label="See all 50" />}>
          {renderState(artists) ?? (
            <ol>
              {artists.data?.slice(0, 5).map((artist, index) => (
                <ArtistRow
                  key={artist.id}
                  artist={artist}
                  rank={index + 1}
                  right={
                    freshArtistIds.has(artist.id) && (
                      <Link
                        href="/new-releases"
                        className="whitespace-nowrap rounded-full border border-main px-2.5 py-1 text-[11px] font-extrabold text-main"
                      >
                        New release
                      </Link>
                    )
                  }
                />
              ))}
            </ol>
          )}
        </Panel>

        <Panel
          title="Recently played"
          className="md:col-span-2 lg:col-span-1"
          action={<SeeAll href="/recently-played" label="See all" />}
        >
          {playingTrack && (
            <Link
              href="/now-playing"
              className="-mx-2 flex items-center gap-3 rounded-xl bg-raised p-2 transition hover:bg-edge"
            >
              <Cover src={playingTrack.album.images[0]?.url} alt="" size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{playingTrack.name}</span>
                <span className="block truncate text-xs text-muted">
                  {formatArtistsToArtistNames(playingTrack.artists)}
                </span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-extrabold text-main">
                <EqualizerIcon size={12} />
                Playing now
              </span>
            </Link>
          )}
          {renderState(recent) ?? (
            <ul>
              {recent.data?.slice(0, 5).map((item) => (
                <TrackRow
                  key={item.played_at}
                  track={item.track}
                  right={
                    <span className="whitespace-nowrap text-xs text-muted">
                      {calculateTimestampDiffToNow(item.played_at)} ago
                    </span>
                  }
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          title="New from your artists"
          action={<SeeAll href="/new-releases" label={releases.data?.length ? `See all ${releases.data.length}` : "See all"} />}
        >
          {releases.isLoading ? (
            <Loading label="Checking your artists for new releases" />
          ) : releases.data && releases.data.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
              {releases.data.slice(0, 4).map((release) => (
                <li key={release.album.id} className="min-w-0">
                  <ReleaseCard release={release} showReason={false} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-muted">
              Nothing new from your artists in the last few months.
            </p>
          )}
        </Panel>

        <section className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-raised p-5">
          <h2 className="font-display text-lg font-bold">Compare with a friend</h2>
          <div className="flex items-center gap-4">
            <span className="flex">
              <InitialsAvatar
                name={account.data?.display_name ?? ""}
                imageUrl={account.data?.images?.[0]?.url}
                size={52}
                className="border-[3px] border-raised"
              />
              <InitialsAvatar name="" size={52} tone="unknown" className="-ml-3.5 border-[3px] border-raised" />
            </span>
            <span className="font-display text-[30px] font-bold text-muted">??%</span>
          </div>
          <p className="text-sm leading-relaxed text-soft">
            Send a link. When your friend logs in, they see how much your taste overlaps and what
            to play next.
          </p>
          <Button href="/share/compare" variant="light" size="small" className="self-start">
            Get my match link
          </Button>
        </section>
      </div>
    </div>
  );
};
