import { Button } from "./shared/components/Button";
import { Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { Logo } from "@/app/shared/components/Logo";
import { SpotifyLoginButton } from "./shared/components/SpotifyLoginButton";
import { redirect } from "next/navigation";
import { getAuthSession } from "./shared/actions/auth";

export default async function Login() {
  const session = await getAuthSession();

  if (session) {
    redirect("/resume");
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row justify-between">
      <div className="p-6 flex flex-col justify-center items-center gap-6 h-full w-full">
        <Logo />

        <div>
          <Heading as="h1" weight="bold" size="6" align="center">
            Hello! Are you looking for your Spotify stats?
          </Heading>

          <Heading as="h2" weight="regular" size="5" align="center">
            Connect with your Spotify account and see now insights from your
            Spotify account
          </Heading>
        </div>

        <div className="flex flex-col items-center w-full gap-2">
          <SpotifyLoginButton />

          <Link href="/about" className="w-full md:max-w-sm">
            <Button type="secondary">About the website</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-main p-6 h-full w-full">
        <div className="flex flex-col w-full gap-4 max-w-lg">
          <div className="flex flex-col">
            <Heading className="text-white" weight="bold" size="5">
              See your stats
            </Heading>
            <Text className="text-white" size="4">
              Discover what tracks and artists you have been listening the most
              in the last 4 weeks, 6 months or all time. You will get surprised!
            </Text>
          </div>

          <div className="flex flex-col">
            <Heading as="h1" className="text-white" weight="bold" size="5">
              Share
            </Heading>
            <Text className="text-white" size="4">
              Share with your friends those interesting stats from your account.
              Ask them to also share their ones with you!
            </Text>
          </div>

          <div className="flex flex-col">
            <Heading as="h1" className="text-white" weight="bold" size="5">
              Safe, no data will be collected
            </Heading>
            <Text className="text-white" size="4">
              All your data is saved exclusively on your device. Statsfy will
              never save or collect any information about you or your account.
            </Text>
          </div>

          <div className="flex flex-col">
            <Heading as="h1" className="text-white" weight="bold" size="5">
              Ads, forgive me
            </Heading>
            <Text className="text-white" size="4">
              We use ads to keep the website online.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
