import { Button, Card, Text } from "@radix-ui/themes";
import Image from "next/image";
import buyMeACoffeLogo from "../../../public/buy_me_a_coffee.png";
import { BUY_ME_A_COFFEE_URL } from "../constants";

export const BuyMeACoffee = () => {
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
