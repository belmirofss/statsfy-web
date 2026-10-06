"use client";

import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { RankMovementBadge } from "@/app/shared/components/RankMovementBadge";
import { ArtistRow } from "@/app/shared/components/Rows";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { getInitials } from "@/app/shared/helpers/getInitials";
import { useRankMovement } from "@/app/shared/hooks/useRankMovement";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TIME_RANGE_LONG_LABELS } from "@/app/shared/timeRanges";
import { SpotifyArtist } from "@/app/shared/types";

const RunnerUp = ({ artist, rank }: { artist: SpotifyArtist; rank: number }) => (
  <div className="card flex flex-1 items-center gap-4 rounded-3xl p-[18px]">
    <Cover
      src={artist.images?.[0]?.url}
      alt={artist.name}
      size={76}
      shape="circle"
      fallback={getInitials(artist.name)}
      eager
    />
    <div className="min-w-0">
      <p className="font-display text-[32px] font-bold leading-[0.9]">{rank}</p>
      <p className="mt-1 truncate text-[17px] font-extrabold">{artist.name}</p>
      {artist.genres?.[0] && (
        <p className="truncate text-[13px] capitalize text-muted">{artist.genres[0]}</p>
      )}
    </div>
  </div>
);

export const TopArtistsRanking = () => {
  const { timeRange } = usePreferences();
  const { data, isLoading, isError } = useSpotifyTopArtists({ timeRange });
  const movement = useRankMovement({ kind: "artists", timeRange });
  const rangeLabel = TIME_RANGE_LONG_LABELS[timeRange].toLowerCase();

  const header = (
    <PageHeader
      title="Top artists"
      subtitle={`Your ${data?.length || 50} most-played artists · ${rangeLabel}`}
      actions={
        <div className="w-full sm:w-auto">
          <TimeRangeControl fullWidth />
        </div>
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

  const [first, ...others] = data;
  const runnersUp = others.slice(0, 2);
  const rest = others.slice(2);

  return (
    <div>
      {header}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="card flex flex-col items-center gap-5 rounded-3xl p-6 text-center sm:flex-row sm:items-center sm:gap-7 sm:p-7 sm:text-left">
          <div className="rounded-full p-1.5 ring-2 ring-main">
            <Cover
              src={first.images?.[0]?.url}
              alt={first.name}
              size={176}
              shape="circle"
              fallback={getInitials(first.name)}
              sizes="200px"
              eager
            />
          </div>
          <div className="flex min-w-0 flex-col items-center gap-2.5 sm:items-start">
            <p className="eyebrow text-main">#1 artist · {rangeLabel}</p>
            <h2 className="font-display text-[34px] font-bold leading-[0.95] tracking-[-0.03em] lg:text-[52px]">
              {first.name}
            </h2>
            {first.genres && first.genres.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {first.genres.slice(0, 3).map((genre) => (
                  <li
                    key={genre}
                    className="rounded-full border border-edge px-3 py-1.5 text-[13px] font-semibold capitalize"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="hidden min-w-0 flex-col gap-4 sm:flex">
          {runnersUp.map((artist, index) => (
            <RunnerUp key={artist.id} artist={artist} rank={index + 2} />
          ))}
        </div>
      </div>

      <ol className="mt-4 sm:hidden">
        {others.map((artist, index) => (
          <ArtistRow
            key={artist.id}
            artist={artist}
            rank={index + 2}
            size={48}
            right={
              movement.available && (
                <RankMovementBadge movement={movement.getMovement(artist.id, index + 1)} />
              )
            }
          />
        ))}
      </ol>

      {rest.length > 0 && (
        <ol className="mt-4 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {rest.map((artist, index) => {
            const rank = index + 4;
            return (
              <li
                key={artist.id}
                className="card flex flex-col items-center gap-2.5 p-4 text-center"
              >
                <Cover
                  src={artist.images?.[0]?.url}
                  alt=""
                  size={84}
                  shape="circle"
                  fallback={getInitials(artist.name)}
                />
                <div className="min-w-0 max-w-full">
                  <p className="truncate text-[15px] font-extrabold">
                    <span className="font-display text-muted">{rank} </span>
                    {artist.name}
                  </p>
                  {artist.genres?.[0] && (
                    <p className="mt-0.5 truncate text-xs capitalize text-muted">
                      {artist.genres[0]}
                    </p>
                  )}
                </div>
                {movement.available && (
                  <RankMovementBadge movement={movement.getMovement(artist.id, rank - 1)} />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
