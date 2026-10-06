"use client";

import { LuArrowUpRight, LuCheck, LuShieldCheck } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { SegmentedControl } from "@/app/shared/components/SegmentedControl";
import { getInitials } from "@/app/shared/helpers/getInitials";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TIME_RANGE_OPTIONS } from "@/app/shared/timeRanges";
import { LogoutButton } from "./LogoutButton";

const SPOTIFY_APPS_URL = "https://www.spotify.com/account/apps/";

const PRODUCT_LABELS: Record<string, string> = {
  premium: "Premium",
  free: "Free",
  open: "Free",
};

const DATA_WE_READ = [
  "Profile name, email & country",
  "Top tracks and artists",
  "Recently played",
  "Artists you follow, for new releases",
  "What's playing now, and play/pause controls",
];

export const MyAccountContent = () => {
  const { data, isLoading, isError } = useSpotifyAccount();
  const { preferences, updatePreferences, setTimeRange } = usePreferences();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  const imageUrl = data.images?.[0]?.url;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="My account" />

      <section className="card flex flex-col items-center gap-5 rounded-3xl p-6 text-center sm:flex-row sm:text-left">
        <span className="flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F4A259] font-display text-4xl font-bold text-[#2B1B0E]">
          {imageUrl ? (
            // Profile pictures can come from hosts outside the image allowlist
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Profile picture" className="h-full w-full object-cover" />
          ) : (
            getInitials(data.display_name)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[28px] font-bold lg:text-[30px]">
            {data.display_name}
          </h2>
          <p className="mt-0.5 break-all text-[15px] text-muted">{data.email}</p>
          <div className="mt-3 flex justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-main px-3 py-1 text-xs font-extrabold uppercase text-on-main">
              {PRODUCT_LABELS[data.product] ?? data.product}
            </span>
            <span className="rounded-full border border-edge px-3 py-1 text-xs font-bold">
              {data.country}
            </span>
          </div>
        </div>
        {data.external_urls?.spotify && (
          <Button href={data.external_urls.spotify} external variant="secondary" size="small">
            Open Spotify profile
            <LuArrowUpRight aria-hidden size={16} />
          </Button>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card flex flex-col gap-5 rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Preferences</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-bold">Default time range</p>
              <p className="text-[13px] text-muted">Used when you open Statsfy</p>
            </div>
            <SegmentedControl
              label="Default time range"
              shape="rounded"
              options={TIME_RANGE_OPTIONS}
              value={preferences.defaultTimeRange}
              onChange={(value) => {
                updatePreferences({ defaultTimeRange: value });
                setTimeRange(value);
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p id="rank-movement-label" className="text-[15px] font-bold">
                Show rank movement
              </p>
              <p className="text-[13px] text-muted">
                Compare each ranking with the next longer time range
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.showRankMovement}
              aria-labelledby="rank-movement-label"
              onClick={() =>
                updatePreferences({ showRankMovement: !preferences.showRankMovement })
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main ${
                preferences.showRankMovement ? "bg-main" : "bg-edge"
              }`}
            >
              <span
                className={`absolute top-[3px] h-[22px] w-[22px] rounded-full transition-all ${
                  preferences.showRankMovement ? "left-[23px] bg-canvas" : "left-[3px] bg-muted"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="card flex flex-col gap-3.5 rounded-3xl p-6">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-bold">
            <LuShieldCheck aria-hidden size={20} className="text-main" />
            Data &amp; privacy
          </h2>
          <p className="text-sm leading-relaxed text-soft">
            Statsfy reads your data straight from Spotify each time you visit.
            Nothing is saved on our side.
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            {DATA_WE_READ.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <LuCheck aria-hidden size={16} className="text-main" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={SPOTIFY_APPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start py-1 text-sm font-bold text-subtle hover:text-white"
          >
            Manage access in Spotify ↗
          </a>
        </section>
      </div>

      <section className="card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-bold">Log out of Statsfy</p>
          <p className="text-[13px] text-muted">You can reconnect any time.</p>
        </div>
        <LogoutButton />
      </section>
    </div>
  );
};
