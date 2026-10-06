"use client";

import { ComponentType, ReactNode, useEffect, useRef, useState } from "react";
import { LuCopy, LuDownload, LuShare2 } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { SegmentedControl } from "@/app/shared/components/SegmentedControl";
import { getCountryStats } from "@/app/shared/helpers/getCountryStats";
import { getMainstreamStats } from "@/app/shared/helpers/getMainstreamStats";
import { getTimeMachineStats } from "@/app/shared/helpers/getTimeMachineStats";
import { getTopGenres } from "@/app/shared/helpers/getTopGenres";
import { readSavedMatches, SavedMatch } from "@/app/shared/helpers/tasteMatch";
import { useArtistOrigins } from "@/app/shared/hooks/useArtistOrigins";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { useSpotifyTopArtists } from "@/app/shared/hooks/useSpotifyTopArtists";
import { useSpotifyTopTracks } from "@/app/shared/hooks/useSpotifyTopTracks";
import { usePreferences } from "@/app/shared/providers/PreferencesProvider";
import { TIME_RANGE_LONG_LABELS, TIME_RANGE_OPTIONS } from "@/app/shared/timeRanges";
import {
  canCopyImages,
  canShareFiles,
  copyBlob,
  downloadBlob,
  renderToBlob,
  shareBlobs,
} from "../helpers/exportImage";
import { ChartTemplate } from "../templates/ChartTemplate";
import { SHARE_FONT_VARIABLES } from "../templates/fonts";
import { FrontPageTemplate } from "../templates/FrontPageTemplate";
import { PulseTemplate } from "../templates/PulseTemplate";
import { ReceiptTemplate } from "../templates/ReceiptTemplate";
import {
  getAvailableSlides,
  STORY_SIZE,
  StorySlide,
  StorySlideId,
} from "../templates/StoryPack";
import {
  FORMATS,
  getExportScale,
  PRINT_THEMES,
  PULSE_THEMES,
  RECEIPT_THEMES,
  ShareData,
  ShareFormat,
  ShareInclude,
  ShareTheme,
  TemplateProps,
} from "../templates/types";
import { FitPreview, ScaledBox } from "./ScaledPreview";
import { ShareTabs } from "./ShareTabs";
import { TemplateId, TemplatePicker } from "./TemplatePicker";

const TEMPLATES: {
  id: TemplateId;
  name: string;
  themes: ShareTheme[];
  Component?: ComponentType<TemplateProps>;
}[] = [
  { id: "pulse", name: "Pulse", themes: PULSE_THEMES, Component: PulseTemplate },
  { id: "receipt", name: "Receipt", themes: RECEIPT_THEMES, Component: ReceiptTemplate },
  { id: "frontpage", name: "Front page", themes: PRINT_THEMES, Component: FrontPageTemplate },
  { id: "chart", name: "Chart", themes: [...PRINT_THEMES].reverse(), Component: ChartTemplate },
  { id: "story", name: "Story pack", themes: [] },
];

const FORMAT_ICONS: Record<ShareFormat, string> = {
  story: "h-8 w-[18px]",
  square: "h-[26px] w-[26px]",
  wide: "h-5 w-[34px]",
};

const INCLUDE_OPTIONS: { key: keyof ShareInclude; label: string }[] = [
  { key: "tracks", label: "Top tracks" },
  { key: "artists", label: "Top artists" },
  { key: "genres", label: "Top genres" },
];

type Status = "download" | "copy" | "share" | null;

const ControlGroup = ({ label, children }: { label: string; children: ReactNode }) => (
  <fieldset className="flex flex-col gap-2.5">
    <legend className="mb-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
      {label}
    </legend>
    {children}
  </fieldset>
);

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 py-0.5 text-sm font-semibold">
    {label}
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-[18px] w-[18px] accent-main"
    />
  </label>
);

