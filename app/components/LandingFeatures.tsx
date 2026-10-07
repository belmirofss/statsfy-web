import Link from "next/link";
import { ReactNode } from "react";
import { SpotifyLoginButton } from "@/app/shared/components/SpotifyLoginButton";
import { FEATURE_LIST } from "@/app/shared/features";

export const LandingFeatures = () => (
  <section id="features" className="scroll-mt-4 border-t border-line bg-rail">
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-14 lg:gap-9 lg:px-8 lg:py-[72px]">
      <h2 className="max-w-[640px] font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[44px]">
        Everything your Spotify account can tell you about your taste
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {FEATURE_LIST.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="card flex flex-col gap-3.5 p-[18px] transition hover:border-edge hover:bg-raised/40 lg:p-[22px]"
          >
            <div className="hidden sm:block">{feature.preview}</div>
            <h3 className="font-display text-lg font-bold lg:text-xl">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-soft lg:text-[15px]">{feature.text}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const StorySlide = ({
  background,
  color,
  rotate,
  className = "flex",
  children,
}: {
  background: string;
  color: string;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={`h-[164px] w-[92px] shrink-0 flex-col gap-1 rounded-md px-2 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] lg:h-[213px] lg:w-[120px] lg:px-3 lg:py-3.5 ${className}`}
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
          Share it. Compare it. Challenge it.
        </h2>
        <p className="max-w-[520px] text-base font-semibold leading-relaxed lg:text-[17px]">
          Turn your stats into story-ready images, send a friend a link to see who has the
          better taste, or dare them to guess your top songs.
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
        <StorySlide background="#5B3DF5" color="#FFFFFF" rotate={-6} className="hidden sm:flex">
          <span className="text-[10px] font-extrabold lg:text-xs">My song of the month</span>
        </StorySlide>
        <StorySlide background="#FFD23F" color="#111111">
          <span className="text-[10px] font-extrabold lg:text-xs">My music year</span>
          <span className="font-display text-[26px] font-bold leading-none lg:text-[34px]">2021</span>
        </StorySlide>
        <StorySlide background="#111111" color="#FFFFFF">
          <span className="text-[10px] font-extrabold text-warn lg:text-xs">My mood map</span>
          <span className="font-display text-[15px] font-bold leading-tight lg:text-xl">
            Late-night drive
          </span>
        </StorySlide>
        <StorySlide background="#FF8FAB" color="#111111" rotate={6}>
          <span className="text-[10px] font-extrabold lg:text-xs">Beat my score</span>
          <span className="font-display text-[26px] font-bold leading-none lg:text-[34px]">8/10</span>
        </StorySlide>
      </div>
    </div>
  </section>
);
