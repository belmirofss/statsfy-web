import { GenreShare } from "@/app/shared/helpers/getTopGenres";
import { SpotifyArtist, SpotifyTimeRanges, SpotifyTrack } from "@/app/shared/types";

export type ShareFormat = "story" | "square" | "wide";

export const FORMATS: Record<
  ShareFormat,
  { label: string; ratio: string; width: number; height: number }
> = {
  story: { label: "Story", ratio: "9:16", width: 360, height: 640 },
  square: { label: "Square", ratio: "1:1", width: 480, height: 480 },
  wide: { label: "Wide", ratio: "16:9", width: 640, height: 360 },
};

// Exports always have a 1080px short side (1080×1920, 1080×1080, 1920×1080)
export const getExportScale = (format: ShareFormat) => {
  const { width, height } = FORMATS[format];
  return 1080 / Math.min(width, height);
};

export type ShareInclude = {
  tracks: boolean;
  artists: boolean;
  genres: boolean;
};

// Extra stats for the Story pack; each one is missing when there's no data
export type ShareInsights = {
  musicYear?: {
    year: number;
    nostalgiaPercent: number;
    decades: { label: string; count: number }[];
    topDecade: string;
  };
  mainstream?: { score: number; tier: string; lowest: string };
  world?: { countries: string[]; continents: number; topNames: string[] };
  mood?: {
    vibe: string;
    // Each song on the map, positions in percent
    dots: { left: string; top: string; color: string }[];
    mix: { name: string; color: string; percent: number }[];
    tempo: number;
  };
  match?: {
    friendName: string;
    score: number;
    tier: string;
    sharedArtists: number;
    topSharedArtist: string | null;
  };
};

export type ShareData = {
  name: string;
  firstName: string;
  timeRange: SpotifyTimeRanges;
  rangeLabel: string;
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  genres: GenreShare[];
  insights: ShareInsights;
};

export type ShareTheme = {
  id: string;
  label: string;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  onAccent: string;
  line: string;
};

export type TemplateProps = {
  data: ShareData;
  format: ShareFormat;
  include: ShareInclude;
  theme: ShareTheme;
};

export const PULSE_THEMES: ShareTheme[] = [
  { id: "dark", label: "Dark", bg: "#0B0C0A", fg: "#F2F4EF", muted: "#9AA196", accent: "#1ED760", onAccent: "#06210F", line: "#22261F" },
  { id: "light", label: "Light", bg: "#F2F4EF", fg: "#0B0C0A", muted: "#4F564B", accent: "#0E8F3E", onAccent: "#FFFFFF", line: "#D9DDD5" },
  { id: "green", label: "Green", bg: "#1ED760", fg: "#06210F", muted: "#0B4D24", accent: "#06210F", onAccent: "#1ED760", line: "#19B851" },
  { id: "violet", label: "Violet", bg: "#5B3DF5", fg: "#FFFFFF", muted: "#DCD5FF", accent: "#C6F432", onAccent: "#111111", line: "#7259F7" },
  { id: "coral", label: "Coral", bg: "#FF6B4A", fg: "#1A0A05", muted: "#5A2414", accent: "#1A0A05", onAccent: "#FF6B4A", line: "#FF8A6E" },
];

export const PRINT_THEMES: ShareTheme[] = [
  { id: "paper", label: "Paper", bg: "#FFFFFF", fg: "#0A0A0A", muted: "#5F5F5F", accent: "#1ED760", onAccent: "#0A0A0A", line: "#E4E4E4" },
  { id: "ink", label: "Ink", bg: "#0A0A0A", fg: "#FFFFFF", muted: "#A3A3A3", accent: "#1ED760", onAccent: "#0A0A0A", line: "#2A2A2A" },
];

export const RECEIPT_THEMES: ShareTheme[] = [
  { id: "green", label: "Green", bg: "#1ED760", fg: "#0A0A0A", muted: "#3A3A3A", accent: "#0A0A0A", onAccent: "#FFFFFF", line: "#0A0A0A" },
  { id: "ink", label: "Ink", bg: "#0B0C0A", fg: "#0A0A0A", muted: "#3A3A3A", accent: "#0A0A0A", onAccent: "#FFFFFF", line: "#0A0A0A" },
  { id: "violet", label: "Violet", bg: "#5B3DF5", fg: "#0A0A0A", muted: "#3A3A3A", accent: "#0A0A0A", onAccent: "#FFFFFF", line: "#0A0A0A" },
];

export const FONT = {
  archivo: "var(--font-archivo), sans-serif",
  mono: "var(--font-jetbrains), monospace",
  bricolage: "var(--font-bricolage), sans-serif",
  display: "var(--font-space-grotesk), sans-serif",
  body: "var(--font-manrope), sans-serif",
};
