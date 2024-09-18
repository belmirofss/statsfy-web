import { usePathname } from "next/navigation";

export const useHumanizedPathname = () => {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/resume": "Resume",
    "/top-tracks": "Top tracks",
    "/top-artists": "Top artists",
    "/my-account": "My account",
    "/share": "Share and download",
    "/about": "About",
  }

  return titles[pathname] || ""
};
