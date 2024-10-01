"use client";

import { signIn } from "next-auth/react";
import { Button } from "../shared/components/Button";
import { Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { Logo } from "@/app/shared/components/Logo";
import { AdFeed } from "@/app/shared/components/AdFeed";

export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: `${process.env.NEXT_PUBLIC_URL}/resume` });
  };

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="p-6 flex flex-col justify-center items-center gap-6 h-full w-full my-24">
        <Logo />

        <div>
          <Heading as="h1" weight="bold" size="6" align="center">
            Hello! Are you looking for your stats?
          </Heading>

          <Heading as="h2" weight="regular" size="4" align="center">
            Log in with your Spotify account to see your stats
          </Heading>
        </div>

        <div className="flex flex-col items-center w-full gap-2">
          <Button type="primary" onClick={handleLogin} className="md:max-w-sm">
            Log in with Spotify
          </Button>
          <Link href="/about" className="w-full md:max-w-sm">
            <Button type="secondary">About the website</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center w-full bg-main p-8">
        <div className="flex flex-col  w-full md:max-w-lg gap-4">
          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              See your stats
            </Text>
            <Text className="text-white" size="4">
              Discover what tracks you have been listening the most in the last
              4 weeks. See what is the artists that you have listened the most
              of all time. You will get surprised!
            </Text>
          </div>

          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Share now
            </Text>
            <Text className="text-white" size="4">
              Share with your friends those interesting stats from your account
              with your friends and ask them to also share their ones.
            </Text>
          </div>

          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Create playlists - soon
            </Text>
            <Text className="text-white" size="4">
              Create an amazing playlist from your personal stats and listen to
              it in the Spotify app.
            </Text>
          </div>

          <div className="flex flex-col">
            <Text className="text-white" weight="bold" size="5">
              Safe, no data will be collected
            </Text>
            <Text className="text-white" size="4">
              All your data is saved exclusively on your device. Statsfy will
              never save or collect any information about you or your account.
            </Text>
          </div>
        </div>
      </div>

      <div className="w-full">
        <AdFeed dataAdSlot="6984604616" />
      </div>
    </div>
  );
}
