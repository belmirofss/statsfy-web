"use client";

import { FaPerson } from "react-icons/fa6";
import { Text } from "@radix-ui/themes";
import { Button } from "./Button";
import { useHumanizedPathname } from "../hooks/useHumanizedPathname";

export const Header = () => {
  const title = useHumanizedPathname();

  return (
    <header className="px-6 py-4 flex flex-row justify-between items-center drop-shadow-lg bg-white">
      <Text as="span" weight="bold" size="6">
        {title}
      </Text>

      <div>
        <Button type="transparent" size="small" onClick={() => {}}>
          <FaPerson size="20" />
          <span className="hidden md:block">My account</span>
        </Button>
      </div>
    </header>
  );
};
