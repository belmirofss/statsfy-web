"use client";

import { useEffect } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { InitialsAvatar } from "@/app/shared/components/InitialsAvatar";
import { Loading } from "@/app/shared/components/Loading";
import { ArtistRow, TrackRow } from "@/app/shared/components/Rows";
import { SpotifyLoginButton } from "@/app/shared/components/SpotifyLoginButton";
import { getInitials } from "@/app/shared/helpers/getInitials";
import {
  computeMatch,
  GenreComparison,
  MatchPayload,
  saveMatch,
} from "@/app/shared/helpers/tasteMatch";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyArtists } from "@/app/shared/hooks/useSpotifyArtists";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { TIME_RANGE_LONG_LABELS } from "@/app/shared/timeRanges";
import { SpotifyTimeRanges } from "@/app/shared/types";

const YOU = "#F4A259";
const FRIEND = "#8E7DFF";

// "You lean electronic; Maya goes deeper into jazz", from the biggest gaps
const describeDifference = (genres: GenreComparison[], friend: string) => {
  const mine = [...genres].sort((a, b) => b.mine - b.theirs - (a.mine - a.theirs))[0];
  const theirs = [...genres].sort((a, b) => b.theirs - b.mine - (a.theirs - a.mine))[0];
  const parts = [];
  if (theirs && theirs.theirs - theirs.mine >= 10) {
    parts.push(`${friend} goes deeper into ${theirs.name.toLowerCase()}`);
  }
  if (mine && mine.mine - mine.theirs >= 10) {
    parts.push(`you lean ${mine.name.toLowerCase()}`);
  }
  return parts.length > 0 ? `${parts.join(", and ")}.` : "";
};

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="card flex flex-col gap-3 p-5">
    <div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {subtitle && <p className="text-[13px] text-muted">{subtitle}</p>}
    </div>
    {children}
  </section>
);

