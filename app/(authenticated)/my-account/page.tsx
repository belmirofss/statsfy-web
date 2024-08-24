"use client";

import { Button } from "@/app/shared/components/Button";
import { Error } from "@/app/shared/components/Error";
import { Image } from "@/app/shared/components/Image";
import { Loading } from "@/app/shared/components/Loading";
import { signOut } from "next-auth/react";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { Text } from "@radix-ui/themes";

export default function MyAccount() {
  const { data, isLoading, isError } = useSpotifyAccount();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Image size={98} url={data.images?.[0]?.url} />
      <Text weight="bold">
        [{data.country}] {data.display_name}
      </Text>
      <Text>
        {data.email} | {data.product}
      </Text>

      <div className="mt-8 flex flex-col gap-2 w-full">
        <Button type="secondary">About the website</Button>
        <Button type="danger" onClick={signOut}>
          Log out
        </Button>
      </div>
    </div>
  );
}
