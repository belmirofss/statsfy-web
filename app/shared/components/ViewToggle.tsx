"use client";

import { IconType } from "react-icons";

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; Icon: IconType }[];
};

export const ViewToggle = <T extends string>({
  value,
  onChange,
  options,
}: Props<T>) => (
  <div className="flex gap-0.5 rounded-xl border border-edge bg-surface p-1">
    {options.map(({ value: optionValue, label, Icon }) => {
      const selected = optionValue === value;
      return (
        <button
          key={optionValue}
          type="button"
          aria-label={label}
          aria-pressed={selected}
          onClick={() => onChange(optionValue)}
          className={`flex h-9 w-9 items-center justify-center rounded-[9px] transition ${
            selected ? "bg-edge text-fg" : "text-muted hover:text-fg"
          }`}
        >
          <Icon aria-hidden size={18} />
        </button>
      );
    })}
  </div>
);
