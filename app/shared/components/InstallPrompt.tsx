"use client";

import { ReactNode } from "react";
import { LuChevronRight, LuDownload, LuPlusSquare, LuShare, LuX } from "react-icons/lu";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { Button } from "./Button";

const AppIcon = () => (
  <span
    aria-hidden
    className="flex h-12 w-12 shrink-0 items-end justify-center gap-1 rounded-[14px] bg-main p-[13px]"
  >
    {[10, 22, 15].map((height, index) => (
      <span key={index} className="w-1 rounded-sm bg-canvas" style={{ height }} />
    ))}
  </span>
);

export const InstallBanner = () => {
  const { method, showBanner, install, snooze, openSteps } = useInstallPrompt();

  if (!showBanner) return null;

  const ios = method === "ios";

  return (
    <aside
      aria-label="Install Statsfy"
      className="mx-2 flex flex-col gap-3.5 rounded-[20px] border border-edge bg-raised p-4 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-start gap-3.5">
        <AppIcon />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] font-bold">
            {ios ? "Add Statsfy to your Home Screen" : "Install Statsfy"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-subtle">
            Open your stats in one tap from your home screen.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => snooze()}
          className="-mr-2.5 -mt-2.5 flex h-11 w-11 shrink-0 items-center justify-center text-muted"
        >
          <LuX aria-hidden size={20} />
        </button>
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" size="small" fullWidth onClick={() => snooze()}>
          Not now
        </Button>
        {ios ? (
          <Button size="small" fullWidth onClick={() => openSteps("banner")}>
            Show me how
          </Button>
        ) : (
          <Button size="small" fullWidth onClick={install}>
            <LuDownload aria-hidden size={18} />
            Install
          </Button>
        )}
      </div>
    </aside>
  );
};

// Blue mirrors the iOS system controls the user is about to look for
const STEPS: { label: ReactNode; visual: ReactNode; color: string }[] = [
  {
    label: <>Tap <strong>Share</strong> in your browser&apos;s toolbar</>,
    visual: <LuShare size={22} />,
    color: "text-[#4DA3FF]",
  },
  {
    label: <>Scroll down and choose <strong>Add to Home Screen</strong></>,
    visual: <LuPlusSquare size={22} />,
    color: "text-fg",
  },
  {
    label: <>Tap <strong>Add</strong> in the top corner</>,
    visual: "Add",
    color: "text-[#4DA3FF]",
  },
];

export const IosInstallSheet = () => {
  const { stepsOpen, closeSteps } = useInstallPrompt();

  if (!stepsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeSteps();
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={closeSteps}
        className="flex-1 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-steps-title"
        className="flex flex-col gap-[18px] rounded-t-3xl border-t border-edge bg-surface px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-3"
      >
        <span aria-hidden className="mx-auto h-1 w-10 rounded-sm bg-edge" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-main">Install Statsfy</p>
            <h2 id="install-steps-title" className="mt-1.5 font-display text-2xl font-bold">
              Three taps and you&apos;re done
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            autoFocus
            onClick={closeSteps}
            className="-mr-2.5 -mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center text-muted"
          >
            <LuX aria-hidden size={20} />
          </button>
        </div>
        <ol className="flex flex-col gap-2.5">
          {STEPS.map((step, index) => (
            <li
              key={index}
              className="flex items-center gap-3.5 rounded-2xl border border-line bg-raised p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-edge bg-canvas font-display text-sm font-bold">
                {index + 1}
              </span>
              <span className="flex-1 text-[15px] leading-snug">{step.label}</span>
              <span
                aria-hidden
                className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-[10px] bg-canvas px-2.5 text-[15px] font-bold ${step.color}`}
              >
                {step.visual}
              </span>
            </li>
          ))}
        </ol>
        <Button fullWidth onClick={closeSteps}>
          Got it
        </Button>
      </div>
    </div>
  );
};

export const InstallMenuItem = ({ onClose }: { onClose: () => void }) => {
  const { method, install, openSteps } = useInstallPrompt();

  if (!method) return null;

  return (
    <button
      type="button"
      onClick={() => {
        onClose();
        if (method === "ios") {
          openSteps("menu");
        } else {
          void install();
        }
      }}
      className="mb-1.5 flex items-center gap-3.5 rounded-2xl border border-main bg-raised px-3.5 py-3 text-left"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main text-on-main">
        <LuDownload aria-hidden size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-fg">Install app</span>
        <span className="block text-[13px] text-soft">Add Statsfy to your home screen</span>
      </span>
      <LuChevronRight aria-hidden size={18} className="text-muted" />
    </button>
  );
};
