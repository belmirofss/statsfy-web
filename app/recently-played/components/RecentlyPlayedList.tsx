"use client";

import { LuArrowUpRight } from "react-icons/lu";
import { Cover } from "@/app/shared/components/Cover";
import { Error } from "@/app/shared/components/Error";
import { Loading } from "@/app/shared/components/Loading";
import { PageHeader } from "@/app/shared/components/PageHeader";
import { calculateTimestampDiffToNow } from "@/app/shared/helpers/calculateTimestampDiffToNow";
import { formatArtistsToArtistNames } from "@/app/shared/helpers/formatArtistsToArtistNames";
import { useSpotifyRecentlyPlayed } from "@/app/shared/hooks/useSpotifyRecentlyPlayed";

export const RecentlyPlayedList = () => {
  const { data, isLoading, isError } = useSpotifyRecentlyPlayed();

  return (
    <div>
      <PageHeader
        title="Recently played"
        subtitle="Your last 50 plays on Spotify."
      />

      {isLoading && <Loading />}
      {isError && <Error />}

      {data && data.length === 0 && (
        <p className="card p-8 text-center text-muted">
          Nothing played recently. Put something on!
        </p>
      )}

      {data && data.length > 0 && (
        <ul className="md:card md:px-5 md:py-2">
          {data.map((item) => (
            <li
              key={item.played_at}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_90px_48px] md:gap-4 md:border-b md:border-[#1C1F1A] md:py-2.5 md:last:border-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Cover src={item.track.album.images[0]?.url} alt="" size={44} />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{item.track.name}</p>
                  <p className="truncate text-[13px] text-muted">
                    {formatArtistsToArtistNames(item.track.artists)}
                  </p>
                </div>
              </div>
              <span className="hidden truncate text-sm text-muted md:block">
                {item.track.album.name}
              </span>
              <time
                dateTime={item.played_at}
                title={new Date(item.played_at).toLocaleString()}
                className="whitespace-nowrap text-xs text-muted md:text-sm"
              >
                {calculateTimestampDiffToNow(item.played_at)} ago
              </time>
              {item.track.external_urls?.spotify ? (
                <a
                  href={item.track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${item.track.name} in Spotify`}
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-edge text-subtle hover:text-white md:flex"
                >
                  <LuArrowUpRight aria-hidden size={16} />
                </a>
              ) : (
                <span className="hidden md:block" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
