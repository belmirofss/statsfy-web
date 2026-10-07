import { GameTrack } from "../helpers/knowYourself";
import { Cover } from "./Cover";

export type ChoiceState = "open" | "right" | "wrong" | "revealed";

const STATES: Record<ChoiceState, { card: string; rank: string }> = {
  open: { card: "border-line bg-[#10120F] hover:border-edge hover:bg-raised/40", rank: "text-[#4A5046]" },
  right: { card: "border-main bg-[#14241A]", rank: "text-main" },
  wrong: { card: "border-warn bg-[#10120F]", rank: "text-warn" },
  revealed: { card: "border-line bg-[#10120F]", rank: "text-subtle" },
};

type Props = {
  track: GameTrack;
  state: ChoiceState;
  onPick: () => void;
  // Shown under the rank once revealed, like "in your top 50"
  rankNote?: string;
  size?: "large" | "compact";
};

/** One of the two songs in a higher or lower question; its rank shows once answered. */
export const SongChoice = ({ track, state, onPick, rankNote, size = "large" }: Props) => {
  const revealed = state !== "open";
  const { card, rank } = STATES[state];
  const large = size === "large";

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={revealed}
      className={`flex min-w-0 items-center border-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-default ${card} ${
        large
          ? "gap-3.5 rounded-3xl p-3 sm:flex-col sm:items-stretch sm:gap-4 sm:p-4"
          : "gap-4 rounded-[18px] p-3"
      }`}
    >
      <span
        className={`block shrink-0 overflow-hidden ${
          large ? "h-[84px] w-[84px] rounded-[14px] sm:h-[200px] sm:w-full lg:h-[240px]" : "h-16 w-16 rounded-[10px]"
        }`}
      >
        <Cover src={track.image} alt="" radius="rounded-none" sizes={large ? "300px" : "64px"} eager />
      </span>
      <span className="flex min-w-0 flex-1 items-end justify-between gap-3">
        <span className="min-w-0">
          <span
            className={`block font-display font-bold leading-[1.1] ${
              large ? "text-[17px] sm:text-[22px] lg:text-2xl" : "text-base"
            }`}
          >
            {track.name}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-muted lg:text-sm">{track.artists}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end">
          <span
            className={`font-display font-bold leading-none ${rank} ${
              large ? "text-[26px] sm:text-[30px] lg:text-[40px]" : "text-[26px]"
            }`}
          >
            {revealed ? `#${track.rank}` : "#?"}
          </span>
          {revealed && rankNote && (
            <span className="mt-1 hidden text-xs font-bold text-muted sm:block">{rankNote}</span>
          )}
        </span>
      </span>
    </button>
  );
};

export const OrBadge = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-canvas font-display text-sm font-bold text-muted ${className}`}
  >
    or
  </span>
);
