import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { SPOTIFY_API_ENDPOINT } from "@/app/shared/constants";

declare module "axios" {
  interface AxiosRequestConfig {
    // Bulk or prefetch work: queued behind what the page is waiting on
    background?: boolean;
  }
}

type ScheduledConfig = InternalAxiosRequestConfig & {
  holdsSlot?: boolean;
  retries?: number;
};

// Spotify rate limits over a rolling 30 second window. Capping how many
// requests run at once keeps bursts (new releases, prefetching) from tripping it.
const MAX_ACTIVE = 6;
// Background work never takes every slot, so the page stays responsive
const MAX_BACKGROUND = 2;
const MAX_RETRIES = 2;
// A longer Retry-After means we've been limited hard; fail instead of freezing the app
const MAX_RETRY_WAIT = 30;

const queues = { foreground: [] as (() => void)[], background: [] as (() => void)[] };
let active = 0;
let activeBackground = 0;
let pausedUntil = 0;
let resumeTimer: ReturnType<typeof setTimeout> | null = null;

const dispatch = () => {
  const pause = pausedUntil - Date.now();
  if (pause > 0) {
    resumeTimer ??= setTimeout(() => {
      resumeTimer = null;
      dispatch();
    }, pause);
    return;
  }

  while (active < MAX_ACTIVE) {
    const next =
      queues.foreground.shift() ??
      (activeBackground < MAX_BACKGROUND ? queues.background.shift() : undefined);
    if (!next) return;
    next();
  }
};

const acquire = (background: boolean) =>
  new Promise<void>((resolve) => {
    queues[background ? "background" : "foreground"].push(() => {
      active += 1;
      if (background) activeBackground += 1;
      resolve();
    });
    dispatch();
  });

const release = (config: ScheduledConfig | undefined) => {
  if (!config?.holdsSlot) return;
  config.holdsSlot = false;
  active -= 1;
  if (config.background) activeBackground -= 1;
  dispatch();
};

const API = axios.create({
  baseURL: SPOTIFY_API_ENDPOINT,
});

API.interceptors.request.use(async (config: ScheduledConfig) => {
  await acquire(!!config.background);
  config.holdsSlot = true;
  return config;
});

API.interceptors.response.use(
  (response) => {
    release(response.config);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as ScheduledConfig | undefined;
    release(config);

    const retryAfter = Number(error.response?.headers["retry-after"] ?? 1);
    const retries = config?.retries ?? 0;
    if (
      !config ||
      error.response?.status !== 429 ||
      retries >= MAX_RETRIES ||
      retryAfter > MAX_RETRY_WAIT
    ) {
      throw error;
    }

    // Hold every queued request, not just this one, until Spotify lets us back in
    pausedUntil = Math.max(pausedUntil, Date.now() + retryAfter * 1000);
    return API.request({ ...config, retries: retries + 1 } as ScheduledConfig);
  }
);

export default API;
