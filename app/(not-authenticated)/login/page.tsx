"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import logo from "../../../public/logo_statsfy.png";
import { Button } from "../../shared/components/Button";
import { Heading } from "@radix-ui/themes";
import Link from "next/link";

export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: process.env.NEXT_PUBLIC_URL });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full">
      <Image src={logo} alt="Statsfy image" className="h-16 w-auto" />

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
  );
}
