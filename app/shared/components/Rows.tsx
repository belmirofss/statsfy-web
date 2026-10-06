import { ReactNode } from "react";
import { formatArtistsToArtistNames } from "../helpers/formatArtistsToArtistNames";
import { getInitials } from "../helpers/getInitials";
import { SpotifyArtist, SpotifyTrack } from "../types";
import { Cover } from "./Cover";

type RowProps = {
  rank?: number;
  right?: ReactNode;
  size?: number;
};

export const TrackRow = ({
  track,
  rank,
  right,
  size = 44,
}: RowProps & { track: SpotifyTrack }) => (
  <li className="flex items-center gap-3 py-1">
    {rank !== undefined && (
      <span className="w-6 shrink-0 font-display text-sm font-bold text-muted">
        {rank}
      </span>
    )}
    <Cover src={track.album.images[0]?.url} alt="" size={size} />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-bold">{track.name}</span>
      <span className="block truncate text-xs text-muted">
        {formatArtistsToArtistNames(track.artists)}
      </span>
    </span>
    {right}
  </li>
);

export const ArtistRow = ({
  artist,
  rank,
  right,
  size = 44,
}: RowProps & { artist: SpotifyArtist }) => (
  <li className="flex items-center gap-3 py-1">
    {rank !== undefined && (
      <span className="w-6 shrink-0 font-display text-sm font-bold text-muted">
        {rank}
      </span>
    )}
    <Cover
      src={artist.images?.[0]?.url}
      alt=""
      size={size}
      shape="circle"
      fallback={getInitials(artist.name)}
    />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-bold">{artist.name}</span>
      {artist.genres?.[0] && (
        <span className="block truncate text-xs capitalize text-muted">
          {artist.genres.slice(0, 2).join(" · ")}
        </span>
      )}
    </span>
    {right}
  </li>
);
