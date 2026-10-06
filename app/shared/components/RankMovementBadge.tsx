import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import { RankMovement } from "../hooks/useRankMovement";

export const RankMovementBadge = ({ movement }: { movement: RankMovement }) => {
  if (movement.type === "new") {
    return (
      <span
        title="New entry"
        className="inline-flex items-center rounded-full bg-main/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-main ring-1 ring-inset ring-main/30"
      >
        New
      </span>
    );
  }

  if (movement.type === "same") {
    return (
      <span title="No change" className="text-[13px] font-extrabold text-muted">
        <span aria-hidden>—</span>
        <span className="sr-only">No change</span>
      </span>
    );
  }

  const up = movement.type === "up";
  const label = `${up ? "Up" : "Down"} ${movement.places}`;
  const Icon = up ? LuArrowUp : LuArrowDown;

  return (
    <span
      title={label}
      className={`inline-flex items-center gap-0.5 whitespace-nowrap text-[13px] font-extrabold ${
        up ? "text-main" : "text-warn"
      }`}
    >
      <Icon aria-hidden size={14} strokeWidth={3} />
      {movement.places}
      <span className="sr-only">{up ? " places up" : " places down"}</span>
    </span>
  );
};
