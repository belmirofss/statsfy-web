"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
  LuChevronRight,
  LuClock,
  LuDisc3,
  LuGauge,
  LuGlobe,
  LuHistory,
  LuInfo,
  LuLayoutGrid,
  LuMenu,
  LuMic,
  LuMusic,
  LuShare,
} from "react-icons/lu";
import { useSpotifyAccount } from "../hooks/useSpotifyAccount";
import { getInitials } from "../helpers/getInitials";
import { InstallBanner, InstallMenuItem, IosInstallSheet } from "./InstallPrompt";
import { Logo } from "./Logo";
import { MobileMiniPlayer, SidebarMiniPlayer } from "./MiniPlayer";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

type NavItem = {
  label: string;
  shortLabel: string;
  href: string;
  Icon: IconType;
};

const OVERVIEW: NavItem = { label: "Overview", shortLabel: "Overview", href: "/resume", Icon: LuLayoutGrid };
const TOP_TRACKS: NavItem = { label: "Top tracks", shortLabel: "Tracks", href: "/top-tracks", Icon: LuMusic };
const TOP_ARTISTS: NavItem = { label: "Top artists", shortLabel: "Artists", href: "/top-artists", Icon: LuMic };
const TIME_MACHINE: NavItem = { label: "Time machine", shortLabel: "Time machine", href: "/time-machine", Icon: LuHistory };
const MAINSTREAM: NavItem = { label: "Mainstream", shortLabel: "Mainstream", href: "/mainstream", Icon: LuGauge };
const WORLD_MAP: NavItem = { label: "World map", shortLabel: "World map", href: "/world-map", Icon: LuGlobe };
const RECENTLY_PLAYED: NavItem = { label: "Recently played", shortLabel: "Recent", href: "/recently-played", Icon: LuClock };
const NEW_RELEASES: NavItem = { label: "New releases", shortLabel: "Releases", href: "/new-releases", Icon: LuDisc3 };
const SHARE: NavItem = { label: "Share", shortLabel: "Share", href: "/share", Icon: LuShare };

const MAIN_ITEMS: NavItem[] = [
  OVERVIEW,
  TOP_TRACKS,
  TOP_ARTISTS,
  TIME_MACHINE,
  MAINSTREAM,
  WORLD_MAP,
  RECENTLY_PLAYED,
  NEW_RELEASES,
  SHARE,
];

const ABOUT_ITEM: NavItem = {
  label: "About",
  shortLabel: "About",
  href: "/about",
  Icon: LuInfo,
};

// The phone tab bar has room for five; everything else lives under "More"
const MOBILE_TABS = [OVERVIEW, TOP_TRACKS, TOP_ARTISTS, SHARE];
const MORE_ITEMS = [TIME_MACHINE, MAINSTREAM, WORLD_MAP, RECENTLY_PLAYED, NEW_RELEASES, ABOUT_ITEM];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const PRODUCT_LABELS: Record<string, string> = {
  premium: "Premium",
  free: "Free",
  open: "Free",
};

const UserAvatar = ({ size }: { size: number }) => {
  const { data } = useSpotifyAccount();
  const imageUrl = data?.images?.[0]?.url;

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F4A259] font-extrabold text-[#2B1B0E]"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {imageUrl ? (
        // Profile pictures can come from hosts outside the image allowlist
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        getInitials(data?.display_name ?? "")
      )}
    </span>
  );
};

