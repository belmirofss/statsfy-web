import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { ArtistArt, TrackArt } from "./ShareImage";
import { FONT, FORMATS, TemplateProps } from "./types";

const truncate = "overflow-hidden text-ellipsis whitespace-nowrap";
const condensed = { fontFamily: FONT.archivo, fontStretch: "62%" } as const;

export const ChartTemplate = ({ data, format, include, theme }: TemplateProps) => {
  const { width, height } = FORMATS[format];
  const story = format === "story";

  const showTracks = include.tracks && data.tracks.length > 0;
  const showArtists = include.artists && data.artists.length > 0;
  const showGenres = include.genres && data.genres.length > 0;
  const both = showTracks && showArtists;

  const trackCount = story ? (both ? 6 : 10) : 5;
  const artistCount = story ? (both ? 3 : 10) : 5;
  const rowHeight = story ? 40 : format === "wide" ? 32 : 36;

  const heading = (text: string) => (
    <div className="flex items-baseline justify-between pb-1.5" style={{ borderBottom: `1px solid ${theme.fg}` }}>
      <p className="text-[20px] font-black uppercase leading-none" style={{ fontFamily: FONT.archivo, fontStretch: "75%" }}>
        {text}
      </p>
    </div>
  );

  const rank = (index: number) => (
    <span
      className="w-9 shrink-0 font-black leading-none"
      style={{ ...condensed, fontSize: story ? 32 : 28, color: index === 0 ? theme.accent : theme.fg }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );

  const tracks = showTracks && (
    <div className="flex min-w-0 flex-col">
      {heading("Tracks")}
      {data.tracks.slice(0, trackCount).map((track, index) => (
        <div key={track.id} className="flex items-center gap-2.5" style={{ height: rowHeight, borderBottom: `1px solid ${theme.line}` }}>
          {rank(index)}
          <TrackArt track={track} size={rowHeight - 10} radius="rounded-none" />
          <div className="min-w-0">
            <p className={`text-[13px] font-extrabold ${truncate}`}>{track.name}</p>
            <p className={`text-[11px] ${truncate}`} style={{ color: theme.muted }}>
              {formatArtistsToArtistNames(track.artists)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const artists = showArtists && (
    <div className="flex min-w-0 flex-col">
      {heading("Artists")}
      {data.artists.slice(0, artistCount).map((artist, index) => (
        <div key={artist.id} className="flex items-center gap-2.5" style={{ height: rowHeight, borderBottom: `1px solid ${theme.line}` }}>
          {rank(index)}
          <ArtistArt artist={artist} size={rowHeight - 10} radius="rounded-none" />
          <p className={`text-[13px] font-extrabold ${truncate}`}>{artist.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width,
        height,
        background: theme.bg,
        color: theme.fg,
        fontFamily: FONT.archivo,
        padding: story ? "24px 22px 18px" : "20px 24px 16px",
        gap: story ? 14 : 12,
      }}
    >
      <div style={{ borderBottom: `5px solid ${theme.fg}`, paddingBottom: 8 }}>
        <p className="text-[10px] uppercase tracking-[0.08em]" style={{ fontFamily: FONT.mono, color: theme.muted }}>
          {data.firstName}&apos;s chart · {data.rangeLabel}
        </p>
        <p className="font-black uppercase leading-[0.85]" style={{ ...condensed, fontSize: story ? 64 : format === "wide" ? 40 : 48 }}>
          The <span style={{ color: theme.accent }}>chart</span>
        </p>
      </div>

      <div
        className={story ? "flex flex-col gap-4" : "grid min-h-0 gap-6"}
        style={story ? undefined : { gridTemplateColumns: both ? "minmax(0, 1.3fr) minmax(0, 1fr)" : "minmax(0, 1fr)" }}
      >
        {tracks}
        {artists}
      </div>

      {showGenres && (
        <p className="text-[12px]">
          <span className="uppercase" style={{ fontFamily: FONT.mono, color: theme.muted }}>
            Top genres —{" "}
          </span>
          <span className="font-extrabold">
            {data.genres.slice(0, 3).map((genre) => genre.name).join(" · ")}
          </span>
        </p>
      )}

      <p className="mt-auto text-center text-[10px] uppercase" style={{ fontFamily: FONT.mono, color: theme.muted }}>
        Statsfy
      </p>
    </div>
  );
};
