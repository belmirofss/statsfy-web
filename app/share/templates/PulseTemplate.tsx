import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { ArtistArt, TrackArt } from "./ShareImage";
import { FONT, FORMATS, TemplateProps } from "./types";

const truncate = "overflow-hidden text-ellipsis whitespace-nowrap";

export const PulseTemplate = ({ data, format, include, theme }: TemplateProps) => {
  const { width, height } = FORMATS[format];
  const stacked = format === "story";
  const wide = format === "wide";

  const showTracks = include.tracks && data.tracks.length > 0;
  const showArtists = include.artists && data.artists.length > 0;
  const showGenres = include.genres && data.genres.length > 0;

  const trackCount = stacked ? (showArtists ? 5 : 8) : 5;
  const coverSize = stacked ? 48 : wide ? 36 : 40;

  const title =
    showTracks && showArtists
      ? `${data.firstName}'s Spotify stats`
      : showArtists
        ? `${data.firstName}'s top artists`
        : `${data.firstName}'s top tracks`;

  const tracks = showTracks && (
    <div className="flex min-w-0 flex-col" style={{ gap: wide ? 6 : 9 }}>
      {showArtists && !stacked && (
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.muted, fontFamily: FONT.display }}>
          Top tracks
        </p>
      )}
      {data.tracks.slice(0, trackCount).map((track, index) => (
        <div key={track.id} className="flex min-w-0 items-center gap-3">
          <span
            className="w-5 shrink-0 text-[17px] font-bold"
            style={{ fontFamily: FONT.display, color: index === 0 ? theme.accent : theme.muted }}
          >
            {index + 1}
          </span>
          <TrackArt track={track} size={coverSize} />
          <div className="min-w-0">
            <p className={`text-[14px] font-extrabold ${truncate}`}>{track.name}</p>
            <p className={`text-[11.5px] ${truncate}`} style={{ color: theme.muted }}>
              {formatArtistsToArtistNames(track.artists)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const artists = showArtists && (
    <div className="flex min-w-0 flex-col" style={{ gap: stacked ? 10 : 8 }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.muted, fontFamily: FONT.display }}>
        Top artists
      </p>
      {stacked ? (
        <div className="flex justify-between">
          {data.artists.slice(0, 3).map((artist, index) => (
            <div key={artist.id} className="flex w-[96px] flex-col items-center gap-1.5">
              <div
                className="rounded-full"
                style={{ boxShadow: index === 0 ? `0 0 0 2px ${theme.accent}` : undefined }}
              >
                <ArtistArt artist={artist} size={70} />
              </div>
              <p className={`w-full text-center text-[12px] font-bold ${truncate}`}>{artist.name}</p>
            </div>
          ))}
        </div>
      ) : (
        data.artists.slice(0, showTracks ? 3 : 5).map((artist, index) => (
          <div key={artist.id} className="flex min-w-0 items-center gap-2.5">
            <span className="w-4 shrink-0 text-[15px] font-bold" style={{ fontFamily: FONT.display, color: index === 0 ? theme.accent : theme.muted }}>
              {index + 1}
            </span>
            <ArtistArt artist={artist} size={wide ? 36 : 42} />
            <p className={`text-[13px] font-bold ${truncate}`}>{artist.name}</p>
          </div>
        ))
      )}
    </div>
  );

  const genres = showGenres && (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.muted, fontFamily: FONT.display }}>
        Top genres
      </span>
      {data.genres.slice(0, 3).map((genre) => (
        <span
          key={genre.name}
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ border: `1px solid ${theme.line}` }}
        >
          {genre.name}
        </span>
      ))}
    </div>
  );

  const nothing = !showTracks && !showArtists && !showGenres;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{
        width,
        height,
        background: theme.bg,
        color: theme.fg,
        fontFamily: FONT.body,
        padding: wide ? "24px 28px" : stacked ? "28px 24px 22px" : "28px",
        gap: stacked ? 16 : 14,
      }}
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent, fontFamily: FONT.display }}>
          {data.rangeLabel}
        </p>
        <p
          className={`mt-1 font-bold leading-none tracking-[-0.03em] ${wide ? truncate : ""}`}
          style={{ fontFamily: FONT.display, fontSize: stacked ? 30 : wide ? 26 : 28 }}
        >
          {title}
        </p>
      </div>

      {nothing && (
        <p className="flex-1 text-sm" style={{ color: theme.muted }}>
          Choose something to include.
        </p>
      )}

      {stacked ? (
        <div className="flex flex-col gap-4">
          {tracks}
          {showTracks && showArtists && <div className="h-px" style={{ background: theme.line }} />}
          {artists}
          {genres}
        </div>
      ) : (
        <div
          className="grid min-h-0 flex-1 gap-6"
          style={{
            gridTemplateColumns:
              showTracks && (showArtists || showGenres)
                ? wide
                  ? "minmax(0, 1.5fr) minmax(0, 1fr)"
                  : "minmax(0, 1.4fr) minmax(0, 1fr)"
                : "minmax(0, 1fr)",
          }}
        >
          {tracks}
          {(showArtists || showGenres) && (
            <div className="flex min-w-0 flex-col gap-4">
              {artists}
              {genres}
            </div>
          )}
        </div>
      )}

      <p className="mt-auto text-center text-[12px] font-bold" style={{ color: theme.fg, fontFamily: FONT.display }}>
        Statsfy
      </p>
    </div>
  );
};
