"use client";

import { Error } from "@/app/shared/components/Error";
import { Image } from "@/app/shared/components/Image";
import { Loading } from "@/app/shared/components/Loading";
import { useSpotifyAccount } from "@/app/shared/hooks/useSpotifyAccount";
import { Text } from "@radix-ui/themes";

export const MyAccountContent = () => {
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
    <>
      <Image
        size={98}
        type="rounded"
        url={data.images?.[0]?.url}
        alt="Profile picture"
      />

      <div className="mt-4 flex flex-col">
        <Text weight="bold" align="center">
          [{data.country}] {data.display_name}
        </Text>
        <Text align="center">
          {data.email} | {data.product}
        </Text>
      </div>
    </>
  );
};
