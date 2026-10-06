"use client";

import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { getReleaseReason, getReleaseType, ReleaseCard } from "@/app/shared/components/ReleaseCard";
import { SegmentedControl } from "@/app/shared/components/SegmentedControl";
import { formatReleaseAge } from "@/app/shared/helpers/releaseDates";
import { Release, RELEASE_WINDOW_DAYS, useNewReleases } from "@/app/shared/hooks/useNewReleases";

type Filter = "all" | "albums" | "singles";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "albums", label: "Albums" },
  { value: "singles", label: "Singles & EPs" },
];

const DAY = 1000 * 60 * 60 * 24;

const GROUPS = [
  { label: "This week", maxDays: 7 },
  { label: "Last 30 days", maxDays: 30 },
  { label: "Earlier", maxDays: Infinity },
];

const isAlbum = (release: Release) => release.album.album_type !== "single";

export const NewReleasesContent = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const { data, isLoading, isError, checkedArtists, followedCount } = useNewReleases();

  const header = (
    <PageHeader
      title="New from your artists"
      subtitle={`From the artists you follow and play most, last ${RELEASE_WINDOW_DAYS} days.`}
      actions={
        <SegmentedControl label="Release type" options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      }
    />
  );

  if (isLoading || isError) {
    return (
      <div>
        {header}
        {isError ? <Error /> : <Loading label="Checking your artists for new releases" />}
      </div>
    );
  }

  // No data without an error means there were no artists to check
  const filtered = (data ?? []).filter((release) =>
    filter === "all" ? true : filter === "albums" ? isAlbum(release) : !isAlbum(release)
  );
  const featured = filter === "singles" ? null : filtered.find(isAlbum) ?? null;
  const rest = filtered.filter((release) => release !== featured);

  let previousMax = 0;
  const groups = GROUPS.map((group) => {
    const items = rest.filter((release) => {
      const days = (Date.now() - release.date.getTime()) / DAY;
      return days >= previousMax && days < group.maxDays;
    });
    previousMax = group.maxDays;
    return { ...group, items };
  }).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {header}

      {filtered.length === 0 && (
        <p className="card p-8 text-center text-muted">
          Nothing new from your artists in the last {RELEASE_WINDOW_DAYS} days.
        </p>
      )}

      {featured && (
        <section className="card flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:items-center lg:gap-7 lg:p-6">
          <Cover
            src={featured.album.images[0]?.url}
            alt={`${featured.album.name} cover`}
            size={200}
            radius="rounded-2xl"
            className="hidden sm:block"
            eager
          />
          <div className="flex min-w-0 items-start gap-4 sm:hidden">
            <Cover src={featured.album.images[0]?.url} alt="" size={112} radius="rounded-xl" eager />
            <div className="min-w-0">
              <p className="eyebrow text-main">Latest · {formatReleaseAge(featured.date)}</p>
              <p className="mt-1 font-display text-2xl font-bold leading-tight">{featured.album.name}</p>
              <p className="text-sm font-bold text-subtle">{featured.artist.name}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="hidden sm:block">
              <p className="eyebrow text-main">
                Latest · {getReleaseType(featured)} · {formatReleaseAge(featured.date)}
              </p>
              <p className="mt-1.5 font-display text-[34px] font-bold leading-none tracking-[-0.02em] lg:text-[40px]">
                {featured.album.name}
              </p>
              <p className="mt-1.5 text-base font-bold text-subtle">
                {featured.artist.name}
                {featured.album.total_tracks ? ` · ${featured.album.total_tracks} tracks` : ""}
              </p>
            </div>
            <span className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-edge px-2.5 py-1 text-xs font-bold text-subtle">
                {getReleaseReason(featured)}
              </span>
            </span>
            {featured.album.external_urls?.spotify && (
              <Button
                href={featured.album.external_urls.spotify}
                external
                size="small"
                className="self-start"
              >
                Listen on Spotify
                <LuArrowUpRight aria-hidden size={16} />
              </Button>
            )}
          </div>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-3.5">
          <h2 className="font-display text-lg font-bold">{group.label}</h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
            {group.items.map((release) => (
              <li key={release.album.id} className="min-w-0">
                <ReleaseCard release={release} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-[13px] text-muted">
        Checked {checkedArtists} artists: your most played plus{" "}
        {followedCount > 0 ? "ones you follow" : "none followed yet"}.
      </p>
    </div>
  );
};
