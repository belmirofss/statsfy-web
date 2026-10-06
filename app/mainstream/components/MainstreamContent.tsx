"use client";

import { useState } from "react";
import { LuShare } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { SegmentedControl } from "@/app/shared/components/SegmentedControl";
import { TimeRangeControl } from "@/app/shared/components/TimeRangeControl";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { getInitials } from "@/app/shared/helpers/getInitials";
import {
  getMainstreamStats,
  MAINSTREAM_TIER_COLORS,
  MAINSTREAM_TIERS,
} from "@/app/shared/helpers/getMainstreamStats";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { SpotifyArtist, SpotifyTrack } from "@/app/shared/types";

type Mode = "tracks" | "artists";

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "tracks", label: "Tracks" },
  { value: "artists", label: "Artists" },
];

type Item = SpotifyTrack | SpotifyArtist;

const isTrack = (item: Item): item is SpotifyTrack => "album" in item;

const describe = (item: Item) => ({
  name: item.name,
  sub: isTrack(item)
    ? formatArtistsToArtistNames(item.artists)
    : item.genres?.slice(0, 2).join(" · ") ?? "",
  image: isTrack(item) ? item.album.images[0]?.url : item.images?.[0]?.url,
});

const Extreme = ({
  label,
  item,
  popularity,
  highlight,
}: {
  label: string;
  item: Item;
  popularity: number;
  highlight?: boolean;
}) => {
  const { name, sub, image } = describe(item);

  return (
    <section className="card flex flex-col gap-3.5 p-5">
      <p className="eyebrow text-muted">{label}</p>
      <div className="flex items-center gap-4">
        <Cover
          src={image}
          alt=""
          size={72}
          shape={isTrack(item) ? "square" : "circle"}
          radius="rounded-xl"
          fallback={getInitials(name)}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold">{name}</p>
          <p className="truncate text-[13px] capitalize text-muted">{sub}</p>
        </div>
        <span
          className={`font-display text-[30px] font-bold ${highlight ? "text-main" : "text-subtle"}`}
        >
          {popularity}
        </span>
      </div>
    </section>
  );
};

export const MainstreamContent = () => {
  const { timeRange } = usePreferences();
  const [mode, setMode] = useState<Mode>("tracks");
  const tracks = useSpotifyTopTracks({ timeRange, enabled: mode === "tracks" });
  const artists = useSpotifyTopArtists({ timeRange, enabled: mode === "artists" });
  const query = mode === "tracks" ? tracks : artists;
  const items: Item[] | undefined = query.data;
  const stats = items ? getMainstreamStats<Item>(items) : null;

  const header = (
    <PageHeader
      title="Mainstream meter"
      subtitle="How far off the charts your taste goes, from Spotify's popularity score (0–100)."
      actions={
        <>
          <SegmentedControl label="Measure" options={MODE_OPTIONS} value={mode} onChange={setMode} />
          <div className="w-full sm:w-auto">
            <TimeRangeControl fullWidth />
          </div>
        </>
      }
    />
  );

  if (query.isLoading || query.isError || !items) {
    return (
      <div>
        {header}
        {query.isError ? <Error /> : <Loading />}
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        {header}
        <div className="card mx-auto flex max-w-xl flex-col gap-2 p-8 text-center">
          <p className="font-display text-lg font-bold">Popularity isn&apos;t available</p>
          <p className="text-sm leading-relaxed text-muted">
            Spotify stopped sharing popularity scores with some apps in 2026, so the
            mainstream meter can&apos;t be calculated right now.
          </p>
        </div>
      </div>
    );
  }

  const maxBucket = Math.max(...stats.buckets.map(({ count }) => count));
  const scoreBucket = Math.min(9, Math.floor(stats.score / 10));
  const noun = mode === "tracks" ? "tracks" : "artists";

  return (
    <div className="flex flex-col gap-4">
      {header}

      <section className="card flex flex-col gap-7 rounded-3xl p-5 lg:p-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-main">Your taste is</p>
            <p className="font-display text-[36px] font-bold leading-none tracking-[-0.03em] lg:text-[52px]">
              {stats.tier.name}
            </p>
            <p className="max-w-[520px] text-[15px] leading-relaxed text-soft">
              {stats.tier.description}
            </p>
          </div>
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-[64px] font-bold leading-[0.9] text-main lg:text-[88px]">
              {stats.score}
            </span>
            <span className="text-base font-bold text-muted">/ 100 avg.</span>
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="relative pt-3.5">
            <div className="flex h-[18px] overflow-hidden rounded-full">
              {MAINSTREAM_TIER_COLORS.map((color) => (
                <span key={color} className="flex-1" style={{ background: color }} />
              ))}
            </div>
            <span
              aria-hidden
              className="absolute top-0 -ml-[3px] h-[46px] w-1.5 rounded-sm border-2 border-surface bg-fg"
              style={{ left: `${stats.score}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-2 pt-2 text-[11px] font-bold sm:text-xs">
            {MAINSTREAM_TIERS.map((tier) => (
              <span
                key={tier.name}
                className={`flex flex-col gap-0.5 ${tier === stats.tier ? "text-main" : "text-muted"}`}
              >
                <span>{tier.name}</span>
                <span>{tier.range}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Extreme label="Most underground" item={stats.lowest.item} popularity={stats.lowest.popularity} />
        <Extreme
          label="Most mainstream"
          item={stats.highest.item}
          popularity={stats.highest.popularity}
          highlight
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold">How your top {noun} spread out</h2>
            <p className="text-[13px] text-muted">Number of {noun} per popularity band</p>
          </div>
          <div className="flex h-[200px] items-end gap-1 sm:gap-2">
            {stats.buckets.map((bucket, index) => (
              <div
                key={bucket.label}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-xs font-extrabold text-subtle">{bucket.count}</span>
                <span
                  className={`block w-full rounded-t-md rounded-b-sm ${
                    index === scoreBucket ? "bg-main" : "bg-edge"
                  }`}
                  style={{ height: Math.max(4, (bucket.count / Math.max(maxBucket, 1)) * 150) }}
                />
                <span className="text-[11px] font-bold text-muted">{bucket.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card flex flex-col gap-3.5 p-5">
          <div>
            <h2 className="font-display text-lg font-bold">Hidden gems</h2>
            <p className="text-[13px] text-muted">
              The {stats.gems.length} least popular of your top {noun}
            </p>
          </div>
          <ol className="flex flex-col gap-3">
            {stats.gems.map(({ item, popularity, rank }) => {
              const { name, sub } = describe(item);
              return (
                <li key={item.id} className="flex flex-col gap-1.5">
                  <span className="flex justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{name}</span>
                      <span className="block truncate text-xs capitalize text-muted">
                        #{rank} · {sub}
                      </span>
                    </span>
                    <span className="font-display text-base font-bold text-subtle">{popularity}</span>
                  </span>
                  <span className="h-1.5 rounded bg-line">
                    <span
                      className="block h-1.5 rounded bg-[#1A9A4B]"
                      style={{ width: `${popularity}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] font-semibold text-subtle">
          Share it: your mainstream score is a Story pack slide.
        </p>
        <Button href="/share?template=story" size="small">
          <LuShare aria-hidden size={16} />
          Create share card
        </Button>
      </section>
    </div>
  );
};
