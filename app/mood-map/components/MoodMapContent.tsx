"use client";

import { useState } from "react";
import { LuFootprints, LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import {
  getMoodStats,
  mapPosition,
  MOODS,
  MoodTrack,
  RUNNING_ZONE,
  TEMPO_BINS,
} from "@/app/shared/helpers/getMoodStats";
import { useAudioFeatures } from "@/app/shared/hooks/useAudioFeatures";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";

const QuadrantLabel = ({ mood }: { mood: (typeof MOODS)[keyof typeof MOODS] }) => (
  <span
    className="font-display text-[11px] font-bold uppercase tracking-[0.08em] lg:text-[13px]"
    style={{ color: mood.color }}
  >
    {mood.name}
  </span>
);

const MoodPlot = ({
  items,
  average,
  selectedId,
  onSelect,
}: {
  items: MoodTrack[];
  average: { valence: number; energy: number };
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const you = mapPosition({ valence: average.valence / 100, energy: average.energy / 100 });

  return (
    // Quadrant names sit outside the map, so songs near the corners never cover them
    <div className="flex flex-col gap-2">
      <div aria-hidden className="flex justify-between pl-[26px] lg:pl-7">
        <QuadrantLabel mood={MOODS.angsty} />
        <QuadrantLabel mood={MOODS.euphoric} />
      </div>
      <div className="flex gap-2.5 lg:gap-3">
        <div
          aria-hidden
          className="flex w-4 flex-col items-center justify-between text-[11px] font-bold text-muted"
        >
          <span className="rotate-180 [writing-mode:vertical-rl]">More intense</span>
          <span className="rotate-180 [writing-mode:vertical-rl]">Calmer</span>
        </div>
        <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-[#10120F]">
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-edge" />
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-edge" />
          <span
            aria-hidden
            className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-main bg-main/10 lg:h-16 lg:w-16"
            style={you}
          />
          {items.map(({ track, features }) => {
            const selected = track.id === selectedId;
            return (
              <button
                key={track.id}
                type="button"
                aria-label={`${track.name} by ${formatArtistsToArtistNames(track.artists)}`}
                aria-pressed={selected}
                title={track.name}
                onClick={() => onSelect(track.id)}
                className={`absolute h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-main lg:h-9 lg:w-9 lg:rounded-lg ${
                  selected
                    ? "z-20 scale-110 border-fg shadow-[0_0_0_4px_rgba(242,244,239,0.22)]"
                    : "z-10 border-[#10120F] hover:z-20 hover:border-subtle"
                }`}
                style={mapPosition(features)}
              >
                <Cover src={track.album.images[track.album.images.length - 1]?.url} alt="" radius="rounded-none" />
              </button>
            );
          })}
          <span
            aria-hidden
            className="absolute z-30 translate-x-4 -translate-y-[200%] rounded-full bg-main px-2 py-0.5 text-[11px] font-extrabold text-on-main lg:translate-x-7 lg:text-xs"
            style={you}
          >
            You
          </span>
        </div>
      </div>
      <div aria-hidden className="flex items-center justify-between gap-2 pl-[26px] lg:pl-7">
        <QuadrantLabel mood={MOODS.melancholic} />
        <span className="text-[11px] font-bold text-muted">← Sadder · Happier →</span>
        <QuadrantLabel mood={MOODS.peaceful} />
      </div>
    </div>
  );
};

const Stat = ({ label, value, bar }: { label: string; value: number; bar?: boolean }) => (
  <div className="flex flex-col gap-2 rounded-[14px] bg-raised p-3 lg:p-3.5">
    <span className="text-xs font-bold text-muted">{label}</span>
    <span className="font-display text-[26px] font-bold leading-none lg:text-[30px]">{value}</span>
    {bar && (
      <span className="h-1 rounded bg-edge">
        <span className="block h-1 rounded bg-main" style={{ width: `${value}%` }} />
      </span>
    )}
  </div>
);

export const MoodMapContent = () => {
  const { timeRange } = usePreferences();
  const tracks = useSpotifyTopTracks({ timeRange });
  const audio = useAudioFeatures(tracks.data);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const header = (
    <PageHeader
      title="Mood map"
      subtitle="Where your top songs sit between happy and sad, calm and intense."
      actions={
        <div className="w-full sm:w-auto">
          <TimeRangeControl fullWidth />
        </div>
      }
    />
  );

  if (tracks.isLoading || (tracks.data && !audio.done && !audio.isError)) {
    return (
      <div>
        {header}
        <Loading label="Measuring the mood of your songs" />
      </div>
    );
  }

  if (tracks.isError || !tracks.data) {
    return (
      <div>
        {header}
        <Error />
      </div>
    );
  }

  const stats = audio.done ? getMoodStats(tracks.data, audio.features) : null;

  if (!stats) {
    return (
      <div>
        {header}
        <div className="card mx-auto flex max-w-xl flex-col gap-2 p-8 text-center">
          <p className="font-display text-lg font-bold">
            {audio.isError ? "Couldn't measure your songs right now" : "Not enough mood data yet"}
          </p>
          <p className="text-sm leading-relaxed text-muted">
            {audio.isError
              ? "The service that measures mood and tempo didn't answer. Try again in a little while."
              : "Too few of your top songs have mood data. Try another time range."}
          </p>
        </div>
      </div>
    );
  }

  const selected =
    stats.items.find(({ track }) => track.id === selectedId) ?? stats.items[0];
  const maxBin = Math.max(1, ...stats.bins.map(({ count }) => count));
  const extremes = [
    { label: "Happiest", item: stats.happiest, value: Math.round(stats.happiest.features.valence * 100) },
    { label: "Saddest", item: stats.saddest, value: Math.round(stats.saddest.features.valence * 100) },
    {
      label: "Most intense",
      item: stats.mostIntense,
      value: Math.round(stats.mostIntense.features.energy * 100),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {header}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section className="card flex flex-col gap-3.5 rounded-3xl p-5 lg:row-span-3 lg:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold lg:text-xl">
              {stats.items.length === stats.total
                ? `Your top ${stats.total}, mapped`
                : `${stats.items.length} of your top ${stats.total}, mapped`}
            </h2>
            <p className="text-[13px] text-muted">Tap a song to see it</p>
          </div>
          <MoodPlot
            items={stats.items}
            average={stats.averages}
            selectedId={selected.track.id}
            onSelect={setSelectedId}
          />
        </section>

        <section className="card flex flex-col gap-3.5 rounded-3xl p-5 lg:p-6 -order-1 lg:order-none">
          <p className="eyebrow text-main">Your vibe is</p>
          <p className="font-display text-[38px] font-bold leading-[0.95] tracking-[-0.03em] lg:text-[48px]">
            {stats.vibe}
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Stat label="Happiness" value={stats.averages.valence} bar />
            <Stat label="Energy" value={stats.averages.energy} bar />
            <Stat label="Danceable" value={stats.averages.danceability} bar />
          </div>
        </section>

        <section aria-live="polite" className="card flex flex-col gap-3.5 rounded-3xl p-5">
          <p className="eyebrow text-muted">Selected song</p>
          <div className="flex items-center gap-4">
            <Cover
              src={selected.track.album.images[0]?.url}
              alt={`${selected.track.album.name} cover`}
              size={72}
              radius="rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold">{selected.track.name}</p>
              <p className="truncate text-[13px] text-muted">
                {formatArtistsToArtistNames(selected.track.artists)} · #{selected.rank}
              </p>
              <p
                className="mt-1.5 inline-block rounded-full bg-raised px-2.5 py-0.5 text-xs font-extrabold"
                style={{ color: MOODS[selected.mood].color }}
              >
                {MOODS[selected.mood].name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Happiness", Math.round(selected.features.valence * 100)],
              ["Energy", Math.round(selected.features.energy * 100)],
              ["BPM", Math.round(selected.features.tempo)],
            ].map(([label, value]) => (
              <span key={label} className="flex flex-col gap-0.5 rounded-xl bg-raised px-3 py-2.5">
                <span className="text-[11px] font-bold text-muted">{label}</span>
                <span className="font-display text-xl font-bold">{value}</span>
              </span>
            ))}
          </div>
          {selected.track.external_urls?.spotify && (
            <Button
              href={selected.track.external_urls.spotify}
              external
              variant="secondary"
              size="small"
            >
              Open in Spotify ↗
            </Button>
          )}
        </section>

        <section className="card flex flex-col gap-3.5 rounded-3xl p-5">
          <h2 className="font-display text-lg font-bold">Your mood mix</h2>
          <div className="flex h-[18px] gap-0.5 overflow-hidden rounded-full">
            {stats.mix
              .filter(({ count }) => count > 0)
              .map((mood) => (
                <span key={mood.key} style={{ flex: mood.count, background: mood.color }} />
              ))}
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5">
            {stats.mix.map((mood) => (
              <li key={mood.key} className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[3px]" style={{ background: mood.color }} />
                <span className="flex-1 text-sm font-semibold">{mood.name}</span>
                <span className="font-display text-[15px] font-bold">{mood.percent}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-4 rounded-3xl p-5 lg:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold lg:text-xl">Your tempo</h2>
              <p className="text-[13px] text-muted">Songs per BPM range</p>
            </div>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-[32px] font-bold leading-none text-main lg:text-[40px]">
                {stats.tempo}
              </span>
              <span className="text-xs font-bold text-muted">avg BPM</span>
            </p>
          </div>
          <div className="flex h-[150px] items-end gap-1 sm:gap-2">
            {stats.bins.map((bin) => (
              <div
                key={bin.from}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="hidden text-[11px] font-bold text-muted sm:block">{bin.count}</span>
                <span
                  className={`block w-full rounded-t-[5px] rounded-b-sm ${bin.running ? "bg-main" : "bg-edge"}`}
                  style={{ height: Math.max(6, (bin.count / maxBin) * 120) }}
                />
              </div>
            ))}
          </div>
          <div aria-hidden className="-mt-2 flex justify-between text-[11px] font-bold text-muted">
            <span>{TEMPO_BINS.from}</span>
            <span>100</span>
            <span>140</span>
            <span>{TEMPO_BINS.to}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-raised p-3.5">
            <LuFootprints aria-hidden size={22} className="shrink-0 text-main" />
            <div>
              <p className="text-sm font-bold">
                {stats.runningCount} {stats.runningCount === 1 ? "song" : "songs"} in your running zone
              </p>
              <p className="text-xs text-muted">
                {RUNNING_ZONE.from}–{RUNNING_ZONE.to - 1} BPM, the pace of a steady run
              </p>
            </div>
          </div>
        </section>

        <section className="card flex flex-col gap-3 rounded-3xl p-5 lg:p-6">
          <h2 className="font-display text-lg font-bold lg:text-xl">Mood extremes</h2>
          <ul className="flex flex-col gap-3">
            {extremes.map(({ label, item, value }) => (
              <li key={label} className="flex items-center gap-3">
                <Cover src={item.track.album.images[0]?.url} alt="" size={48} radius="rounded-[10px]" />
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-[11px] text-muted">{label}</span>
                  <span className="block truncate text-[15px] font-bold">{item.track.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {formatArtistsToArtistNames(item.track.artists)}
                  </span>
                </span>
                <span className="font-display text-[22px] font-bold text-subtle">{value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] font-semibold text-subtle">
          Share it: your mood map is a Story pack slide.
        </p>
        <Button href="/share?template=story" size="small">
          <LuShare aria-hidden size={16} />
          Create share card
        </Button>
      </section>

      <p className="text-[13px] leading-relaxed text-muted">
        Mood and tempo from{" "}
        <a href="https://reccobeats.com" target="_blank" rel="noopener noreferrer" className="font-bold text-subtle hover:text-white">
          ReccoBeats
        </a>
        . Happiness is how positive a song sounds, energy how intense it feels.
      </p>
    </div>
  );
};
