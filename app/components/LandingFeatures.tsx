import { ReactNode } from "react";
import { SpotifyLoginButton } from "@/app/shared/components/SpotifyLoginButton";
import { MAINSTREAM_TIER_COLORS } from "@/app/shared/helpers/getMainstreamStats";

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

const FEATURES: { title: string; text: string; preview: ReactNode }[] = [
  {
    title: "Top tracks",
    text: "Your 50 most played songs from the last 4 weeks, 6 months or all time.",
    preview: (
      <Preview className="flex-col justify-center gap-2">
        <Row rank={1} color="#2B44E8" width="55%" />
        <Row rank={2} color="#E9475E" width="45%" />
        <Row rank={3} color="#7A4A2C" width="50%" />
      </Preview>
    ),
  },
  {
    title: "Top artists",
    text: "The artists you play most, your top genres and who's climbing your ranking.",
    preview: (
      <Preview className="items-center justify-center gap-3">
        <span className="h-16 w-16 rounded-full bg-[#E9475E] ring-[3px] ring-main" />
        <span className="h-[52px] w-[52px] rounded-full bg-[#5B8DEF]" />
        <span className="h-11 w-11 rounded-full bg-[#F4A259]" />
      </Preview>
    ),
  },
  {
    title: "Recently played",
    text: "Your last 50 plays, with when you played each one.",
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
  {
    title: "Time machine",
    text: "Find your music year and the decades your favourite songs come from.",
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
  {
    title: "Mainstream meter",
    text: "See how far off the charts you go, and your most underground favourites.",
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
  {
    title: "World map",
    text: "Discover which countries your favourite artists come from.",
    preview: (
      <Preview className="grid grid-cols-10 content-center gap-1">
        {MAP_PATTERN.map((tone, index) => (
          <span key={index} className="h-4 rounded-[3px]" style={{ background: MAP_COLORS[tone] }} />
        ))}
      </Preview>
    ),
  },
  {
    title: "New releases",
    text: "Never miss a drop from the artists you follow and play the most.",
    preview: (
      <Preview className="items-center gap-2.5">
        <span className="h-[78px] w-[78px] rounded-[10px] bg-[#8E7DFF]" />
        <span className="h-16 w-16 rounded-[10px] bg-[#5B8DEF]" />
        <span className="h-[50px] w-[50px] rounded-[10px] bg-[#F4A259]" />
      </Preview>
    ),
  },
  {
    title: "Now playing with lyrics",
    text: "Follow along with synced lyrics and see your history with the song.",
    preview: (
      <Preview className="flex-col justify-center gap-1.5">
        <span className="h-2 w-3/5 rounded bg-edge" />
        <span className="h-3.5 w-4/5 rounded bg-fg" />
        <span className="h-2 w-[70%] rounded bg-edge" />
        <span className="h-2 w-1/2 rounded bg-edge" />
      </Preview>
    ),
  },
  {
    title: "Taste match",
    text: "Send a link to a friend and see how much your music taste overlaps.",
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
];

export const LandingFeatures = () => (
  <section id="features" className="scroll-mt-4 border-t border-line bg-rail">
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-14 lg:gap-9 lg:px-8 lg:py-[72px]">
      <h2 className="max-w-[640px] font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[44px]">
        Everything your Spotify account can tell you about your taste
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="card flex flex-col gap-3.5 p-[18px] lg:p-[22px]">
            <div className="hidden sm:block">{feature.preview}</div>
            <h3 className="font-display text-lg font-bold lg:text-xl">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-soft lg:text-[15px]">{feature.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const StorySlide = ({
  background,
  color,
  rotate,
  children,
}: {
  background: string;
  color: string;
  rotate?: number;
  children: ReactNode;
}) => (
  <span
    className="flex h-[164px] w-[92px] shrink-0 flex-col gap-1 rounded-md px-2 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] lg:h-[213px] lg:w-[120px] lg:px-3 lg:py-3.5"
    style={{ background, color, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
  >
    {children}
  </span>
);

export const LandingShareBand = () => (
  <section className="mx-auto w-full max-w-[1280px] px-5 py-14 lg:px-8 lg:py-[72px]">
    <div className="flex flex-col items-center gap-8 overflow-hidden rounded-[28px] bg-main p-6 text-on-main lg:flex-row lg:gap-10 lg:p-12">
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        <h2 className="font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[42px]">
          Share it. Or compare it.
        </h2>
        <p className="max-w-[520px] text-base font-semibold leading-relaxed lg:text-[17px]">
          Turn your stats into story-ready images, or send a friend a link and find out who has
          the better taste.
        </p>
        <SpotifyLoginButton
          label="Get started with Spotify"
          variant="light"
          size="regular"
          withIcon={false}
          className="self-start !bg-canvas !text-fg"
        />
      </div>
      <div aria-hidden className="flex justify-center gap-2.5 lg:gap-3.5">
        <StorySlide background="#5B3DF5" color="#FFFFFF" rotate={-6}>
          <span className="text-[10px] font-extrabold lg:text-xs">My song of the month</span>
        </StorySlide>
        <StorySlide background="#FFD23F" color="#111111">
          <span className="text-[10px] font-extrabold lg:text-xs">My music year</span>
          <span className="font-display text-[26px] font-bold leading-none lg:text-[34px]">2021</span>
        </StorySlide>
        <StorySlide background="#FF8FAB" color="#111111" rotate={6}>
          <span className="text-[10px] font-extrabold lg:text-xs">Taste match</span>
          <span className="font-display text-[26px] font-bold leading-none lg:text-[34px]">71%</span>
        </StorySlide>
      </div>
    </div>
  </section>
);
