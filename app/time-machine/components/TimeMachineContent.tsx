"use client";

import { LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { TrackRow } from "@/app/shared/components/Rows";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { DatedTrack, getTimeMachineStats } from "@/app/shared/helpers/getTimeMachineStats";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";

const TIMELINE_START = 1950;

const YearList = ({ title, items }: { title: string; items: DatedTrack[] }) => (
  <div className="flex flex-col gap-2">
    <h2 className="font-display text-lg font-bold">{title}</h2>
    <ol>
      {items.map(({ track, year }) => (
        <TrackRow
          key={track.id}
          track={track}
          right={<span className="font-display text-[15px] font-bold text-subtle">{year}</span>}
        />
      ))}
    </ol>
  </div>
);

export const TimeMachineContent = () => {
  const { timeRange } = usePreferences();
  const { data, isLoading, isError } = useSpotifyTopTracks({ timeRange });
  const stats = data ? getTimeMachineStats(data) : null;

  const header = (
    <PageHeader
      title="Time machine"
      subtitle="When the songs in your top 50 were released."
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

  if (!stats) {
    return (
      <div>
        {header}
        <p className="card p-8 text-center text-muted">
          Spotify didn&apos;t share release dates for your top tracks.
        </p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const timelineStart = Math.min(TIMELINE_START, Math.floor(stats.minYear / 10) * 10);
  const timelineSpan = currentYear + 2 - timelineStart;
  const position = (year: number) => ((year + 0.5 - timelineStart) / timelineSpan) * 100;
  const ticks = [];
  for (let year = Math.ceil(timelineStart / 10) * 10; year <= currentYear; year += 10) {
    ticks.push(year);
  }
  const maxDecadeCount = Math.max(...stats.decades.map(({ count }) => count));

  return (
    <div className="flex flex-col gap-4">
      {header}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="card flex flex-col gap-1.5 p-5 sm:col-span-2 lg:col-span-1">
          <p className="eyebrow text-main">Your music year</p>
          <p className="font-display text-[56px] font-bold leading-none tracking-[-0.03em] lg:text-[64px]">
            {stats.averageYear}
          </p>
          <p className="text-sm text-soft">Average release year · median {stats.medianYear}</p>
        </section>
        <section className="card flex flex-col gap-2.5 p-5">
          <p className="eyebrow text-muted">Nostalgia score</p>
          <p className="font-display text-[40px] font-bold leading-none">{stats.nostalgiaPercent}%</p>
          <span className="h-2 rounded bg-line">
            <span
              className="block h-2 rounded bg-main"
              style={{ width: `${stats.nostalgiaPercent}%` }}
            />
          </span>
          <p className="text-sm text-soft">of your top tracks came out more than 10 years ago</p>
        </section>
        <section className="card flex flex-col gap-2.5 p-5">
          <p className="eyebrow text-muted">Sweet spot</p>
          <p className="font-display text-[40px] font-bold leading-none">
            {stats.sweetSpot.start}–{stats.sweetSpot.end}
          </p>
          <p className="text-sm text-soft">
            {stats.sweetSpot.count} of your top tracks come from these five years. Your range spans{" "}
            {stats.minYear} to {stats.maxYear}.
          </p>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold">By decade</h2>
            <p className="text-[13px] text-muted">
              The {stats.topDecade.label} lead with {stats.topDecade.percent}%
            </p>
          </div>
          <div className="flex h-[220px] items-end gap-1.5 sm:gap-3">
            {stats.decades.map((decade) => {
              const top = decade === stats.topDecade;
              return (
                <div
                  key={decade.decade}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <span className={`text-xs font-extrabold ${top ? "text-main" : "text-soft"}`}>
                    {decade.percent}%
                  </span>
                  <span
                    className={`block w-full rounded-t-lg rounded-b ${top ? "bg-main" : "bg-edge"}`}
                    style={{ height: Math.max(5, (decade.count / maxDecadeCount) * 160) }}
                  />
                  <span className="font-display text-xs font-bold text-subtle">{decade.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card flex flex-col gap-4 p-5">
          <YearList title="Oldest in your rotation" items={stats.oldest} />
          <YearList title="Newest" items={stats.newest} />
        </section>
      </div>

      <section className="card flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Your top tracks on a timeline</h2>
          <div className="flex gap-4 text-[13px] text-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-main" />
              Top 10
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#5E6659]" />
              11–50
            </span>
          </div>
        </div>
        <div className="relative mx-1.5 h-[130px]">
          {ticks.map((year) => (
            <span key={year}>
              <span
                className="absolute bottom-6 top-0 w-px bg-line"
                style={{ left: `${position(year)}%` }}
              />
              <span
                className="absolute bottom-0 -translate-x-1/2 font-display text-[11px] font-bold text-muted"
                style={{ left: `${position(year)}%` }}
              >
                <span className="sm:hidden">&apos;{String(year).slice(2)}</span>
                <span className="hidden sm:inline">{year}</span>
              </span>
            </span>
          ))}
          {stats.dated.map(({ track, year, rank }) => (
            <span
              key={track.id}
              title={`#${rank} ${track.name} (${year})`}
              className={`absolute h-[11px] w-[11px] -translate-x-1/2 rounded-full border-2 border-surface ${
                rank <= 10 ? "z-10 bg-main" : "bg-[#5E6659]"
              }`}
              // Spread tracks from the same year vertically so they don't overlap
              style={{ left: `${position(year)}%`, top: 6 + ((rank * 37) % 88) }}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] font-semibold text-subtle">
          Share it: &ldquo;My music year is {stats.averageYear}&rdquo; is a Story pack slide.
        </p>
        <Button href="/share?template=story" size="small">
          <LuShare aria-hidden size={16} />
          Create share card
        </Button>
      </section>
    </div>
  );
};
