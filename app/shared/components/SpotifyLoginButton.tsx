"use client";

import { Button } from "@/app/shared/components/Button";
import { signIn } from "next-auth/react";
import { ComponentProps } from "react";

type Props = Pick<
  ComponentProps<typeof Button>,
  "variant" | "size" | "fullWidth" | "className"
> & {
  label?: string;
  withIcon?: boolean;
  // Path to land on after logging in
  callbackPath?: string;
};

const SoundIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M4 9v6M8 6v12M12 9v6M16 4v16M20 9v6" />
  </svg>
);

export const SpotifyLoginButton = ({
  label = "Continue with Spotify",
  withIcon = true,
  variant = "primary",
  size = "large",
  callbackPath = "/resume",
  ...rest
}: Props) => {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: `${process.env.NEXT_PUBLIC_URL}${callbackPath}` });
  };

  return (
    <Button variant={variant} size={size} onClick={handleLogin} {...rest}>
      {withIcon && <SoundIcon />}
      {label}
    </Button>
  );
};
