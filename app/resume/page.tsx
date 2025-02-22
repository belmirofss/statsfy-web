import { Button } from "@/app/shared/components/Button";
import { ResumeTopArtists } from "./components/ResumeTopArtists";
import { ResumeTopTracks } from "./components/ResumeTopTracks";
import Link from "next/link";
import { BuyMeACoffee } from "@/app/shared/components/BuyMeACoffee";
import { getAuthSession } from "../shared/actions/auth";
import { Text } from "@radix-ui/themes";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { ResumeRecentlyPlayed } from "./components/ResumeRecentlyPlayed";

export default async function Resume() {
  const session = await getAuthSession();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/share" className="w-full">
        <Button type="primary">Share</Button>
      </Link>

      {session ? (
        <>
          <div className="flex flex-col gap-2">
            <Text size="5" weight="bold">
              Top tracks
            </Text>
            <Text size="4">Last 4 weeks</Text>
            <ResumeTopTracks />
          </div>

          <div className="flex flex-col gap-2">
            <Text size="5" weight="bold">
              Top artists
            </Text>
            <Text size="4">Last 4 weeks</Text>
            <ResumeTopArtists />
          </div>

          <div className="flex flex-col gap-2">
            <Text size="5" weight="bold">
              Recently played
            </Text>
            <Text size="4">Last 4 weeks</Text>
            <ResumeRecentlyPlayed />
          </div>
        </>
      ) : (
        <NotLoggedIn />
      )}

      <BuyMeACoffee />
    </div>
  );
}
