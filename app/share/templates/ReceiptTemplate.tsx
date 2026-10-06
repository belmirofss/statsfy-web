import { SpotifyTrack } from "@/app/shared/types";
import { FONT, FORMATS, TemplateProps } from "./types";

const formatDuration = (ms = 0) => {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const Line = ({ left, right, bold }: { left: string; right?: string; bold?: boolean }) => (
  <div className={`flex justify-between gap-3 ${bold ? "font-semibold" : ""}`}>
    <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{left}</span>
    {right && <span className="shrink-0">{right}</span>}
  </div>
);

const Dashes = () => <div className="border-t border-dashed border-[#0A0A0A]" />;

const Barcode = ({ height }: { height: number }) => (
  <div
    aria-hidden
    style={{
      height,
      background:
        "repeating-linear-gradient(90deg, #0A0A0A 0 2px, transparent 2px 4px, #0A0A0A 4px 7px, transparent 7px 9px, #0A0A0A 9px 10px, transparent 10px 13px)",
    }}
  />
);

export const ReceiptTemplate = ({ data, format, include, theme }: TemplateProps) => {
  const { width, height } = FORMATS[format];
  const wide = format === "wide";
  const story = format === "story";

  const trackCount = story ? 10 : 5;
  const artistCount = story ? 3 : wide ? 3 : 2;
  const tracks: SpotifyTrack[] = include.tracks ? data.tracks.slice(0, trackCount) : [];
  const artists = include.artists ? data.artists.slice(0, artistCount) : [];
  const topGenre = include.genres ? data.genres[0] : undefined;
  const total = tracks.reduce((sum, track) => sum + (track.duration_ms ?? 0), 0);
  const today = new Date().toLocaleDateString("en-GB");

  const header = (
    <div className="flex flex-col gap-1.5">
      <p
        className="text-center text-[28px] font-black uppercase leading-none"
        style={{ fontFamily: FONT.archivo, fontStretch: "75%" }}
      >
        Statsfy<span style={{ color: "#1ED760" }}>.</span>
      </p>
      <p className="text-center uppercase text-[#3A3A3A]">
        Listening receipt · {data.rangeLabel}
      </p>
      <Line left={`CUSTOMER: ${data.name.toUpperCase()}`} right={today} />
    </div>
  );

  const trackLines = tracks.length > 0 && (
    <>
      <Dashes />
      <Line left="#  ITEM" right="TIME" bold />
      {tracks.map((track, index) => (
        <Line
          key={track.id}
          left={`${String(index + 1).padStart(2, "0")} ${track.name.toUpperCase()}`}
          right={formatDuration(track.duration_ms)}
        />
      ))}
      <Dashes />
      <Line left="TOTAL" right={formatDuration(total)} bold />
    </>
  );

  const extraLines = (artists.length > 0 || topGenre) && (
    <>
      <Dashes />
      {artists.map((artist, index) => (
        <Line
          key={artist.id}
          left={index === 0 ? "TOP ARTIST" : `ARTIST #${index + 1}`}
          right={artist.name.toUpperCase()}
          bold={index === 0}
        />
      ))}
      {topGenre && <Line left="TOP GENRE" right={topGenre.name.toUpperCase()} />}
    </>
  );

  const footer = (
    <>
      <Dashes />
      <p className="text-center">THANK YOU FOR LISTENING</p>
      <Barcode height={story ? 40 : 30} />
      <p className="text-center text-[10px] text-[#3A3A3A]">STATSFY</p>
    </>
  );

  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{ width, height, background: theme.bg }}
    >
      <div
        className="bg-white text-[#0A0A0A] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.6)]"
        style={{
          width: wide ? 580 : story ? 304 : 340,
          padding: story ? "22px 20px" : "18px 20px",
          fontFamily: FONT.mono,
          fontSize: story ? 11.5 : 11,
          lineHeight: 1.45,
        }}
      >
        {wide ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex min-w-0 flex-col gap-1.5">
              {header}
              {trackLines}
            </div>
            <div className="flex min-w-0 flex-col justify-end gap-1.5">
              {extraLines}
              {footer}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {header}
            {trackLines}
            {extraLines}
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