const AccountChip = () => {
  const { status } = useSession();
  const pathname = usePathname();
  const { data } = useSpotifyAccount();

  if (status === "unauthenticated") {
    return <SpotifyLoginButton label="Log in" size="regular" fullWidth />;
  }

  if (status === "loading") {
    return <div aria-hidden className="h-[58px] animate-pulse rounded-[14px] bg-raised" />;
  }

  const active = pathname === "/my-account";

  return (
    <Link
      href="/my-account"
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-[14px] border p-2.5 transition hover:bg-raised ${
        active ? "border-main bg-raised" : "border-edge"
      }`}
    >
      <UserAvatar size={36} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-fg">
          {data?.display_name ?? "My account"}
        </span>
        <span className="block text-xs text-muted">
          {/* Spotify stopped sharing product and country with some apps in 2026 */}
          {[data && PRODUCT_LABELS[data.product], data?.country].filter(Boolean).join(" · ") ||
            "Spotify"}
        </span>
      </span>
    </Link>
  );
};

const SidebarLink = ({ item, small }: { item: NavItem; small?: boolean }) => {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
        small ? "text-sm" : "text-[15px]"
      } ${
        active
          ? "bg-raised font-bold text-fg"
          : "font-semibold text-subtle hover:bg-raised/60 hover:text-white"
      }`}
    >
      <item.Icon
        aria-hidden
        size={small ? 18 : 20}
        className={active ? "text-main" : ""}
      />
      {item.label}
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="no-scrollbar sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-line bg-rail px-4 py-6 lg:flex">
      <Link href="/resume" className="mb-5 px-2.5" aria-label="Statsfy home">
        <Logo />
      </Link>
      <nav aria-label="Main" className="flex flex-col gap-0.5">
        {MAIN_ITEMS.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </nav>
      <div className="min-h-4 flex-1" />
      <SidebarLink item={ABOUT_ITEM} small />
      <div className="mt-2 flex flex-col gap-2">
        <SidebarMiniPlayer />
        <AccountChip />
      </div>
    </aside>
  );
};

export const MobileTopBar = () => {
  const { status } = useSession();

  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-5 lg:hidden">
      <Link href="/resume" aria-label="Statsfy home">
        <Logo size="small" />
      </Link>
      {status === "unauthenticated" ? (
        <SpotifyLoginButton label="Log in" size="small" withIcon={false} />
      ) : status === "loading" ? (
        <span aria-hidden className="h-11 w-11 animate-pulse rounded-full bg-raised" />
      ) : (
        <Link
          href="/my-account"
          aria-label="My account"
          className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-main"
        >
          <UserAvatar size={44} />
        </Link>
      )}
    </header>
  );
};

const MoreSheet = ({ onClose }: { onClose: () => void }) => {
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 lg:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="flex-1 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More"
        className="flex flex-col gap-1 rounded-t-3xl border-t border-edge bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2.5"
      >
        <span aria-hidden className="mx-auto mb-2.5 h-1 w-10 rounded-sm bg-edge" />
        <InstallMenuItem onClose={onClose} />
        {MORE_ITEMS.map((item, index) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              autoFocus={index === 0}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              className={`flex min-h-[52px] items-center gap-3.5 rounded-xl px-2 text-base font-bold ${
                active ? "bg-raised text-main" : "text-fg"
              }`}
            >
              <item.Icon aria-hidden size={22} className={active ? "" : "text-muted"} />
              <span className="flex-1">{item.label}</span>
              <LuChevronRight aria-hidden size={18} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const MobileTabBar = () => {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeTab = MOBILE_TABS.find((item) => isActive(pathname, item.href));
  const moreActive = !activeTab && MORE_ITEMS.some((item) => isActive(pathname, item.href));

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 lg:hidden">
        <InstallBanner />
        <MobileMiniPlayer />
        <nav
          aria-label="Main"
          className="grid grid-cols-5 border-t border-line bg-rail px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5"
        >
          {MOBILE_TABS.map((item) => {
            const active = !moreOpen && item === activeTab;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold ${
                  active ? "text-main" : "text-muted"
                }`}
              >
                <item.Icon aria-hidden size={22} />
                {item.shortLabel}
              </Link>
            );
          })}
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold ${
              moreOpen || moreActive ? "text-main" : "text-muted"
            }`}
          >
            <LuMenu aria-hidden size={22} />
            More
          </button>
        </nav>
      </div>
      {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}
      <IosInstallSheet />
    </>
  );
};
