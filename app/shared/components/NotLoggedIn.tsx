import { Card, Heading } from "@radix-ui/themes";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

export const NotLoggedIn = () => {
  return (
    <Card variant="surface">
      <div className="w-full flex flex-col items-center gap-6 p-6 ">
        <div>
          <Heading as="h1" weight="bold" size="6" align="center">
            Hey, you have not connect with your Spotify account.
          </Heading>

          <Heading as="h2" weight="regular" size="5" align="center">
            Do you want to see your status? Connect now and see your Spotify
            stats!
          </Heading>
        </div>

        <SpotifyLoginButton />
      </div>
    </Card>
  );
};
