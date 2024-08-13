"use client";

import {
  FaHouse,
  FaMusic,
  FaPerson,
  FaStar,
  FaAlignJustify,
} from "react-icons/fa6";

import { Button as RadixButton } from "@radix-ui/themes";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { Button } from "./Button";
import { useHumanizedPathname } from "../hooks/useHumanizedPathname";

const ICON_SIZE = 18;

export const Header = () => {
  const title = useHumanizedPathname();

  const buttons = [
    {
      label: "Resume",
      Icon: () => <FaHouse size={ICON_SIZE} />,
    },
    {
      label: "Top tracks",
      Icon: () => <FaMusic size={ICON_SIZE} />,
    },
    {
      label: "Top artists",
      Icon: () => <FaStar size={ICON_SIZE} />,
    },
    {
      label: "My account",
      Icon: () => <FaPerson size={ICON_SIZE} />,
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex flex-row justify-between items-center drop-shadow-lg bg-white">
      <Text as="span" weight="bold" size="6">
        {title}
      </Text>

      <div className="flex flew-row items-center">
        {buttons.map(({ label, Icon }) => (
          <div key={label} className="hidden md:flex ">
            <Button type="menu" size="small" onClick={() => {}}>
              <Icon />
              <span>{label}</span>
            </Button>
          </div>
        ))}

        <div className="md:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <RadixButton className="cursor-pointer bg-transparent text-black hover:text-main">
                <FaAlignJustify size={ICON_SIZE} />
              </RadixButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              {buttons.map(({ label, Icon }) => (
                <DropdownMenu.Item key={label}>
                  <Icon /> {label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};
