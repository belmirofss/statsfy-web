import { Button, Card, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import buyMeACoffeLogo from "../../../public/buy_me_a_coffee.png";
import { BUY_ME_A_COFFEE_URL } from "../constants";

const KEY = "STATSFY.BUY_ME_A_COFFEE";
const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10;

export const BuyMeACoffee = () => {
  const [visible, setVisible] = useState(false);

  const dismiss = async () => {
    setVisible(false);
    localStorage.setItem(KEY, new Date().toISOString());
  };

  const loadVisible = async () => {
    const dismissDate: string = (await localStorage.getItem(KEY)) || "";
    const diff = new Date().getTime() - new Date(dismissDate).getTime();

    setVisible(Boolean(!dismissDate || diff > TEN_DAYS_MS));
  };

  useEffect(() => {
    loadVisible();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Card variant="surface">
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={buyMeACoffeLogo}
          alt="Buy Me A Coffe image"
          className="w-auto h-20"
        />

        <div>
          <Text>
            If you&apos;ve enjoyed using this app, consider buying me a coffee
            as a token of appreciation.
          </Text>

          <div className="flex flex-row justify-end">
            <Button
              className="font-medium cursor-pointer bg-transparent text-black hover:text-red-700"
              onClick={dismiss}
            >
              No
            </Button>
            <a href={BUY_ME_A_COFFEE_URL} target="_blank">
              <Button className="font-medium cursor-pointer bg-transparent text-black hover:text-main">
                Buy me a coffee
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
