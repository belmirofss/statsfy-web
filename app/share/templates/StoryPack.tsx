import { forwardRef, ReactNode } from "react";
import { DotMap } from "@/app/shared/components/DotMap";
import { getMapPoint } from "@/app/shared/helpers/countries";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";import { SpotifyTimeRanges } from "@/app/shared/types";
import { ArtistArt, TrackArt } from "./ShareImage";
import { FONT, ShareData } from "./types";

export type StorySlideId =
  | "song"
  | "artist"
  | "tracks"
  | "lineup"
  | "vibe"
  | "year"
  | "mainstream"
  | "world"
  | "match";

export const STORY_SLIDES: { id: StorySlideId; label: string }[] = [
  { id: "song", label: "#1 song" },
  { id: "artist", label: "#1 artist" },
  { id: "tracks", label: "Top 5 tracks" },
  { id: "lineup", label: "Lineup" },
  { id: "vibe", label: "My vibe" },
  { id: "year", label: "Music year" },
  { id: "mainstream", label: "Mainstream" },
  { id: "world", label: "World map" },
  { id: "match", label: "Taste match" },
];

export const STORY_SIZE = { width: 360, height: 640 };

const VIOLET = "#5B3DF5";
export const LIME = "#C6F432";
const CORAL = "#FF6B4A";
const PINK = "#FFB3D9";
const INK = "#111111";
const SUN = "#FFD23F";
const SKY = "#4CC9F0";
// One step per mainstream tier, from underground to top 40
const SKY_RAMP = [SKY, "#7AD8F4", "#A9E6F8", "#D4F3FB", "#FFFFFF"];
export const FOREST = "#0E3B2E";
export const MOSS = "#2C5A4A";
const ROSE = "#FF8FAB";

const PERIOD_PHRASES: Record<SpotifyTimeRanges, string> = {
  [SpotifyTimeRanges.SHORT]: "of the month",
  [SpotifyTimeRanges.MEDIUM]: "of the last 6 months",
  [SpotifyTimeRanges.LONG]: "of all time",
};

const truncate = "overflow-hidden text-ellipsis whitespace-nowrap";

const Slide = forwardRef<
  HTMLDivElement,
  { background: string; color: string; children: ReactNode; center?: boolean }
>(({ background, color, children, center }, ref) => (
  <div
    ref={ref}
    className={`relative flex flex-col overflow-hidden ${center ? "items-center text-center" : ""}`}
    style={{
      ...STORY_SIZE,
      background,
      color,
      padding: "28px 24px 22px",
      fontFamily: FONT.bricolage,
    }}
  >
    {children}
  </div>
));
Slide.displayName = "Slide";

const Footer = () => (
  <p className="mt-auto text-[13px] font-bold">Statsfy</p>
);

/** Slides that have enough data to be rendered */
export const getAvailableSlides = (data: ShareData) =>
  STORY_SLIDES.filter(({ id }) => {
    if (id === "song" || id === "tracks") return data.tracks.length > 0;
    if (id === "artist" || id === "lineup") return data.artists.length > 0;
    if (id === "year") return !!data.insights.musicYear;
    if (id === "mainstream") return !!data.insights.mainstream;
    if (id === "world") return !!data.insights.world;
    if (id === "match") return !!data.insights.match;
    return data.genres.length > 0;
  });

export const StorySlide = forwardRef<
  HTMLDivElement,
  { id: StorySlideId; data: ShareData }
