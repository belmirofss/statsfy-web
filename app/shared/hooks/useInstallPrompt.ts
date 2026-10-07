"use client";

import { useEffect, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Device = { ios: boolean; standalone: boolean; touch: boolean };

type InstallState = {
  device: Device | null;
  deferredPrompt: BeforeInstallPromptEvent | null;
  installed: boolean;
  dismissedAt: number | null;
  stepsOpenedFrom: "banner" | "menu" | null;
};

const DISMISSED_KEY = "statsfy:install-dismissed-at";
// Safari clears site storage after 7 days without a visit, so use the same window everywhere
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

const INITIAL_STATE: InstallState = {
  device: null,
  deferredPrompt: null,
  installed: false,
  dismissedAt: null,
  stepsOpenedFrom: null,
};

// Shared across components (banner, More menu, iOS sheet) and page navigations
let state = INITIAL_STATE;
const listeners = new Set<() => void>();

const update = (changes: Partial<InstallState>) => {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const readDismissedAt = () => {
  try {
    const value = Number(window.localStorage.getItem(DISMISSED_KEY));
    return value > 0 ? value : null;
  } catch {
    return null;
  }
};

const detectDevice = (): Device => {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return { ios, standalone, touch: window.matchMedia("(pointer: coarse)").matches };
};

// Chrome fires this once per page load, possibly before React mounts. Keeping
// the event lets us open the native install dialog from our own button.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    update({ deferredPrompt: event as BeforeInstallPromptEvent });
  });
  window.addEventListener("appinstalled", () => {
    update({ deferredPrompt: null, installed: true });
  });
}

const snooze = () => {
  const now = Date.now();
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(now));
  } catch {
    // Storage can be unavailable (private mode); snooze for this session only
  }
  update({ dismissedAt: now });
};

const install = async () => {
  const { deferredPrompt } = state;
  if (!deferredPrompt) return;

  // An event can only prompt once
  update({ deferredPrompt: null });
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    update({ installed: true });
  } else {
    snooze();
  }
};

const openSteps = (from: "banner" | "menu") => update({ stepsOpenedFrom: from });

const closeSteps = () => {
  const from = state.stepsOpenedFrom;
  update({ stepsOpenedFrom: null });
  if (from === "banner") snooze();
};

export const useInstallPrompt = () => {
  const current = useSyncExternalStore(subscribe, () => state, () => INITIAL_STATE);

  useEffect(() => {
    if (!state.device) {
      update({ device: detectDevice(), dismissedAt: readDismissedAt() });
    }
  }, []);

  const { device } = current;
  // "prompt": Chrome/Edge/Samsung give us the native dialog. "ios": no install
  // API exists, so we can only explain the Share > Add to Home Screen steps.
  const method =
    !device || device.standalone || current.installed
      ? null
      : current.deferredPrompt
        ? "prompt"
        : device.ios
          ? "ios"
          : null;
  const snoozed =
    current.dismissedAt !== null && Date.now() - current.dismissedAt < SNOOZE_MS;

  return {
    method,
    showBanner: method !== null && device?.touch === true && !snoozed,
    stepsOpen: current.stepsOpenedFrom !== null,
    install,
    snooze,
    openSteps,
    closeSteps,
  };
};
