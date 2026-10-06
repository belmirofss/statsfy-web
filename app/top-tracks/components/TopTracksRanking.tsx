"use client";

import { useState } from "react";
import { LuArrowUpRight, LuLayoutGrid, LuList } from "react-icons/lu";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { RankMovementBadge } from "@/app/shared/components/RankMovementBadge";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { ViewToggle } from "@/app/shared/components/ViewToggle";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useRankMovement } from "@/app/shared/hooks/useRankMovement";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TIME_RANGE_LONG_LABELS } from "@/app/shared/timeRanges";
import { SpotifyTrack } from "@/app/shared/types";

const TopCard = ({ track, rank }: { track: SpotifyTrack; rank: number }) => {
  const first = rank === 1;

  return (
    <div className="card flex items-center gap-4 p-4 lg:p-[18px]">
      <Cover
        src={track.album.images[0]?.url}
        alt={`${track.album.name} cover`}
        size={first ? 150 : 96}
        radius="rounded-xl"
        eager
      />
      <div className="min-w-0">
        <p
          className={`font-display font-bold leading-[0.9] ${
            first ? "text-[56px] text-main" : "text-[40px]"
          }`}
        >
          {rank}
        </p>
        <p
          className={`mt-2 font-bold ${
            first
              ? "font-display text-2xl tracking-[-0.02em]"
              : "text-base font-extrabold"
          }`}
        >
          {track.name}
        </p>
        <p
          className="truncate text-sm text-muted"
          title={formatArtistsToArtistNames(track.artists)}
        >
          {formatArtistsToArtistNames(track.artists)}
        </p>
      </div>
    </div>
  );
};

const MobileTopThree = ({ tracks }: { tracks: SpotifyTrack[] }) => {
  const [first, ...others] = tracks;

  return (
    <div className="flex flex-col gap-2.5 md:hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[22px]">
        <Cover
          src={first.album.images[0]?.url}
          alt={`${first.album.name} cover`}
          radius="rounded-none"
          sizes="100vw"
          eager
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <p className="font-display text-[13px] font-bold text-main">#1</p>
          <p className="font-display text-[26px] font-bold leading-tight">{first.name}</p>
          <p className="text-sm text-[#D9DDD5]">
            {formatArtistsToArtistNames(first.artists)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {others.map((track, index) => (
          <div key={track.id} className="card flex items-center gap-2.5 rounded-2xl p-2.5">
            <Cover src={track.album.images[0]?.url} alt="" size={48} />
            <div className="min-w-0">
              <p className="font-display text-xs font-bold text-muted">#{index + 2}</p>
              <p className="truncate text-[13px] font-bold">{track.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopTracksRanking = () => {
  const { timeRange } = usePreferences();
  const [view, setView] = useState<"list" | "grid">("list");
  const { data, isLoading, isError } = useSpotifyTopTracks({ timeRange });
  const movement = useRankMovement({ kind: "tracks", timeRange });

  const header = (
    <PageHeader
      title="Top tracks"
      subtitle={`Your ${data?.length || 50} most-played songs · ${TIME_RANGE_LONG_LABELS[
        timeRange
      ].toLowerCase()}`}
      actions={
        <>
          <div className="w-full sm:w-auto">
            <TimeRangeControl fullWidth />
          </div>
          <ViewToggle
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "List view", Icon: LuList },
              { value: "grid", label: "Grid view", Icon: LuLayoutGrid },
            ]}
          />
        </>
      }
    />
  );

  if (isLoading || isError || !data) {
    return (
      <div>
        {header}
        {isError ? <Error /> : <Loading />}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div>
        {header}
        <p className="card p-8 text-center text-muted">
          Not enough listening yet for this time range.
        </p>
      </div>
    );
  }

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div>
      {header}

      {view === "grid" ? (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.map((track, index) => (
            <li key={track.id} className="card flex flex-col gap-3 p-3">
              <div className="relative aspect-square">
                <Cover src={track.album.images[0]?.url} alt={`${track.album.name} cover`} sizes="240px" />
                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 font-display text-[13px] font-bold">
                  {index + 1}
                </span>
              </div>
              <div className="min-w-0 px-1">
                <p className="truncate text-sm font-bold">{track.name}</p>
                <p className="truncate text-xs text-muted">
                  {formatArtistsToArtistNames(track.artists)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <MobileTopThree tracks={topThree} />
          <div className="hidden gap-4 md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            {topThree.map((track, index) => (
              <TopCard key={track.id} track={track} rank={index + 1} />
            ))}
          </div>

          {rest.length > 0 && (
            <div className="mt-4 md:card md:px-5 md:py-2">
              <div
                aria-hidden
                className="hidden grid-cols-[48px_minmax(0,2fr)_minmax(0,1.4fr)_90px_48px] gap-4 border-b border-line py-3 text-xs font-bold uppercase tracking-[0.06em] text-muted md:grid"
              >
                <span>#</span>
                <span>Track</span>
                <span>Album</span>
                <span>{movement.available ? `vs ${movement.comparisonLabel}` : ""}</span>
                <span className="sr-only">Open in Spotify</span>
              </div>
              <ol>
                {rest.map((track, index) => {
                  const rank = index + 4;
                  return (
                    <li
                      key={track.id}
                      className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 py-2 md:grid-cols-[48px_minmax(0,2fr)_minmax(0,1.4fr)_90px_48px] md:gap-4 md:border-b md:border-[#1C1F1A] md:py-2.5 md:last:border-0"
                    >
                      <span className="font-display font-bold text-muted">{rank}</span>
                      <div className="flex min-w-0 items-center gap-3">
                        <Cover src={track.album.images[0]?.url} alt="" size={44} />
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-bold">{track.name}</p>
                          <p className="truncate text-[13px] text-muted">
                            {formatArtistsToArtistNames(track.artists)}
                          </p>
                        </div>
                      </div>
                      <span className="hidden truncate text-sm text-muted md:block">
                        {track.album.name}
                      </span>
                      <span>
                        {movement.available && (
                          <RankMovementBadge movement={movement.getMovement(track.id, index + 3)} />
                        )}
                      </span>
                      {track.external_urls?.spotify ? (
                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${track.name} in Spotify`}
                          className="hidden h-9 w-9 items-center justify-center rounded-full border border-edge text-subtle hover:text-white md:flex"
                        >
                          <LuArrowUpRight aria-hidden size={16} />
                        </a>
                      ) : (
                        <span className="hidden md:block" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
};
