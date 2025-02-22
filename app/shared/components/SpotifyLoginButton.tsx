"use client";

import { Button } from "@/app/shared/components/Button";
import { signIn } from "next-auth/react";

export const SpotifyLoginButton = () => {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: `${process.env.NEXT_PUBLIC_URL}/resume` });
  };

  return (
    <Button type="primary" onClick={handleLogin} className="md:max-w-sm">
      Log in with Spotify
    </Button>
  );
};
