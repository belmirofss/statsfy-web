"use client";

import { Button } from "@/app/shared/components/Button";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button type="secondary" onClick={() => router.back()}>
      Back
    </Button>
  );
};
