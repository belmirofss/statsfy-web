"use client";

import { useState } from "react";
import { LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { FOREST, LIME, MOSS } from "@/app/share/templates/StoryPack";
import { DotMap } from "@/app/shared/components/DotMap";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { ArtistRow } from "@/app/shared/components/Rows";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { Continent, getContinent, getMapPoint } from "@/app/shared/helpers/countries";
import { getCountryStats } from "@/app/shared/helpers/getCountryStats";
import { useArtistOrigins } from "@/app/shared/hooks/useArtistOrigins";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";

// Continent colors, given out from the continent with the most artists down
const CONTINENT_COLORS = ["#1ED760", "#A6F3C2", "#1A9A4B", "#3F7A52", "#6B8F76", "#2F4A38"];

// Bubble diameter in px for a country with this many artists
const bubbleSize = (count: number) => Math.round(6 + Math.sqrt(count) * 7);

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

  // Biggest first, so smaller bubbles sit on top and stay clickable
  const bubbles = stats.countries
    .flatMap((country) => {
      const point = getMapPoint(country.code);
      return point ? [{ country, point, size: bubbleSize(country.artists.length) }] : [];
    })
    .sort((a, b) => b.size - a.size);
  const selectedPoint = selected ? getMapPoint(selected.code) : null;

  const continentCounts = new Map<Continent, number>();
  stats.countries.forEach(({ code, artists }) => {
    const continent = getContinent(code);
    if (continent) continentCounts.set(continent, (continentCounts.get(continent) ?? 0) + artists.length);
  });
  const continents = Array.from(continentCounts, ([continent, count]) => ({ continent, count })).sort(
    (a, b) => b.count - a.count
  );

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
        <section className="card flex flex-col justify-center gap-6 p-4 lg:p-5">
          <DotMap dotColor="#323730" dotSize={0.6}>
            <div className="absolute inset-0 [--bubble-scale:0.7] sm:[--bubble-scale:1]">
              {bubbles.map(({ country, point, size }) => {
                const count = country.artists.length;
                const isSelected = selected?.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    title={country.name}
                    aria-label={`${country.name}, ${count} ${count === 1 ? "artist" : "artists"}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCode(country.code)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
                      isSelected
                        ? "border-2 border-fg bg-main shadow-[0_0_0_3px_#151714,0_0_28px_rgba(30,215,96,0.55)]"
                        : "border-[1.5px] border-main bg-main/30 shadow-[0_0_16px_rgba(30,215,96,0.35)] hover:bg-main/60"
                    }`}
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`,
                      width: `calc(var(--bubble-scale) * ${size}px)`,
                      height: `calc(var(--bubble-scale) * ${size}px)`,
                    }}
                  />
                );
              })}
              {selected && selectedPoint && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute whitespace-nowrap rounded-full bg-fg px-2.5 py-1 font-display text-xs font-bold text-on-main"
                  style={{
                    left: `${selectedPoint.x * 100}%`,
                    top: `${selectedPoint.y * 100}%`,
                    transform:
                      selectedPoint.x > 0.7
                        ? `translate(calc(-100% - var(--bubble-scale) * ${bubbleSize(selected.artists.length) / 2}px - 8px), -50%)`
                        : `translate(calc(var(--bubble-scale) * ${bubbleSize(selected.artists.length) / 2}px + 8px), -50%)`,
                  }}
                >
                  {selected.name} · {selected.artists.length}
                </span>
              )}
            </div>
          </DotMap>

          {continents.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex h-2 gap-[3px]">
                {continents.map(({ continent, count }, index) => (
                  <span
                    key={continent}
                    className="rounded"
                    style={{ flex: count, background: CONTINENT_COLORS[index] }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
                {continents.map(({ continent, count }, index) => (
                  <span key={continent} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-[3px]"
                      style={{ background: CONTINENT_COLORS[index] }}
                    />
                    <span className="font-semibold text-subtle">{continent}</span>
                    <span className="font-display font-bold">{count}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted">
                Bubble size is the number of artists. Tap a bubble to see them.
              </p>
            </div>
          )}
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

        <section className="flex flex-col justify-between gap-5 rounded-[20px] border border-line bg-raised p-5">
          <div>
            <h2 className="font-display text-lg font-bold">Share your map</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-soft">
              &ldquo;My music comes from {stats.countries.length} countries&rdquo; is a Story pack
              slide.
            </p>
          </div>
          {stats.countries.length > 0 && (
            <div className="flex flex-1 items-center justify-center">
              {/* Mini version of the Story pack World slide */}
              <div
                aria-hidden
                className="flex aspect-[9/16] w-full max-w-[220px] flex-col rounded-2xl p-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
                style={{ background: FOREST }}
              >
                <p className="text-[10px] font-bold">My music comes from</p>
                <p
                  className="mt-1 text-[56px] font-extrabold leading-[0.85] tracking-[-0.05em]"
                  style={{ color: LIME }}
                >
                  {stats.countries.length}
                </p>
                <p className="text-lg font-extrabold leading-tight">
                  {stats.countries.length === 1 ? "country" : "countries"}
                </p>
                <div className="flex flex-1 items-center">
                  <DotMap dotColor={MOSS} dotSize={0.6}>
                    {stats.countries.map(({ code }) => {
                      const point = getMapPoint(code);
                      return (
                        point && (
                          <span
                            key={code}
                            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%`, background: LIME }}
                          />
                        )
                      );
                    })}
                  </DotMap>
                </div>
                <p className="line-clamp-2 text-[10px] font-semibold">
                  {stats.continents} {stats.continents === 1 ? "continent" : "continents"} · most from{" "}
                  {stats.countries
                    .slice(0, 3)
                    .map(({ name }) => name)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
          <Button href="/share?template=story" size="small" className="self-start">
            <LuShare aria-hidden size={16} />
            Open in Share
          </Button>
        </section>
      </div>
    </div>
  );
};
