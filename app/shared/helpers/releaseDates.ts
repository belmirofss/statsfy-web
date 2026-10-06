import { SpotifyAlbum } from "../types";

export const getReleaseYear = (album: SpotifyAlbum): number | null => {
  const year = Number.parseInt(album.release_date?.slice(0, 4) ?? "", 10);
  return Number.isNaN(year) ? null : year;
};

/**
 * Release date as a Date. Albums with only a year or month are placed on the
 * first day of that period.
 */
export const getReleaseDate = (album: SpotifyAlbum): Date | null => {
  if (!album.release_date) {
    return null;
  }

  const [year, month = "01", day = "01"] = album.release_date.split("-");
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const DAY = 1000 * 60 * 60 * 24;

export const formatReleaseAge = (date: Date) => {
  const days = Math.floor((Date.now() - date.getTime()) / DAY);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