export const MatchResultView = ({ payload, encoded }: { payload: MatchPayload; encoded: string }) => {
  const timeRange = payload.r ?? SpotifyTimeRanges.MEDIUM;
  const account = useSpotifyAccount();
  const artists = useSpotifyTopArtists({ timeRange });
  const tracks = useSpotifyTopTracks({ timeRange });
  const isOwnLink = account.data?.id === payload.u;
  const result =
    artists.data && tracks.data && !isOwnLink
      ? computeMatch({ payload, artists: artists.data, tracks: tracks.data })
      : null;
  const theirPicks = useSpotifyArtists(result?.theirPicks.map(({ id }) => id) ?? []);

  useEffect(() => {
    if (!result || !account.data) return;
    saveMatch({
      owner: account.data.id,
      friendId: payload.u,
      friendName: payload.n,
      score: result.score,
      tier: result.tier,
      sharedArtists: result.sharedArtists.length,
      topSharedArtist: result.sharedArtists[0]?.artist.name ?? null,
      date: new Date().toISOString(),
      link: `/match#${encoded}`,
    });
    // Save once per result; `result` is recomputed on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.score, account.data?.id, payload.u]);

  if (account.isError || artists.isError || tracks.isError) {
    return (
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-10 text-center">
        <p className="font-display text-xl font-bold">Your Spotify session has expired</p>
        <p className="text-sm text-muted">Log in again to see your match with {payload.n}.</p>
        <SpotifyLoginButton callbackPath="/match" />
      </div>
    );
  }

  if (!account.data || !artists.data || !tracks.data) {
    return <Loading />;
  }

  if (isOwnLink || !result) {
    return (
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="font-display text-2xl font-bold">This is your own match link</p>
        <p className="text-sm leading-relaxed text-muted">
          Send it to a friend. When they open it, they&apos;ll see how your taste compares.
        </p>
        <Button href="/share/compare" size="small">
          Back to your link
        </Button>
      </div>
    );
  }

  const myName = account.data.display_name || "You";
  const difference = describeDifference(result.genres, payload.n);
  const maxGenre = Math.max(1, ...result.genres.flatMap(({ mine, theirs }) => [mine, theirs]));

  return (
    <div className="flex flex-col gap-4">
      <section className="card flex flex-col items-center gap-6 rounded-3xl p-6 text-center lg:flex-row lg:p-8 lg:text-left">
        <span className="flex shrink-0">
          <InitialsAvatar
            name={myName}
            size={104}
            imageUrl={account.data.images?.[0]?.url}
            className="border-4 border-surface"
          />
          <InitialsAvatar name={payload.n} size={104} tone="friend" className="-ml-7 border-4 border-surface" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="eyebrow text-main">
            You × {payload.n} · {TIME_RANGE_LONG_LABELS[timeRange].toLowerCase()}
          </p>
          <p className="flex flex-wrap items-baseline justify-center gap-x-4 lg:justify-start">
            <span className="font-display text-[72px] font-bold leading-[0.9] tracking-[-0.04em] lg:text-[84px]">
              {result.score}%
            </span>
            <span className="font-display text-2xl font-bold text-main lg:text-[28px]">{result.tier}</span>
          </p>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-soft">
            You share {result.sharedArtists.length}{" "}
            {result.sharedArtists.length === 1 ? "artist" : "artists"} and {result.sharedTracks.length}{" "}
            {result.sharedTracks.length === 1 ? "track" : "tracks"}.{" "}
            {difference && difference[0].toUpperCase() + difference.slice(1)}
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-col">
          <Button href="/share?template=story" size="small">
            Share result
          </Button>
          <Button href="/share/compare" variant="secondary" size="small">
            Send {payload.n} yours
          </Button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Section title="How the score adds up">
          <div className="flex flex-col gap-4">
            {result.parts.map((part) => (
              <div key={part.label} className="flex flex-col gap-1.5">
                <span className="flex justify-between text-sm font-bold">
                  <span>{part.label}</span>
                  <span className="text-subtle">{part.value}%</span>
                </span>
                <span className="h-2.5 rounded-full bg-line">
                  <span className="block h-2.5 rounded-full bg-main" style={{ width: `${part.value}%` }} />
                </span>
                <span className="text-xs text-muted">
                  {part.note} · {Math.round(part.weight * 100)}% of the score
                </span>
              </div>
            ))}
          </div>
        </Section>

        {result.genres.length > 0 && (
          <Section title="Where your taste differs" subtitle="Share of each person's top artists">
            <div className="flex gap-4 text-xs font-bold text-soft">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: YOU }} />
                You
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FRIEND }} />
                {payload.n}
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {result.genres.map((genre) => (
                <li key={genre.name} className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold">{genre.name}</span>
                  {[
                    { value: genre.mine, color: YOU },
                    { value: genre.theirs, color: FRIEND },
                  ].map(({ value, color }) => (
                    <span key={color} className="flex items-center gap-2">
                      <span
                        className="block h-2.5 rounded-sm"
                        style={{ width: `${Math.max(1, (value / maxGenre) * 85)}%`, background: color }}
                      />
                      <span className="text-[11px] font-bold text-subtle">{value}%</span>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {result.sharedArtists.length > 0 && (
        <Section
          title={`${result.sharedArtists.length} ${result.sharedArtists.length === 1 ? "artist" : "artists"} you both love`}
          subtitle={`Your rank · ${payload.n}'s rank`}
        >
          <ul className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 lg:grid-cols-6">
            {result.sharedArtists.slice(0, 12).map(({ artist, myRank, theirRank }) => (
              <li key={artist.id} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
                <Cover
                  src={artist.images?.[0]?.url}
                  alt=""
                  size={64}
                  shape="circle"
                  fallback={getInitials(artist.name)}
                />
                <span className="w-full truncate text-[13px] font-bold">{artist.name}</span>
                <span className="text-[11px] font-bold text-muted">
                  #{myRank} · #{theirRank}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title={`From ${payload.n}, for you`} subtitle="Their favourites that aren't in your top 50">
          {theirPicks.isLoading ? (
            <Loading />
          ) : (
            <ol>
              {theirPicks.artists.map((artist) => {
                const rank = result.theirPicks.find(({ id }) => id === artist.id)?.rank;
                return (
                  <ArtistRow
                    key={artist.id}
                    artist={artist}
                    right={
                      <span className="flex items-center gap-2">
                        {rank && <span className="text-xs font-bold text-muted">their #{rank}</span>}
                        {artist.external_urls?.spotify && (
                          <a
                            href={artist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${artist.name} in Spotify`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-edge text-subtle hover:text-white"
                          >
                            <LuArrowUpRight aria-hidden size={16} />
                          </a>
                        )}
                      </span>
                    }
                  />
                );
              })}
            </ol>
          )}
        </Section>

        <Section title={`From you, for ${payload.n}`} subtitle="Send them your link so they can see these too">
          <ol>
            {result.myPicks.map(({ artist, rank }) => (
              <ArtistRow
                key={artist.id}
                artist={artist}
                right={<span className="text-xs font-bold text-muted">your #{rank}</span>}
              />
            ))}
          </ol>
        </Section>
      </div>

      {result.sharedTracks.length > 0 && (
        <Section title={`${result.sharedTracks.length} ${result.sharedTracks.length === 1 ? "track" : "tracks"} in both your lists`}>
          <ol className="grid gap-x-6 sm:grid-cols-2">
            {result.sharedTracks.map((track) => (
              <TrackRow key={track.id} track={track} />
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
};
