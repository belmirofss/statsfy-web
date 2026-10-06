"use client";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  fullWidth?: boolean;
  shape?: "pill" | "rounded";
};

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  label,
  fullWidth,
  shape = "pill",
}: Props<T>) => {
  const outer = shape === "pill" ? "rounded-full" : "rounded-xl";
  const inner = shape === "pill" ? "rounded-full" : "rounded-[9px]";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`flex gap-1 border border-edge bg-surface p-1 text-[13px] font-bold ${outer} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`min-h-9 whitespace-nowrap px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-main ${inner} ${
              fullWidth ? "flex-1" : ""
            } ${selected ? "bg-fg text-canvas" : "text-muted hover:text-fg"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
