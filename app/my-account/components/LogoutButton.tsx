"use client";

import { Button } from "@/app/shared/components/Button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button
      type="danger"
      onClick={() => {
        signOut({ callbackUrl: "/", redirect: true });
      }}
    >
      Log out
    </Button>
  );
};
