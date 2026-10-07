import { ReactNode } from "react";
import { MAINSTREAM_TIER_COLORS } from "./helpers/getMainstreamStats";
import { MOODS } from "./helpers/getMoodStats";

// Small abstract drawings of each feature; real data appears after logging in
const Preview = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div aria-hidden className={`flex h-[110px] rounded-[14px] bg-raised p-4 ${className}`}>
    {children}
  </div>
);

const Row = ({ color, rank, width }: { color: string; rank?: number; width: string }) => (
  <span className="flex items-center gap-2.5">
    {rank !== undefined && (
      <span className={`w-3.5 font-display text-[13px] font-bold ${rank === 1 ? "text-main" : "text-muted"}`}>
        {rank}
      </span>
    )}
    <span className="h-6 w-6 shrink-0 rounded-[5px]" style={{ background: color }} />
    <span className={`h-2 rounded ${rank === 1 ? "bg-fg" : "bg-edge"}`} style={{ width }} />
  </span>
);

const MAP_PATTERN = [0, 1, 0, 0, 3, 2, 0, 0, 2, 0, 4, 0, 0, 2, 0, 1, 0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1];
const MAP_COLORS = ["#2A2E28", "#1F5A33", "#1A9A4B", "#1ED760", "#A6F3C2"];

// [left %, top %, color] of the songs on the mood map drawing
const MOOD_DOTS: [number, number, string][] = [
  [14, 18, MOODS.angsty.color],
  [30, 30, MOODS.angsty.color],
  [22, 40, MOODS.angsty.color],
  [38, 14, MOODS.angsty.color],
  [70, 22, MOODS.euphoric.color],
  [84, 36, MOODS.euphoric.color],
  [20, 74, MOODS.melancholic.color],
  [36, 84, MOODS.melancholic.color],
  [74, 70, MOODS.peaceful.color],
];

export type Feature = {
  href: string;
  title: string;
  // Short line for the landing page cards
  text: string;
  // Shown to logged out visitors (and search engines) on the feature's own page
  heading: string;
  intro: string;
  preview: ReactNode;
};

export type FeatureKey =
  | "topTracks"
  | "topArtists"
  | "recentlyPlayed"
  | "timeMachine"
  | "mainstream"
  | "moodMap"
  | "worldMap"
  | "newReleases"
  | "nowPlaying"
  | "tasteMatch"
  | "knowYourself";

