import Link from "next/link";
import { IconType } from "react-icons";
import { LuBarChart3, LuMusic, LuShare, LuShieldCheck } from "react-icons/lu";
import { Logo } from "@/app/shared/components/Logo";
import { LandingFeatures, LandingShareBand } from "./components/LandingFeatures";
import { SpotifyLoginButton } from "./shared/components/SpotifyLoginButton";
import { SITE_URL } from "./shared/constants";

// Illustrative preview only, real data appears after logging in
const PREVIEW_TRACKS = [
  { rank: 2, name: "Good Luck, Babe!", artist: "Chappell Roan", colors: ["#E9475E", "#FFD2D8"] },
  { rank: 3, name: "Espresso", artist: "Sabrina Carpenter", colors: ["#7A4A2C", "#F2C9A0"] },
  { rank: 4, name: "Not Like Us", artist: "Kendrick Lamar", colors: ["#2A2A2A", "#E8E8E8"] },
  { rank: 5, name: "APT.", artist: "ROSÉ, Bruno Mars", colors: ["#FF7FB0", "#FFF0F6"] },
];

const FEATURES: { title: string; Icon: IconType }[] = [
  { title: "Your top tracks and artists", Icon: LuMusic },
  { title: "Insights into your taste", Icon: LuBarChart3 },
  { title: "Share and compare with friends", Icon: LuShare },
  { title: "Private by design", Icon: LuShieldCheck },
];

const PreviewCover = ({ colors, size }: { colors: string[]; size: number }) => (
  <span
    aria-hidden
    className="relative block shrink-0 overflow-hidden rounded-lg"
    style={{ width: size, height: size, background: colors[0] }}
  >
    <span
      className="absolute -bottom-[14%] -right-[14%] h-[70%] w-[70%] rounded-full"
      style={{ background: colors[1] }}
    />
  </span>
);

const ProductPreview = () => (
  <div className="relative mx-auto w-full min-w-0 max-w-[560px] lg:mr-0 lg:pl-10">
    <div className="card flex flex-col gap-4 rounded-3xl border-edge p-5 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="whitespace-nowrap font-display text-lg font-bold lg:text-xl">Top tracks</p>
        <div className="flex shrink-0 gap-1 whitespace-nowrap rounded-full bg-canvas p-1 text-xs font-bold">
          <span className="rounded-full bg-fg px-3 py-1.5 text-canvas">4 weeks</span>
          <span className="px-3 py-1.5 text-muted">6 months</span>
          <span className="hidden px-3 py-1.5 text-muted sm:inline">All time</span>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-2xl bg-raised p-4">
        <PreviewCover colors={["#2B44E8", "#A9B8FF"]} size={88} />
        <div className="min-w-0">
          <p className="eyebrow text-main">#1 this month</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">
            Birds of a Feather
          </p>
          <p className="text-[15px] text-muted">Billie Eilish</p>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {PREVIEW_TRACKS.map((track) => (
          <li key={track.rank} className="flex items-center gap-3.5 px-1.5 py-1">
            <span className="w-5 font-display font-bold text-muted">{track.rank}</span>
            <PreviewCover colors={track.colors} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold">{track.name}</span>
              <span className="block text-[13px] text-muted">{track.artist}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="absolute -top-5 right-0 hidden flex-col rounded-2xl bg-[#FFD23F] px-[18px] py-3 text-[#111111] shadow-2xl sm:flex">
      <span className="text-[11px] font-extrabold tracking-[0.06em]">MY MUSIC YEAR</span>
      <span className="font-display text-[30px] font-bold leading-none">2021</span>
    </div>
    <div className="absolute -bottom-5 left-0 hidden items-center gap-3 rounded-2xl bg-fg py-3.5 pl-3.5 pr-5 text-canvas shadow-2xl sm:flex lg:-left-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9475E] font-extrabold text-[#FFE3E7]">
        CR
      </span>
      <span>
        <span className="block text-xs font-bold tracking-[0.06em] text-[#4F564B]">
          TOP ARTIST
        </span>
        <span className="block font-display text-lg font-bold">Chappell Roan</span>
      </span>
    </div>
  </div>
);

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "Statsfy", url: SITE_URL },
    {
      "@type": "WebApplication",
      name: "Statsfy",
      url: SITE_URL,
      description:
        "See your top Spotify tracks and artists, find your music year and how mainstream your taste is, and share it with friends.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

// Logged in visitors are sent to /resume by the middleware
export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <header className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-5 lg:px-8 lg:py-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-2 text-[15px] font-semibold lg:gap-8">
          <Link href="#features" className="px-2 py-3 text-subtle hover:text-white">
            Features
          </Link>
          <Link href="/about" className="hidden px-2 py-3 text-subtle hover:text-white sm:inline">
            How it works
          </Link>
          <Link href="/about#privacy" className="hidden px-2 py-3 text-subtle hover:text-white sm:inline">
            Privacy
          </Link>
          <Link href="/about" className="px-2 py-3 text-subtle hover:text-white sm:hidden">
            About
          </Link>
          <SpotifyLoginButton
            label="Log in"
            variant="light"
            size="small"
            withIcon={false}
            className="hidden sm:inline-flex"
          />
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-12 px-5 pb-12 pt-4 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-6">
        <div className="flex min-w-0 flex-col gap-6 lg:gap-7">
          <h1 className="font-display text-[44px] font-bold leading-[1] tracking-[-0.035em] sm:text-[56px] lg:text-[68px]">
            Hello! Are you looking for your{" "}
            <span className="text-main">Spotify stats?</span>
          </h1>
          <p className="max-w-[480px] text-[17px] leading-relaxed text-soft lg:text-[19px]">
            See what you really listen to, and what it says about you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SpotifyLoginButton className="w-full sm:w-auto" />
          </div>
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <LuShieldCheck aria-hidden size={18} className="shrink-0" />
            Nothing is stored on our servers. Your stats stay on your device.
          </p>
        </div>

        <ProductPreview />
      </main>

      <LandingFeatures />
      <LandingShareBand />

      <footer className="border-t border-edge">
        <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-8">
          {FEATURES.map(({ title, Icon }) => (
            <div key={title} className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raised text-main">
                <Icon aria-hidden size={20} />
              </span>
              <p className="text-[15px] font-extrabold leading-snug">{title}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
