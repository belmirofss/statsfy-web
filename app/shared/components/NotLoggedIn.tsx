import { Card, Heading } from "@radix-ui/themes";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

export const NotLoggedIn = () => {
  return (
    <Card variant="surface">
      <div className="w-full flex flex-col items-center gap-8 p-6 ">
        <div className="flex flex-col gap-4">
          <Heading as="h1" weight="bold" size="6" align="center">
            Hey, you have not connected with your Spotify account.
          </Heading>

          <Heading as="h2" weight="regular" size="5" align="center">
            By logging in with your Spotify account, you will beautifully
            discover stats from your account. You can view your most listened
            tracks and artists across time ranges, easily share them with your
            friends and much more!
          </Heading>
        </div>

        <SpotifyLoginButton />
      </div>
    </Card>
  );
};
