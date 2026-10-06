"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Image", href: "/share" },
  { label: "Compare with a friend", href: "/share/compare" },
];

export const ShareTabs = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Share"
      className="mb-5 grid grid-cols-2 border-b border-line sm:flex sm:gap-6 lg:mb-6"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px flex min-h-11 items-center justify-center border-b-2 text-sm sm:text-[15px] ${
              active
                ? "border-main font-extrabold text-fg"
                : "border-transparent font-bold text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};
