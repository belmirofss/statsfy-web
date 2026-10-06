"use client";

import { useState } from "react";
import { LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { ArtistRow } from "@/app/shared/components/Rows";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { getContinent, MAP_COLUMNS, MAP_ROWS, MAP_TILES } from "@/app/shared/helpers/countries";
import { getCountryStats } from "@/app/shared/helpers/getCountryStats";
import { useArtistOrigins } from "@/app/shared/hooks/useArtistOrigins";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";

// Fill and text color for a tile with this many artists, darkest to brightest
const tileColors = (count: number) =>
  count >= 10
    ? { bg: "#A6F3C2", fg: "#06210F" }
    : count >= 4
      ? { bg: "#1ED760", fg: "#06210F" }
      : count >= 2
        ? { bg: "#1A9A4B", fg: "#06210F" }
        : count === 1
          ? { bg: "#1F5A33", fg: "#F2F4EF" }
          : { bg: "#1E211D", fg: "#5E6659" };

const LEGEND = [
  { label: "1", count: 1 },
  { label: "2–3", count: 2 },
  { label: "4–9", count: 4 },
  { label: "10+", count: 10 },
];

const Stat = ({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) => (
  <section className="card flex flex-col gap-1 p-4 lg:p-5">
    <p className={`eyebrow ${highlight ? "text-main" : "text-muted"}`}>{label}</p>
    <p className="font-display text-[32px] font-bold leading-none lg:text-[44px]">{value}</p>
  </section>
);

export const WorldMapContent = () => {
  const { timeRange } = usePreferences();
  const { data, isLoading, isError } = useSpotifyTopArtists({ timeRange });
  const account = useSpotifyAccount();
  const origins = useArtistOrigins(data);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const header = (
    <PageHeader
      title="World map"
      subtitle="Where your top 50 artists come from."
      actions={
        <div className="w-full sm:w-auto">
          <TimeRangeControl fullWidth />
        </div>
      }
    />
  );

  if (isLoading || isError || !data || !origins.done) {
    return (
      <div>
        {header}
        {isError ? (
          <Error />
        ) : (
          <Loading label={data ? "Looking up where your artists are from" : "Loading"} />
        )}
      </div>
    );
  }

  const stats = getCountryStats(data, origins.countries);
  const counts = new Map(stats.countries.map((country) => [country.code, country.artists.length]));
  const selected =
    stats.countries.find(({ code }) => code === selectedCode) ?? stats.countries[0] ?? null;
  const homeCountry = account.data?.country;
  const homeShare = homeCountry
    ? Math.round(((counts.get(homeCountry) ?? 0) / data.length) * 100)
    : null;
  const topCount = stats.countries[0]?.artists.length ?? 1;

  return (
    <div className="flex flex-col gap-4">
      {header}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat label="Countries" value={stats.countries.length} highlight />
        <Stat label="Continents" value={stats.continents} />
        {homeShare !== null ? (
          <Stat label={`From ${homeCountry}`} value={`${homeShare}%`} />
        ) : (
          <Stat label="Top country" value={stats.countries[0]?.code ?? "–"} />
        )}
        <Stat label="Unknown origin" value={stats.unknown} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-4 p-4 lg:p-5">
          <div className="relative" style={{ aspectRatio: `${MAP_COLUMNS} / ${MAP_ROWS}` }}>
            {MAP_TILES.map((tile) => {
              const count = counts.get(tile.code) ?? 0;
              const { bg, fg } = tileColors(count);
              const style = {
                left: `${(tile.column / MAP_COLUMNS) * 100}%`,
                top: `${(tile.row / MAP_ROWS) * 100}%`,
                width: `${(0.94 / MAP_COLUMNS) * 100}%`,
                height: `${(0.94 / MAP_ROWS) * 100}%`,
                background: bg,
                color: fg,
              };
              const isSelected = selected?.code === tile.code;

              return count > 0 ? (
                <button
                  key={tile.code}
                  type="button"
                  aria-label={`${tile.code}, ${count} ${count === 1 ? "artist" : "artists"}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCode(tile.code)}
                  className={`absolute flex items-center justify-center overflow-hidden rounded-[4px] font-display text-[clamp(6px,0.85vw,11px)] font-bold sm:rounded-md ${
                    isSelected ? "ring-2 ring-fg" : ""
                  }`}
                  style={style}
                >
                  <span className="hidden sm:inline">{tile.code}</span>
                </button>
              ) : (
                <span
                  key={tile.code}
                  aria-hidden
                  className="absolute flex items-center justify-center overflow-hidden rounded-[4px] font-display text-[clamp(6px,0.8vw,10px)] font-bold sm:rounded-md"
                  style={style}
                >
                  <span className="hidden sm:inline">{tile.code}</span>
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3.5 text-xs font-bold text-soft">
            <span>Artists</span>
            {LEGEND.map(({ label, count }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded" style={{ background: tileColors(count).bg }} />
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="card flex flex-col gap-3 p-5">
          {selected ? (
            <>
              <div>
                <p className="eyebrow text-main">{getContinent(selected.code) ?? "Elsewhere"}</p>
                <h2 className="font-display text-2xl font-bold">{selected.name}</h2>
                <p className="text-sm text-muted">
                  {selected.artists.length} of your top {data.length} ·{" "}
                  {Math.round((selected.artists.length / data.length) * 100)}%
                </p>
              </div>
              <ol>
                {selected.artists.slice(0, 6).map(({ artist, rank }) => (
                  <ArtistRow
                    key={artist.id}
                    artist={artist}
                    right={<span className="font-display text-sm font-bold text-subtle">#{rank}</span>}
                  />
                ))}
              </ol>
              {selected.artists.length > 6 && (
                <p className="text-[13px] text-muted">and {selected.artists.length - 6} more</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              MusicBrainz couldn&apos;t place any of your top artists.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-1.5 p-5">
          <h2 className="mb-1.5 font-display text-lg font-bold">All countries</h2>
          {stats.countries.map((country) => {
            const isSelected = selected?.code === country.code;
            return (
              <button
                key={country.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCode(country.code)}
                className={`-mx-2.5 grid min-h-11 grid-cols-[minmax(0,1fr)_minmax(60px,2fr)_28px] items-center gap-3 rounded-xl px-2.5 text-left ${
                  isSelected ? "bg-raised" : "hover:bg-raised/60"
                }`}
              >
                <span className="truncate text-sm font-bold">{country.name}</span>
                <span className="h-2.5 rounded-full bg-line">
                  <span
                    className="block h-2.5 rounded-full bg-main"
                    style={{ width: `${(country.artists.length / topCount) * 100}%` }}
                  />
                </span>
                <span className="text-right font-display text-sm font-bold text-subtle">
                  {country.artists.length}
                </span>
              </button>
            );
          })}
        </section>

        <section className="flex flex-col justify-between gap-3.5 rounded-[20px] border border-line bg-raised p-5">
          <div>
            <h2 className="font-display text-lg font-bold">Share your map</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-soft">
              &ldquo;My music comes from {stats.countries.length} countries&rdquo; is a Story pack
              slide.
            </p>
          </div>
          <Button href="/share?template=story" size="small" className="self-start">
            <LuShare aria-hidden size={16} />
            Open in Share
          </Button>
        </section>
      </div>
    </div>
  );
};
