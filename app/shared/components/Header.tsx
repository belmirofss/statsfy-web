"use client";

import { Text } from "@radix-ui/themes";
import { usePathname } from "next/navigation";

const getTitle = (pathname: string) => {
  if (pathname === "/resume") {
    return "Resume";
  }

  return "";
};

export const Header = () => {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="p-6">
      <Text as="span" weight="bold" size="4">
        {title}
      </Text>
    </header>
  );
};
