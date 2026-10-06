"use client";

import { LuLogOut } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button
      variant="danger"
      size="small"
      onClick={() => {
        signOut({ callbackUrl: "/", redirect: true });
      }}
    >
      <LuLogOut aria-hidden size={18} />
      Log out
    </Button>
  );
};
