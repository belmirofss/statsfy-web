"use client";

import {
  FaHouse,
  FaMusic,
  FaPerson,
  FaStar,
  FaBars,
  FaCirclePlus,
  FaCircleInfo,
  FaRankingStar,
} from "react-icons/fa6";
import { Button as RadixButton } from "@radix-ui/themes";
import { DropdownMenu, Text } from "@radix-ui/themes";
import Link from "next/link";
import { useHumanizedPathname } from "../hooks/useHumanizedPathname";
import { usePathname } from "next/navigation";

const ICON_SIZE = 18;

export const Header = () => {
  const title = useHumanizedPathname();
  const pathname = usePathname();

  const mainButtons = [
    {
      label: "Resume",
      Icon: () => <FaHouse size={ICON_SIZE} />,
      url: "/resume",
    },
    {
      label: "Top tracks",
      Icon: () => <FaMusic size={ICON_SIZE} />,
      url: "/top-tracks",
    },
    {
      label: "Top artists",
      Icon: () => <FaStar size={ICON_SIZE} />,
      url: "/top-artists",
    },
  ];

  const moreButtons = [
    // {
    //   label: "Spotify all time",
    //   Icon: () => <FaRankingStar size={ICON_SIZE} />,
    //   url: "/spotify-all-time",
    // },
    {
      label: "My account",
      Icon: () => <FaPerson size={ICON_SIZE} />,
      url: "/my-account",
    },
    {
      label: "About",
      Icon: () => <FaCircleInfo size={ICON_SIZE} />,
      url: "/about",
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex flex-row justify-between items-center drop-shadow-lg bg-white z-50">
      <Text as="span" weight="bold" size="6">
        {title}
      </Text>

      <div className="hidden md:flex flew-row items-center gap-6">
        {mainButtons.map(({ label, Icon, url }) => (
          <Link
            key={url}
            href={url}
            className={`flex flew-row gap-2 justify-center items-center bg-transparent text-black hover:text-main text-m font-bold ${
              pathname === url ? "text-main" : ""
            }`}
          >
            <Icon /> {label}
          </Link>
        ))}

        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger>
            <RadixButton className="px-0 cursor-pointer bg-transparent text-black hover:text-main">
              <FaCirclePlus size={ICON_SIZE} />{" "}
              <span className="text-m font-bold">More</span>
            </RadixButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            {moreButtons.map(({ label, Icon, url }) => (
              <DropdownMenu.Item key={url} asChild>
                <Link
                  key={url}
                  href={url}
                  className={`flex flew-row gap-2 justify-center items-center bg-transparent text-black hover:text-main hover:cursor-pointer text-m font-bold ${
                    pathname === url ? "text-main" : ""
                  }`}
                >
                  <Icon /> {label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <RadixButton className="cursor-pointer bg-transparent text-black hover:text-main">
              <FaBars size={ICON_SIZE} />
            </RadixButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            {mainButtons.concat(moreButtons).map(({ label, Icon, url }) => (
              <DropdownMenu.Item key={url} asChild>
                <Link
                  key={url}
                  href={url}
                  className={`flex flew-row gap-2 justify-center items-center bg-transparent text-black hover:text-main text-m font-bold ${
                    pathname === url ? "text-main" : ""
                  }`}
                >
                  <Icon /> {label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
