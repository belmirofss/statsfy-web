"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { IconType } from "react-icons";
import {
  LuClock,
  LuInfo,
  LuLayoutGrid,
  LuMic,
  LuMusic,
  LuShare,
} from "react-icons/lu";
import { useSpotifyAccount } from "../hooks/useSpotifyAccount";
import { getInitials } from "../helpers/getInitials";
import { Logo } from "./Logo";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

type NavItem = {
  label: string;
  shortLabel: string;
  href: string;
  Icon: IconType;
};

const MAIN_ITEMS: NavItem[] = [
  { label: "Overview", shortLabel: "Overview", href: "/resume", Icon: LuLayoutGrid },
  { label: "Top tracks", shortLabel: "Tracks", href: "/top-tracks", Icon: LuMusic },
  { label: "Top artists", shortLabel: "Artists", href: "/top-artists", Icon: LuMic },
  { label: "Recently played", shortLabel: "Recent", href: "/recently-played", Icon: LuClock },
  { label: "Share", shortLabel: "Share", href: "/share", Icon: LuShare },
];

const ABOUT_ITEM: NavItem = {
  label: "About",
  shortLabel: "About",
  href: "/about",
  Icon: LuInfo,
};

const MOBILE_ITEMS = [
  MAIN_ITEMS[0],
  MAIN_ITEMS[1],
  MAIN_ITEMS[2],
  MAIN_ITEMS[4],
  ABOUT_ITEM,
];

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
          {data
            ? `${PRODUCT_LABELS[data.product] ?? "Spotify"} · ${data.country}`
            : "Spotify"}
        </span>
      </span>
    </Link>
  );
};

const SidebarLink = ({ item, small }: { item: NavItem; small?: boolean }) => {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl p-3 transition ${
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
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col gap-1 border-r border-line bg-rail px-4 py-6 lg:flex">
      <Link href="/resume" className="mb-6 px-2.5" aria-label="Statsfy home">
        <Logo />
      </Link>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {MAIN_ITEMS.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </nav>
      <div className="flex-1" />
      <SidebarLink item={ABOUT_ITEM} small />
      <div className="mt-2">
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

export const MobileTabBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-rail px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 lg:hidden"
    >
      {MOBILE_ITEMS.map((item) => {
        const active = pathname === item.href;
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
    </nav>
  );
};
