"use client";
import { ResumeRecentlyPlayedItem } from "./ResumeRecentlyPlayedItem";
import { useSpotifyRecentlyPlayed } from "@/app/shared/hooks/useSpotifyRecentlyPlayed";
import { Loading } from "@/app/shared/components/Loading";
import { Error } from "@/app/shared/components/Error";

export const ResumeRecentlyPlayed = () => {
  const { data, isLoading, isError } = useSpotifyRecentlyPlayed();

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
    <div className="grid grid-cols-3 gap-4">
      {data.map((item) => (
        <ResumeRecentlyPlayedItem key={item.track.id} historyTrack={item} />
      ))}
    </div>
  );
};
