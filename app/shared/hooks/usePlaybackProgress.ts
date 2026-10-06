import { useEffect, useState } from "react";

/**
 * Advances the progress Spotify reported at `updatedAt` while the track plays,
 * so the bar moves smoothly between polls.
 */
export const usePlaybackProgress = ({
  progressMs,
  durationMs,
  isPlaying,
  updatedAt,
}: {
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  updatedAt: number;
}) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const elapsed = isPlaying ? Math.max(0, now - updatedAt) : 0;
  return Math.min(durationMs, progressMs + elapsed);
};

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
