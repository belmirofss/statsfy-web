import { usePathname } from "next/navigation";

export const useHumanizedPathname = () => {
  const pathname = usePathname();

  if (pathname === "/resume") {
    return "Resume";
  }

  return "";
};
