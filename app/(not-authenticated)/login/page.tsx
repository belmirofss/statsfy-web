"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import logo from "../../../public/logo_statsfy.png";
import { Button } from "../../shared/components/Button";

export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: process.env.NEXT_PUBLIC_URL });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full">
      <Image src={logo} alt="Statsfy image" className="h-16 w-auto" />

      <div>
        <h1 className="text-2xl font-bold">
          Hello! Are you looking for your stats?
        </h1>
        <h2 className="text-xl">
          Log in with your Spotify account to see your stats
        </h2>
      </div>

      <div className="flex flex-col items-center w-full gap-2">
        <Button type="primary" onClick={handleLogin} className="md:max-w-sm">
          Log in with Spotify
        </Button>
      </div>
    </div>
  );
}