>(({ id, data }, ref) => {
  const period = PERIOD_PHRASES[data.timeRange];

  if (id === "song") {
    const track = data.tracks[0];
    return (
      <Slide ref={ref} background={VIOLET} color="#FFFFFF">
        <p className="text-[15px] font-bold">My song {period}</p>
        <div className="flex flex-1 items-center justify-center">
          <div style={{ transform: "rotate(-4deg)" }} className="shadow-[0_30px_50px_-20px_rgba(0,0,0,0.5)]">
            <TrackArt track={track} size={250} radius="rounded-[22px]" />
          </div>
        </div>
        <p className="text-[38px] font-extrabold leading-[0.95] tracking-[-0.04em]">{track.name}</p>
        <p className={`mt-2 text-[16px] ${truncate}`}>{formatArtistsToArtistNames(track.artists)}</p>
        <div className="mt-6"><Footer /></div>
      </Slide>
    );
  }

  if (id === "artist") {
    const artist = data.artists[0];
    return (
      <Slide ref={ref} background={PINK} color={INK} center>
        <p className="text-[15px] font-bold">My most played artist {period}</p>
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-full" style={{ boxShadow: `0 0 0 6px ${INK}` }}>
            <ArtistArt artist={artist} size={230} />
          </div>
        </div>
        <p className="text-[42px] font-extrabold leading-[0.95] tracking-[-0.04em]">{artist.name}</p>
        {artist.genres?.[0] && (
          <p className="mt-2 text-[15px] capitalize">{artist.genres.slice(0, 2).join(" · ")}</p>
        )}
        <div className="mt-6"><Footer /></div>
      </Slide>
    );
  }

  if (id === "tracks") {
    return (
      <Slide ref={ref} background={LIME} color={INK}>
        <p className="text-[15px] font-bold">My top 5 tracks {period}</p>
        <div className="mt-6 flex flex-col gap-4">
          {data.tracks.slice(0, 5).map((track, index) => (
            <div key={track.id} className="flex min-w-0 items-center gap-3">
              <span className="w-6 shrink-0 text-[32px] font-extrabold">{index + 1}</span>
              <TrackArt track={track} size={64} radius="rounded-xl" />
              <div className="min-w-0">
                <p className="text-[18px] font-extrabold leading-[1.05]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {track.name}
                </p>
                <p className={`text-[13px] ${truncate}`}>{formatArtistsToArtistNames(track.artists)}</p>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </Slide>
    );
  }

  if (id === "lineup") {
    const names = data.artists.map((artist) => artist.name);
    return (
      <Slide ref={ref} background={INK} color="#FFFFFF" center>
        <div
          aria-hidden
          className="absolute left-1/2 top-[-200px] h-[320px] w-[320px] -translate-x-1/2 rounded-full"
          style={{ background: VIOLET }}
        />
        <p className="relative text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>
          {data.firstName} Fest · {data.rangeLabel}
        </p>
        <div className="relative flex flex-1 flex-col justify-center gap-3">
          <p className="text-[44px] font-extrabold leading-[0.9] tracking-[-0.05em]">{names[0]}</p>
          {names.length > 1 && (
            <p className="text-[22px] font-extrabold leading-tight tracking-[-0.03em]">
              {names.slice(1, 3).join(" · ")}
            </p>
          )}
          {names.length > 3 && (
            <p className="text-[16px] font-bold leading-snug" style={{ color: PINK }}>
              {names.slice(3, 7).join(" · ")}
            </p>
          )}
          {names.length > 7 && (
            <p className="text-[13px] font-semibold leading-relaxed text-[#CFCFCF]">
              {names.slice(7, 16).join(" · ")}
            </p>
          )}
        </div>
        <Footer />
      </Slide>
    );
  }

  if (id === "year" && data.insights.musicYear) {
    const { year, nostalgiaPercent, decades, topDecade } = data.insights.musicYear;
    const shown = decades.slice(-6);
    const max = Math.max(1, ...shown.map(({ count }) => count));
    return (
      <Slide ref={ref} background={SUN} color={INK}>
        <p className="text-[15px] font-bold">My music year</p>
        <p className="mt-2 text-[110px] font-extrabold leading-[0.9] tracking-[-0.05em]">{year}</p>
        <p className="mt-3 text-[16px] font-semibold">
          The average release year of my top tracks {period}
        </p>
        <div className="mt-6 flex flex-1 items-end gap-2.5">
          {shown.map((decade) => (
            <div key={decade.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span
                className="block w-full rounded-md"
                style={{
                  height: `${Math.max(4, (decade.count / max) * 100)}%`,
                  background: INK,
                  opacity: decade.label === topDecade ? 1 : 0.35,
                }}
              />
              <span className="text-[13px] font-bold">{decade.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[14px] font-bold">{nostalgiaPercent}% older than 10 years</p>
        <div className="mt-3"><Footer /></div>
      </Slide>
    );
  }

  if (id === "mainstream" && data.insights.mainstream) {
    const { score, tier, lowest } = data.insights.mainstream;
    return (
      <Slide ref={ref} background={SKY} color={INK}>
        <p className="text-[15px] font-bold">My taste is</p>
        <p className="mt-2 text-[60px] font-extrabold leading-[0.9] tracking-[-0.04em]">{tier}</p>
        <p className="mt-3 text-[18px] font-semibold">{score} / 100 on the mainstream meter</p>
        <div className="flex-1" />
        <div
          className="relative flex h-6 overflow-hidden rounded-full border-[3px]"
          style={{ borderColor: INK }}
        >
          {SKY_RAMP.map((color) => (
            <span key={color} className="flex-1" style={{ background: color }} />
          ))}
          <span className="absolute inset-y-0 w-1.5" style={{ left: `${score}%`, background: INK }} />
        </div>
        <div className="mt-2 flex justify-between text-[12px] font-extrabold uppercase">
          <span>Underground</span>
          <span>Top 40</span>
        </div>
        <p className={`mt-5 text-[15px] font-semibold ${truncate}`}>Deepest cut: {lowest}</p>
        <div className="mt-3"><Footer /></div>
      </Slide>
    );
  }

  if (id === "world" && data.insights.world) {
    const { countries, continents, topNames } = data.insights.world;
    return (
      <Slide ref={ref} background={FOREST} color="#FFFFFF">
        <p className="text-[15px] font-bold">My music comes from</p>
        <p
          className="mt-2 text-[100px] font-extrabold leading-[0.85] tracking-[-0.05em]"
          style={{ color: LIME }}
        >
          {countries.length}
        </p>
        <p className="text-[34px] font-extrabold leading-tight">
          {countries.length === 1 ? "country" : "countries"}
        </p>
        <div className="flex flex-1 items-center">
          <div style={{ width: 312 }}>
            <DotMap dotColor={MOSS} dotSize={0.6}>
              {countries.map((code) => {
                const point = getMapPoint(code);
                return (
                  point && (
                    <span
                      key={code}
                      className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%`, background: LIME }}
                    />
                  )
                );
              })}
            </DotMap>
          </div>
        </div>
        <p className="text-[14px] font-semibold">
          {continents} {continents === 1 ? "continent" : "continents"}
          {topNames.length > 0 && ` · most from ${topNames.join(", ")}`}
        </p>
        <div className="mt-3"><Footer /></div>
      </Slide>
    );
  }

  if (id === "match" && data.insights.match) {
    const { friendName, score, tier, sharedArtists, topSharedArtist } = data.insights.match;
    return (
      <Slide ref={ref} background={ROSE} color={INK} center>
        <p className="text-[15px] font-bold">
          {data.firstName} × {friendName}
        </p>
        <div className="mt-8 flex">
          {[data.firstName, friendName].map((person, index) => (
            <span
              key={`${person}-${index}`}
              className="flex h-[96px] w-[96px] items-center justify-center rounded-full border-[5px] text-[34px] font-extrabold"
              style={{
                borderColor: INK,
                background: index === 0 ? "#F4A259" : "#8E7DFF",
                marginLeft: index === 0 ? 0 : -22,
              }}
            >
              {person.slice(0, 1).toUpperCase()}
            </span>
          ))}
        </div>
        <p className="mt-6 text-[110px] font-extrabold leading-[0.9] tracking-[-0.05em]">{score}%</p>
        <p className="mt-2 text-[26px] font-extrabold">{tier}</p>
        <div className="flex-1" />
        <p className="text-[15px] font-semibold">
          {sharedArtists} {sharedArtists === 1 ? "artist" : "artists"} in common
          {topSharedArtist && `, led by ${topSharedArtist}`}
        </p>
        <div className="mt-3"><Footer /></div>
      </Slide>
    );
  }

  const [topGenre, ...otherGenres] = data.genres;
  return (
    <Slide ref={ref} background={CORAL} color={INK}>
      <p className="text-[15px] font-bold">My vibe {period}</p>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[72px] font-extrabold leading-[0.85] tracking-[-0.05em]" style={{ overflowWrap: "anywhere" }}>
          {topGenre.name}
        </p>
        <p className="mt-3 text-[20px] font-extrabold">
          {topGenre.percent}% of my top artists
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-bold">
          {otherGenres.slice(0, 3).map((genre) => (
            <span key={genre.name} className="rounded-full bg-white/60 px-3 py-1.5">
              {genre.name} {genre.percent}%
            </span>
          ))}
        </div>
      </div>
      <Footer />
    </Slide>
  );
});
StorySlide.displayName = "StorySlide";
