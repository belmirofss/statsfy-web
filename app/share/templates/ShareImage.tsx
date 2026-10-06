import { Cover } from "@/app/shared/components/Cover";
import { getInitials } from "@/app/shared/helpers/getInitials";
import { SpotifyArtist, SpotifyTrack } from "@/app/shared/types";

type Props = {
  size: number;
  radius?: string;
  className?: string;
};

// Images inside share cards load eagerly and at 3× so exports stay sharp
export const TrackArt = ({
  track,
  size,
  radius = "rounded-lg",
  className,
}: Props & { track: SpotifyTrack }) => (
  <Cover
    src={track.album.images[0]?.url}
    alt=""
    size={size}
    radius={radius}
    sizes={`${size * 3}px`}
    className={className}
    eager
  />
);

export const ArtistArt = ({
  artist,
  size,
  radius,
  className,
}: Props & { artist: SpotifyArtist }) => (
  <Cover
    src={artist.images?.[0]?.url}
    alt=""
    size={size}
    shape={radius ? "square" : "circle"}
    radius={radius}
    sizes={`${size * 3}px`}
    fallback={getInitials(artist.name)}
    className={className}
    eager
  />
);
