"use client";

import { ReactNode } from "react";

export type TemplateId = "pulse" | "receipt" | "frontpage" | "chart" | "story";

const Bar = ({ width, color, height = 3 }: { width: string; color: string; height?: number }) => (
  <span className="block rounded-sm" style={{ width, height, background: color }} />
);

// Small abstract drawings of each template
const THUMBNAILS: Record<TemplateId, ReactNode> = {
  pulse: (
    <span className="flex h-full flex-col gap-1.5 bg-canvas p-2.5">
      <Bar width="40%" color="#1ED760" />
      <Bar width="70%" color="#F2F4EF" height={5} />
      {[0, 1, 2].map((row) => (
        <span key={row} className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#2B44E8]" />
          <Bar width="60%" color="#9AA196" />
        </span>
      ))}
    </span>
  ),
  receipt: (
    <span className="flex h-full items-center justify-center bg-main p-2">
      <span className="flex h-full w-[70%] flex-col gap-1 bg-white p-1.5">
        <Bar width="60%" color="#0A0A0A" height={4} />
        <Bar width="90%" color="#8C8C8C" height={2} />
        <Bar width="80%" color="#8C8C8C" height={2} />
        <Bar width="85%" color="#8C8C8C" height={2} />
        <span className="flex-1" />
        <span
          className="block h-2.5"
          style={{ background: "repeating-linear-gradient(90deg,#0A0A0A 0 1px,transparent 1px 3px)" }}
        />
      </span>
    </span>
  ),
  frontpage: (
    <span className="flex h-full flex-col gap-1 bg-white p-2.5">
      <span className="font-black leading-none text-[#0A0A0A]" style={{ fontSize: 15 }}>
        01
      </span>
      <span className="block h-6 w-full bg-[#2B44E8]" />
      <Bar width="80%" color="#0A0A0A" height={3} />
      <Bar width="55%" color="#8C8C8C" height={2} />
    </span>
  ),
  chart: (
    <span className="flex h-full flex-col gap-1.5 bg-[#0A0A0A] p-2.5">
      <Bar width="65%" color="#1ED760" height={4} />
      {[0, 1, 2, 3].map((row) => (
        <span key={row} className="flex items-center gap-1">
          <span className="text-[8px] font-black leading-none text-white">0{row + 1}</span>
          <Bar width="70%" color="#FFFFFF" height={2} />
        </span>
      ))}
    </span>
  ),
  story: (
    <span className="relative block h-full bg-[#F1EFF8]">
      <span className="absolute left-[18%] top-[14%] h-[72%] w-[34%] -rotate-6 rounded-md bg-[#5B3DF5]" />
      <span className="absolute left-[36%] top-[12%] h-[72%] w-[34%] rounded-md bg-[#C6F432]" />
      <span className="absolute left-[54%] top-[14%] h-[72%] w-[34%] rotate-6 rounded-md bg-[#111111]" />
    </span>
  ),
};

type Props = {
  templates: { id: TemplateId; name: string }[];
  value: TemplateId;
  onChange: (id: TemplateId) => void;
};

export const TemplatePicker = ({ templates, value, onChange }: Props) => (
  <div role="radiogroup" aria-label="Template" className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-3">
    {templates.map((template) => {
      const selected = template.id === value;
      return (
        <button
          key={template.id}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(template.id)}
          className="flex flex-col gap-1.5 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        >
          <span
            className={`block h-[72px] w-full overflow-hidden rounded-xl transition ${
              selected
                ? "ring-2 ring-main ring-offset-2 ring-offset-canvas"
                : "ring-1 ring-edge hover:ring-muted"
            }`}
          >
            {THUMBNAILS[template.id]}
          </span>
          <span className={`text-xs font-bold ${selected ? "text-fg" : "text-muted"}`}>
            {template.name}
          </span>
        </button>
      );
    })}
  </div>
);
