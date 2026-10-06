"use client";

import { useEffect, useRef } from "react";
import { Loading } from "@/app/shared/components/Loading";
import { Lyrics } from "@/app/shared/hooks/useLyrics";

type Props = {
  lyrics: Lyrics | null | undefined;
  isLoading: boolean;
  progressMs: number;
  onSeek?: (ms: number) => void;
};

export const SyncedLyrics = ({ lyrics, isLoading, progressMs, onSeek }: Props) => {
  const containerRef = useRef<HTMLOListElement>(null);
  const lines = lyrics?.synced ?? null;

  let current = -1;
  lines?.forEach((line, index) => {
    if (progressMs >= line.time) current = index;
  });

  // Keep the current line in the middle of the lyrics box without moving the page
  useEffect(() => {
    const container = containerRef.current;
    const line = container?.children[current] as HTMLElement | undefined;
    if (!container || !line) return;
    container.scrollTo({
      top: line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2,
      behavior: "smooth",
    });
  }, [current]);

  if (isLoading) {
    return <Loading label="Looking for lyrics" />;
  }

  if (lyrics?.instrumental) {
    return <p className="py-10 text-center text-muted">This track is instrumental.</p>;
  }

  if (!lines || lines.length === 0) {
    return lyrics?.plain ? (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted">These lyrics aren&apos;t synced to the music.</p>
        <p className="max-h-[520px] overflow-y-auto whitespace-pre-line font-display text-lg font-bold leading-relaxed text-subtle">
          {lyrics.plain}
        </p>
      </div>
    ) : (
      <p className="py-10 text-center text-muted">No lyrics found for this track.</p>
    );
  }

  return (
    <ol
      ref={containerRef}
      className="no-scrollbar relative flex max-h-[520px] flex-col overflow-y-auto py-2"
    >
      {lines.map((line, index) => {
        const isCurrent = index === current;
        const className = `min-h-10 w-full py-1 text-left font-display font-bold leading-tight transition-all ${
          isCurrent
            ? "text-[22px] text-fg lg:text-[28px]"
            : index < current
              ? "text-base text-muted lg:text-xl"
              : "text-base text-subtle lg:text-xl"
        }`;

        return (
          <li key={`${line.time}-${index}`} aria-current={isCurrent ? "true" : undefined}>
            {onSeek ? (
              <button type="button" onClick={() => onSeek(line.time)} className={className}>
                {line.text}
              </button>
            ) : (
              <p className={className}>{line.text}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
};
