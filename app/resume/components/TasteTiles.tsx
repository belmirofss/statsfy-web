"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { getCountryStats } from "@/app/shared/helpers/getCountryStats";
import { getMainstreamStats, MAINSTREAM_TIER_COLORS } from "@/app/shared/helpers/getMainstreamStats";
import { getMoodStats, mapPosition, MOODS } from "@/app/shared/helpers/getMoodStats";
import { getTimeMachineStats } from "@/app/shared/helpers/getTimeMachineStats";
import { useArtistOrigins } from "@/app/shared/hooks/useArtistOrigins";
import { useAudioFeatures } from "@/app/shared/hooks/useAudioFeatures";
import { SpotifyArtist, SpotifyTrack } from "@/app/shared/types";

const Tile = ({
  href,
  label,
  value,
  accent,
  visual,
  caption,
}: {
  href: string;
  label: string;
  value: ReactNode;
  accent?: ReactNode;
  visual?: ReactNode;
  caption: ReactNode;
}) => (
  <Link
    href={href}
    className="card flex min-w-0 flex-col gap-1 p-3 transition hover:bg-raised sm:gap-2 sm:p-5"
  >
    <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-muted sm:font-display sm:text-xs sm:font-bold sm:tracking-[0.1em]">
      {label}
    </span>
    <span className="flex items-end justify-between gap-3">
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
        <span className="font-display text-[26px] font-bold leading-none tracking-[-0.03em] sm:text-[44px]">
          {value}
        </span>
        {accent && (
          <span className="hidden font-display text-xl font-bold text-main sm:inline">{accent}</span>
        )}
      </span>
      {visual && <span className="hidden sm:block">{visual}</span>}
    </span>
    <span className="truncate text-[11px] text-soft sm:text-[13px]">{caption}</span>
  </Link>
);

type Props = {
  tracks: SpotifyTrack[] | undefined;
  artists: SpotifyArtist[] | undefined;
};

/** Teasers for Time machine, Mainstream, Mood map and World map on the overview. */
export const TasteTiles = ({ tracks, artists }: Props) => {
  const timeMachine = tracks ? getTimeMachineStats(tracks) : null;
  const mainstream = tracks ? getMainstreamStats(tracks) : null;
  const origins = useArtistOrigins(artists);
  const countries = artists ? getCountryStats(artists, origins.countries) : null;
  const audio = useAudioFeatures(tracks);
  const mood = tracks && audio.done ? getMoodStats(tracks, audio.features) : null;
  const maxDecade = Math.max(1, ...(timeMachine?.decades.map(({ count }) => count) ?? [1]));

  return (
    <section aria-labelledby="taste-title" className="flex flex-col gap-3">
      <h2 id="taste-title" className="font-display text-lg font-bold">
        Your taste
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Tile
          href="/time-machine"
          label="Music year"
          value={timeMachine?.averageYear ?? "–"}
          visual={
            timeMachine && (
              <span className="flex h-11 items-end gap-1">
                {timeMachine.decades.slice(-6).map((decade) => (
                  <span
                    key={decade.decade}
                    className={`w-2 rounded-sm ${decade === timeMachine.topDecade ? "bg-main" : "bg-edge"}`}
                    style={{ height: `${Math.max(10, (decade.count / maxDecade) * 100)}%` }}
                  />
                ))}
              </span>
            )
          }
          caption={
            timeMachine ? (
              <>
                {timeMachine.nostalgiaPercent}% nostalgia
                <span className="hidden sm:inline"> · the {timeMachine.topDecade.label} lead</span>
              </>
            ) : (
              "No release dates"
            )
          }
        />
        <Tile
          href="/mainstream"
          label="Mainstream"
          value={mainstream?.score ?? "–"}
          accent={mainstream?.tier.name}
          visual={
            mainstream && (
              <span className="relative flex h-2 w-16 overflow-hidden rounded">
                {MAINSTREAM_TIER_COLORS.map((color) => (
                  <span key={color} className="flex-1" style={{ background: color }} />
                ))}
                <span className="absolute top-0 h-2 w-1 bg-fg" style={{ left: `${mainstream.score}%` }} />
              </span>
            )
          }
          caption={
            mainstream ? (
              <>
                <span className="font-bold text-main sm:hidden">{mainstream.tier.name}</span>
                <span className="hidden sm:inline">Most underground: {mainstream.lowest.item.name}</span>
              </>
            ) : (
              "Not available"
            )
          }
        />
        <Tile
          href="/mood-map"
          label="Mood"
          value={
            <span className="block text-[20px] leading-[1.05] tracking-[-0.02em] sm:text-[28px]">
              {mood?.vibe ?? "–"}
            </span>
          }
          visual={
            mood && (
              <span className="relative block h-[52px] w-[52px] overflow-hidden rounded-[10px] border border-line bg-[#10120F]">
                <span className="absolute inset-y-0 left-1/2 w-px bg-edge" />
                <span className="absolute inset-x-0 top-1/2 h-px bg-edge" />
                {mood.items.slice(0, 12).map(({ track, features, mood: key }) => (
                  <span
                    key={track.id}
                    className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-sm"
                    style={{ ...mapPosition(features), background: MOODS[key].color }}
                  />
                ))}
              </span>
            )
          }
          caption={
            mood
              ? `${mood.topMood.percent}% ${mood.topMood.name.toLowerCase()} · ${mood.tempo} BPM avg`
              : audio.done || audio.isError
                ? "Not available"
                : "Measuring moods…"
          }
        />
        <Tile
          href="/world-map"
          label="World map"
          value={origins.done ? (countries?.countries.length ?? "–") : "–"}
          accent="countries"
          caption={
            origins.done ? (
              <>
                <span className="sm:hidden">countries</span>
                <span className="hidden sm:inline">
                  Across {countries?.continents ?? 0}{" "}
                  {countries?.continents === 1 ? "continent" : "continents"}
                </span>
              </>
            ) : (
              "Finding origins…"
            )
          }
        />
      </div>
    </section>
  );
};
