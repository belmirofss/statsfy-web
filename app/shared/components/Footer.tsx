import { Button } from "@radix-ui/themes";
import { Logo } from "./Logo";
import { BUY_ME_A_COFFEE_URL, PLAYSTORE_URL } from "../constants";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-main flex flex-row justify-center p-8 h-[176px]W">
      <div className="w-full md:max-w-lg flex flex-col-reverse md:flex-row justify-center gap-4 md:gap-0 md:justify-between items-center">
        <Logo inverse />

        <div className="flex flex-col items-center gap-2">
          <a href={PLAYSTORE_URL} target="_blank">
            <Button className="font-medium cursor-pointer bg-transparent text-white hover:text-gray-200">
              Download app
            </Button>
          </a>

          <Link href="/about">
            <Button className="font-medium cursor-pointer bg-transparent text-white hover:text-gray-200">
              About the website
            </Button>
          </Link>

          <a href={BUY_ME_A_COFFEE_URL} target="_blank">
            <Button className="font-medium cursor-pointer bg-transparent text-white hover:text-gray-200">
              Buy me a coffee
            </Button>
          </a>
        </div>
      </div>
    </footer>
  );
};
