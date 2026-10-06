import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { ArtistArt, TrackArt } from "./ShareImage";
import { FONT, FORMATS, TemplateProps } from "./types";

const truncate = "overflow-hidden text-ellipsis whitespace-nowrap";
const condensed = { fontFamily: FONT.archivo, fontStretch: "62%" } as const;

export const FrontPageTemplate = ({ data, format, include, theme }: TemplateProps) => {
  const { width, height } = FORMATS[format];
  const story = format === "story";
  const wide = format === "wide";

  const showTracks = include.tracks && data.tracks.length > 0;
  const showArtists = include.artists && data.artists.length > 0;
  const showGenres = include.genres && data.genres.length > 0;

  // The lead story is the #1 track, or the #1 artist when tracks are off
  const leadTrack = showTracks ? data.tracks[0] : undefined;
  const leadArtist = !showTracks && showArtists ? data.artists[0] : undefined;
  const leadSize = story ? 150 : wide ? 140 : 170;
  const chartCount = wide ? 3 : 4;

  const chartRows = leadTrack
    ? data.tracks.slice(1, chartCount + 1).map((track) => ({
        id: track.id,
        title: track.name,
        subtitle: formatArtistsToArtistNames(track.artists),
        art: <TrackArt track={track} size={34} radius="rounded-none" />,
      }))
    : leadArtist
      ? data.artists.slice(1, chartCount + 1).map((artist) => ({
          id: artist.id,
          title: artist.name,
          subtitle: artist.genres?.[0] ?? "",
          art: <ArtistArt artist={artist} size={34} radius="rounded-none" />,
        }))
      : [];

  const lead = (leadTrack || leadArtist) && (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="relative self-start">
        {leadTrack ? (
          <TrackArt track={leadTrack} size={leadSize} radius="rounded-none" />
        ) : (
          leadArtist && <ArtistArt artist={leadArtist} size={leadSize} radius="rounded-none" />
        )}
        <span
          className="absolute left-0 top-0 px-2 py-1 text-[34px] font-black leading-none"
          style={{ ...condensed, background: theme.accent, color: theme.onAccent }}
        >
          01
        </span>
      </div>
      <p
        className="font-black uppercase leading-[0.88]"
        style={{ ...condensed, fontSize: story ? 40 : wide ? 30 : 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {leadTrack?.name ?? leadArtist?.name}
      </p>
      <p className={`text-[13px] ${truncate}`} style={{ color: theme.muted }}>
        {leadTrack
          ? `${formatArtistsToArtistNames(leadTrack.artists)} — ${leadTrack.album.name}`
          : leadArtist?.genres?.slice(0, 2).join(" · ")}
      </p>
    </div>
  );

  const chart = chartRows.length > 0 && (
    <div style={{ borderTop: `4px solid ${theme.fg}` }}>
      {chartRows.map((row, index) => (
        <div
          key={row.id}
          className="flex items-center gap-2.5 py-[5px]"
          style={{ borderBottom: `1px solid ${theme.line}` }}
        >
          <span className="w-7 text-[28px] font-black leading-none" style={condensed}>
            {String(index + 2).padStart(2, "0")}
          </span>
          {row.art}
          <div className="min-w-0">
            <p className={`text-[13px] font-extrabold ${truncate}`}>{row.title}</p>
            <p className={`text-[11px] capitalize ${truncate}`} style={{ color: theme.muted }}>
              {row.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const artistLine = showTracks && showArtists && (
    <p className="text-[12px] leading-snug">
      <span className="font-semibold uppercase" style={{ fontFamily: FONT.mono, color: theme.muted }}>
        Top artists —{" "}
      </span>
      <span className="font-extrabold">
        {data.artists.slice(0, 3).map((artist) => artist.name).join(" · ")}
      </span>
    </p>
  );

  const genreBar = showGenres && (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-[0.06em]" style={{ fontFamily: FONT.mono, color: theme.muted }}>
        Genre mix
      </p>
      <div className="flex h-[22px] overflow-hidden text-[10px] font-extrabold">
        {data.genres.slice(0, 3).map((genre, index) => (
          <div
            key={genre.name}
            className={`flex items-center px-1.5 ${truncate}`}
            style={{
              flex: genre.percent,
              background: index === 0 ? theme.fg : index === 1 ? theme.accent : theme.muted,
              color: index === 0 ? theme.bg : index === 1 ? theme.onAccent : theme.bg,
            }}
          >
            {genre.name}
          </div>
        ))}
      </div>
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
        padding: story ? "20px 22px" : "18px 22px",
        gap: story ? 12 : 10,
      }}
    >
      <div className="flex items-end justify-between pb-2" style={{ borderBottom: `2px solid ${theme.fg}` }}>
        <p className="text-[26px] font-black uppercase leading-none" style={{ fontFamily: FONT.archivo, fontStretch: "75%" }}>
          Statsfy<span style={{ color: theme.accent }}>.</span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.06em]" style={{ fontFamily: FONT.mono, color: theme.muted }}>
          {data.firstName}&apos;s chart · {data.rangeLabel}
        </p>
      </div>

      {story ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {lead}
          {chart}
          {artistLine}
          {genreBar}
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] gap-5">
          {lead && <div style={{ width: leadSize }}>{lead}</div>}
          <div className="flex min-w-0 flex-col gap-3">
            {chart}
            {artistLine}
            {genreBar}
          </div>
        </div>
      )}

      <p className="mt-auto text-center text-[10px] uppercase" style={{ fontFamily: FONT.mono, color: theme.muted }}>
        Statsfy
      </p>
    </div>
  );
};
