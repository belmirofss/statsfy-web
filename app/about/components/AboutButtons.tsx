"use client";

import { Button } from "@/app/shared/components/Button";
import { BUY_ME_A_COFFEE_URL, PLAYSTORE_URL } from "@/app/shared/constants";
import { useRouter } from "next/navigation";

export const AboutButtons = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <Button type="secondary" onClick={() => router.back()}>
        Back
      </Button>
      <a href={PLAYSTORE_URL} target="_blank">
        <Button type="secondary">Download app</Button>
      </a>
      <a href={BUY_ME_A_COFFEE_URL} target="_blank">
        <Button type="secondary">Buy me a coffee</Button>
      </a>
    </div>
  );
};