export const ShareContent = () => {
  const { timeRange, setTimeRange } = usePreferences();
  const account = useSpotifyAccount();
  const tracks = useSpotifyTopTracks({ timeRange });
  const artists = useSpotifyTopArtists({ timeRange });
  const origins = useArtistOrigins(artists.data);
  const [latestMatch, setLatestMatch] = useState<SavedMatch | null>(null);

  const [templateId, setTemplateId] = useState<TemplateId>("pulse");
  const [format, setFormat] = useState<ShareFormat>("story");
  const [include, setInclude] = useState<ShareInclude>({
    tracks: true,
    artists: true,
    genres: false,
  });
  const [themeIds, setThemeIds] = useState<Partial<Record<TemplateId, string>>>({});
  const [unselectedSlides, setUnselectedSlides] = useState<StorySlideId[]>([]);
  const [status, setStatus] = useState<Status>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [supportsShare, setSupportsShare] = useState(false);
  const [supportsCopy, setSupportsCopy] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Partial<Record<StorySlideId, HTMLDivElement | null>>>({});

  useEffect(() => {
    setSupportsShare(canShareFiles());
    setSupportsCopy(canCopyImages());

    // Other pages link here with ?template=story to open a specific template
    const requested = new URLSearchParams(window.location.search).get("template");
    if (requested && TEMPLATES.some(({ id }) => id === requested)) {
      setTemplateId(requested as TemplateId);
    }
  }, []);

  useEffect(() => {
    if (account.data) setLatestMatch(readSavedMatches(account.data.id)[0] ?? null);
  }, [account.data]);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timeout);
  }, [message]);

  if (account.isLoading || tracks.isLoading || artists.isLoading) {
    return <Loading />;
  }

  if (account.isError || tracks.isError || artists.isError) {
    return <Error />;
  }

  if (!account.data || !tracks.data || !artists.data) {
    return null;
  }

  const name = account.data.display_name || "My";
  const timeMachine = getTimeMachineStats(tracks.data);
  const mainstream = getMainstreamStats(tracks.data);
  const countryStats = origins.done ? getCountryStats(artists.data, origins.countries) : null;
  const data: ShareData = {
    name,
    firstName: name.split(" ")[0],
    timeRange,
    rangeLabel: TIME_RANGE_LONG_LABELS[timeRange],
    tracks: tracks.data.slice(0, 10),
    artists: artists.data.slice(0, 16),
    genres: getTopGenres(artists.data),
    insights: {
      musicYear: timeMachine
        ? {
            year: timeMachine.averageYear,
            nostalgiaPercent: timeMachine.nostalgiaPercent,
            decades: timeMachine.decades.map(({ label, count }) => ({ label, count })),
            topDecade: timeMachine.topDecade.label,
          }
        : undefined,
      mainstream: mainstream
        ? { score: mainstream.score, tier: mainstream.tier.name, lowest: mainstream.lowest.item.name }
        : undefined,
      world:
        countryStats && countryStats.countries.length > 0
          ? {
              countries: countryStats.countries.map(({ code }) => code),
              continents: countryStats.continents,
              topNames: countryStats.countries.slice(0, 3).map(({ name: country }) => country),
            }
          : undefined,
      match: latestMatch
        ? {
            friendName: latestMatch.friendName,
            score: latestMatch.score,
            tier: latestMatch.tier,
            sharedArtists: latestMatch.sharedArtists,
            topSharedArtist: latestMatch.topSharedArtist,
          }
        : undefined,
    },
  };

  const template = TEMPLATES.find(({ id }) => id === templateId) ?? TEMPLATES[0];
  const isStory = template.id === "story";
  const theme =
    template.themes.find(({ id }) => id === themeIds[template.id]) ?? template.themes[0];
  const { width, height } = FORMATS[format];

  const availableSlides = getAvailableSlides(data);
  const selectedSlides = availableSlides.filter(
    ({ id }) => !unselectedSlides.includes(id)
  );

  const renderImages = async () => {
    if (isStory) {
      return Promise.all(
        selectedSlides.map(async ({ id }) => ({
          fileName: `statsfy-${id}`,
          blob: await renderToBlob(slideRefs.current[id] as HTMLDivElement, {
            ...STORY_SIZE,
            scale: getExportScale("story"),
          }),
        }))
      );
    }

    if (!cardRef.current) return [];

    return [
      {
        fileName: `statsfy-${template.id}`,
        blob: await renderToBlob(cardRef.current, {
          width,
          height,
          scale: getExportScale(format),
        }),
      },
    ];
  };

  const runAction = async (action: Exclude<Status, null>) => {
    setStatus(action);
    try {
      const images = await renderImages();
      if (images.length === 0) return;

      if (action === "download") {
        images.forEach(({ blob, fileName }) => downloadBlob(blob, fileName));
      } else if (action === "copy") {
        await copyBlob(images[0].blob);
        setMessage("Copied to clipboard");
      } else {
        await shareBlobs(images);
      }
    } catch (error) {
      // Closing the native share sheet is not an error worth showing
      if ((error as DOMException)?.name !== "AbortError") {
        setMessage("Something went wrong, try again");
      }
    } finally {
      setStatus(null);
    }
  };

  const nothingToExport = isStory
    ? selectedSlides.length === 0
    : !include.tracks && !include.artists && !include.genres;

  const actions = (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => runAction("download")}
        disabled={status !== null || nothingToExport}
        fullWidth
      >
        <LuDownload aria-hidden size={18} />
        {status === "download"
          ? "Preparing…"
          : isStory
            ? `Download ${selectedSlides.length} ${selectedSlides.length === 1 ? "image" : "images"}`
            : "Download PNG"}
      </Button>
      <div
        className={`grid gap-2 ${
          supportsShare && supportsCopy && !isStory ? "grid-cols-2 lg:grid-cols-1" : ""
        }`}
      >
        {supportsShare && (
          <Button
            variant="secondary"
            onClick={() => runAction("share")}
            disabled={status !== null || nothingToExport}
            fullWidth
          >
            <LuShare2 aria-hidden size={16} />
            {status === "share" ? "Preparing…" : "Share…"}
          </Button>
        )}
        {supportsCopy && !isStory && (
          <Button
            variant="secondary"
            onClick={() => runAction("copy")}
            disabled={status !== null || nothingToExport}
            fullWidth
          >
            <LuCopy aria-hidden size={16} />
            {status === "copy" ? "Copying…" : "Copy image"}
          </Button>
        )}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-center text-[13px] text-muted">
        {message}
      </p>
    </div>
  );

  const preview = isStory ? (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0">
      {availableSlides.map(({ id, label }) => {
        const selected = !unselectedSlides.includes(id);
        return (
          <div key={id} className="flex snap-center flex-col items-center gap-2.5">
            <div className={`transition ${selected ? "" : "opacity-40"}`}>
              <ScaledBox {...STORY_SIZE} scale={0.6}>
                <StorySlide
                  id={id}
                  data={data}
                  ref={(node) => {
                    slideRefs.current[id] = node;
                  }}
                />
              </ScaledBox>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) =>
                  setUnselectedSlides((current) =>
                    event.target.checked
                      ? current.filter((slide) => slide !== id)
                      : [...current, id]
                  )
                }
                className="h-[18px] w-[18px] accent-main"
              />
              {label}
            </label>
          </div>
        );
      })}
    </div>
  ) : (
    <FitPreview width={width} height={height} maxHeight={640}>
      <div ref={cardRef} style={{ width, height }}>
        {template.Component && (
          <template.Component data={data} format={format} include={include} theme={theme} />
        )}
      </div>
    </FitPreview>
  );

  return (
    <div className={SHARE_FONT_VARIABLES}>
      <PageHeader title="Share" subtitle="Design your image, then download or share it." />
      <ShareTabs />

      <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="flex min-w-0 flex-col gap-6 lg:order-2">
          <div className="rounded-3xl border border-line bg-[#121411] bg-[radial-gradient(#22261F_1px,transparent_1px)] bg-[length:20px_20px] px-5 py-6 lg:flex lg:min-h-[700px] lg:items-center lg:justify-center lg:p-8">
            {preview}
          </div>
          <div className="lg:hidden">{actions}</div>
        </section>

        <section className="card flex flex-col gap-6 rounded-3xl p-5 lg:order-1 lg:p-6">
          <ControlGroup label="Template">
            <TemplatePicker templates={TEMPLATES} value={template.id} onChange={setTemplateId} />
          </ControlGroup>

          <ControlGroup label="Time range">
            <SegmentedControl
              label="Time range"
              shape="rounded"
              fullWidth
              options={TIME_RANGE_OPTIONS}
              value={timeRange}
              onChange={setTimeRange}
            />
          </ControlGroup>

          {isStory ? (
            <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
              <p>
                Story pack slides are 9:16 images, made for Instagram and
                WhatsApp stories. Tick the ones you want under each slide.
              </p>
              {!origins.done && origins.total > 0 && (
                <p>
                  The World map slide appears once your artists&apos; countries are found
                  ({origins.checked} of {origins.total}).
                </p>
              )}
              {!latestMatch && (
                <p>
                  Compare with a friend to unlock the Taste match slide.
                </p>
              )}
            </div>
          ) : (
            <>
              <ControlGroup label="Format">
                <div role="radiogroup" aria-label="Format" className="grid grid-cols-3 gap-2">
                  {(Object.keys(FORMATS) as ShareFormat[]).map((key) => {
                    const selected = key === format;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setFormat(key)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-main ${
                          selected ? "border-2 border-main text-fg" : "border border-edge text-muted hover:text-fg"
                        }`}
                      >
                        <span className="flex h-8 items-center">
                          <span className={`block rounded-[3px] border-2 border-current ${FORMAT_ICONS[key]}`} />
                        </span>
                        {FORMATS[key].label}
                        <span className="font-semibold text-muted">{FORMATS[key].ratio}</span>
                      </button>
                    );
                  })}
                </div>
              </ControlGroup>

              <ControlGroup label="Include">
                {INCLUDE_OPTIONS.map(({ key, label }) => (
                  <Checkbox
                    key={key}
                    label={label}
                    checked={include[key]}
                    onChange={(checked) => setInclude((current) => ({ ...current, [key]: checked }))}
                  />
                ))}
                {include.genres && data.genres.length === 0 && (
                  <p className="text-xs text-muted">
                    Spotify hasn&apos;t shared genres for your top artists.
                  </p>
                )}
              </ControlGroup>

              {template.themes.length > 1 && (
                <ControlGroup label="Theme">
                  <div role="radiogroup" aria-label="Theme" className="flex flex-wrap gap-2.5">
                    {template.themes.map((option) => {
                      const selected = option.id === theme.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={option.label}
                          title={option.label}
                          onClick={() =>
                            setThemeIds((current) => ({ ...current, [template.id]: option.id }))
                          }
                          className={`h-9 w-9 rounded-full border border-edge transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main ${
                            selected ? "ring-2 ring-main ring-offset-2 ring-offset-surface" : ""
                          }`}
                          style={{ background: option.bg }}
                        />
                      );
                    })}
                  </div>
                </ControlGroup>
              )}
            </>
          )}

          <div className="hidden lg:block">{actions}</div>
        </section>
      </div>
    </div>
  );
};