export const FEATURES: Record<FeatureKey, Feature> = {
  topTracks: {
    href: "/top-tracks",
    title: "Top tracks",
    text: "Your 50 most played songs from the last 4 weeks, 6 months or all time.",
    heading: "See your top tracks on Spotify",
    intro:
      "Find out which songs you really have on repeat. Statsfy ranks the 50 tracks you've played most on Spotify over the last 4 weeks, the last 6 months or of all time.",
    preview: (
      <Preview className="flex-col justify-center gap-2">
        <Row rank={1} color="#2B44E8" width="55%" />
        <Row rank={2} color="#E9475E" width="45%" />
        <Row rank={3} color="#7A4A2C" width="50%" />
      </Preview>
    ),
  },
  topArtists: {
    href: "/top-artists",
    title: "Top artists",
    text: "The artists you play most, your top genres and who's climbing your ranking.",
    heading: "See your top artists on Spotify",
    intro:
      "Discover who you listen to most. Statsfy ranks the artists you play most on Spotify over the last 4 weeks, 6 months or all time, with your top genres and the artists climbing your ranking.",
    preview: (
      <Preview className="items-center justify-center gap-3">
        <span className="h-16 w-16 rounded-full bg-[#E9475E] ring-[3px] ring-main" />
        <span className="h-[52px] w-[52px] rounded-full bg-[#5B8DEF]" />
        <span className="h-11 w-11 rounded-full bg-[#F4A259]" />
      </Preview>
    ),
  },
  recentlyPlayed: {
    href: "/recently-played",
    title: "Recently played",
    text: "Your last 50 plays, with when you played each one.",
    heading: "See your recently played songs on Spotify",
    intro:
      "Look back at the last 50 tracks you played on Spotify, with exactly when you played each one.",
    preview: (
      <Preview className="flex-col justify-center gap-2">
        {[
          ["#8E7DFF", "2m"],
          ["#2EC4B6", "6m"],
          ["#FFD166", "11m"],
        ].map(([color, time]) => (
          <span key={time} className="flex items-center gap-2.5">
            <span className="h-6 w-6 shrink-0 rounded-[5px]" style={{ background: color }} />
            <span className="h-2 flex-1 rounded bg-edge" />
            <span className="text-[11px] font-bold text-muted">{time}</span>
          </span>
        ))}
      </Preview>
    ),
  },
  timeMachine: {
    href: "/time-machine",
    title: "Time machine",
    text: "Find your music year and the decades your favourite songs come from.",
    heading: "Find your music year",
    intro:
      "Which year does your taste belong to? Statsfy looks at when your favourite Spotify songs were released to find your music year and the decades you listen to most.",
    preview: (
      <Preview className="items-end gap-2">
        {[14, 24, 34, 48, 62, 100, 80].map((height, index) => (
          <span
            key={index}
            className={`flex-1 rounded ${height === 100 ? "bg-main" : "bg-edge"}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </Preview>
    ),
  },
  mainstream: {
    href: "/mainstream",
    title: "Mainstream meter",
    text: "See how far off the charts you go, and your most underground favourites.",
    heading: "How mainstream is your Spotify taste?",
    intro:
      "Statsfy uses the popularity of the music you play most to measure how mainstream or underground your Spotify taste is, and shows your most underground favourites.",
    preview: (
      <Preview className="flex-col justify-center gap-3">
        <span className="font-display text-[22px] font-bold">Crate digger</span>
        <span className="relative flex h-2.5 overflow-hidden rounded-full">
          {MAINSTREAM_TIER_COLORS.map((color) => (
            <span key={color} className="flex-1" style={{ background: color }} />
          ))}
          <span className="absolute left-[32%] top-0 h-2.5 w-1 bg-fg" />
        </span>
      </Preview>
    ),
  },
  moodMap: {
    href: "/mood-map",
    title: "Mood map",
    text: "Where your songs sit between happy and sad, calm and intense, and your vibe in two words.",
    heading: "Is your Spotify music happy or sad?",
    intro:
      "Statsfy maps your top Spotify songs between happy and sad, calm and intense, sums up your vibe and shows the tempo you listen to most.",
    preview: (
      <Preview className="relative overflow-hidden p-0">
        <span className="absolute inset-y-0 left-1/2 w-px bg-edge" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-edge" />
        {MOOD_DOTS.map(([left, top, color]) => (
          <span
            key={`${left}-${top}`}
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[4px]"
            style={{ left: `${left}%`, top: `${top}%`, background: color }}
          />
        ))}
        <span className="absolute left-[27%] top-[30%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-main" />
      </Preview>
    ),
  },
  worldMap: {
    href: "/world-map",
    title: "World map",
    text: "Discover which countries your favourite artists come from.",
    heading: "Where do your favourite artists come from?",
    intro:
      "See a map of the countries your top Spotify artists come from, and find out how international your music taste really is.",
    preview: (
      <Preview className="grid grid-cols-10 content-center gap-1">
        {MAP_PATTERN.map((tone, index) => (
          <span key={index} className="h-4 rounded-[3px]" style={{ background: MAP_COLORS[tone] }} />
        ))}
      </Preview>
    ),
  },
  newReleases: {
    href: "/new-releases",
    title: "New releases",
    text: "Never miss a drop from the artists you follow and play the most.",
    heading: "New releases from the artists you listen to",
    intro:
      "Never miss a drop. Statsfy collects the latest albums and singles from the artists you follow and play the most on Spotify.",
    preview: (
      <Preview className="items-center gap-2.5">
        <span className="h-[78px] w-[78px] rounded-[10px] bg-[#8E7DFF]" />
        <span className="h-16 w-16 rounded-[10px] bg-[#5B8DEF]" />
        <span className="h-[50px] w-[50px] rounded-[10px] bg-[#F4A259]" />
      </Preview>
    ),
  },
  nowPlaying: {
    href: "/now-playing",
    title: "Now playing with lyrics",
    text: "Follow along with synced lyrics and see your history with the song.",
    heading: "Spotify now playing, with synced lyrics",
    intro:
      "Follow along with time-synced lyrics for the song playing on your Spotify, and see your history with it.",
    preview: (
      <Preview className="flex-col justify-center gap-1.5">
        <span className="h-2 w-3/5 rounded bg-edge" />
        <span className="h-3.5 w-4/5 rounded bg-fg" />
        <span className="h-2 w-[70%] rounded bg-edge" />
        <span className="h-2 w-1/2 rounded bg-edge" />
      </Preview>
    ),
  },
  tasteMatch: {
    href: "/share/compare",
    title: "Taste match",
    text: "Send a link to a friend and see how much your music taste overlaps.",
    heading: "Compare your music taste with a friend",
    intro:
      "Send a friend a link and find out how much your Spotify taste overlaps, with your taste match score.",
    preview: (
      <Preview className="items-center justify-center gap-4">
        <span className="flex">
          <span className="h-[52px] w-[52px] rounded-full border-[3px] border-raised bg-[#F4A259]" />
          <span className="-ml-3.5 h-[52px] w-[52px] rounded-full border-[3px] border-raised bg-[#8E7DFF]" />
        </span>
        <span className="font-display text-[32px] font-bold text-main">71%</span>
      </Preview>
    ),
  },
  knowYourself: {
    href: "/know-yourself",
    title: "Know yourself",
    text: "Guess which of your songs you play more, or name one from its intro. Then challenge a friend.",
    heading: "How well do you know your Spotify taste?",
    intro:
      "Play higher or lower with your own top Spotify songs, or name them from their first second. Then send a friend a challenge and see who knows your taste better.",
    preview: (
      <Preview className="items-center justify-center gap-3">
        <span className="flex h-full w-16 flex-col justify-end gap-1.5 rounded-[10px] border-2 border-main bg-[#14241A] p-1.5">
          <span className="flex-1 rounded-md bg-[#2B44E8]" />
          <span className="text-right font-display text-xs font-bold text-main">#1</span>
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-edge bg-canvas font-display text-[11px] font-bold text-muted">
          or
        </span>
        <span className="flex h-full w-16 flex-col justify-end gap-1.5 rounded-[10px] border-2 border-edge p-1.5">
          <span className="flex-1 rounded-md bg-[#7A4A2C]" />
          <span className="text-right font-display text-xs font-bold text-muted">#?</span>
        </span>
      </Preview>
    ),
  },
};

export const FEATURE_LIST = Object.values(FEATURES);
