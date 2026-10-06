import { formatReleaseAge } from "../helpers/releaseDates";
import { Release } from "../hooks/useNewReleases";
import { Cover } from "./Cover";

const TYPE_LABELS: Record<string, string> = {
  album: "Album",
  single: "Single",
  compilation: "Compilation",
};

export const getReleaseType = (release: Release) => {
  const type = release.album.album_type ?? "album";
  // Spotify files EPs under "single"; more than 3 tracks reads as an EP
  if (type === "single" && (release.album.total_tracks ?? 1) > 3) return "EP";
  return TYPE_LABELS[type] ?? "Album";
};

export const getReleaseReason = (release: Release) =>
  release.reason.type === "top" ? `#${release.reason.rank} artist` : "You follow";

export const ReleaseCard = ({ release, showReason = true }: { release: Release; showReason?: boolean }) => {
  const url = release.album.external_urls?.spotify;

  const content = (
    <>
      <Cover
        src={release.album.images[0]?.url}
        alt={`${release.album.name} cover`}
        radius="rounded-xl"
        className="aspect-square"
      />
      <span className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-bold text-fg">{release.album.name}</span>
        <span className="truncate text-[13px] text-soft">{release.artist.name}</span>
        <span className="text-xs text-muted">
          {getReleaseType(release)} · {formatReleaseAge(release.date)}
        </span>
      </span>
      {showReason && (
        <span
          className={`self-start rounded-full bg-raised px-2.5 py-1 text-[11px] font-extrabold ${
            release.reason.type === "top" ? "text-main" : "text-subtle"
          }`}
        >
          {getReleaseReason(release)}
        </span>
      )}
    </>
  );

  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 flex-col gap-2 rounded-xl transition hover:opacity-90"
    >
      {content}
    </a>
  ) : (
    <div className="flex min-w-0 flex-col gap-2">{content}</div>
  );
};
