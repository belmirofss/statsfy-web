import { forwardRef, ReactNode } from "react";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { ArtistArt, TrackArt } from "./ShareImage";
import { FONT, ShareData } from "./types";

export type StorySlideId = "song" | "artist" | "tracks" | "lineup" | "vibe";

export const STORY_SLIDES: { id: StorySlideId; label: string }[] = [
  { id: "song", label: "#1 song" },
  { id: "artist", label: "#1 artist" },
  { id: "tracks", label: "Top 5 tracks" },
  { id: "lineup", label: "Lineup" },
  { id: "vibe", label: "My vibe" },
];

export const STORY_SIZE = { width: 360, height: 640 };

const VIOLET = "#5B3DF5";
const LIME = "#C6F432";
const CORAL = "#FF6B4A";
const PINK = "#FFB3D9";
const INK = "#111111";

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
