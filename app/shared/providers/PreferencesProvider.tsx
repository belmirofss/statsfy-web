"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SpotifyTimeRanges } from "../types";

type Preferences = {
  defaultTimeRange: SpotifyTimeRanges;
  showRankMovement: boolean;
};

type PreferencesContextValue = {
  preferences: Preferences;
  updatePreferences: (changes: Partial<Preferences>) => void;
  timeRange: SpotifyTimeRanges;
  setTimeRange: (timeRange: SpotifyTimeRanges) => void;
};

const STORAGE_KEY = "statsfy:preferences";

const DEFAULT_PREFERENCES: Preferences = {
  defaultTimeRange: SpotifyTimeRanges.SHORT,
  showRankMovement: true,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const readStoredPreferences = (): Preferences => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [timeRange, setTimeRange] = useState<SpotifyTimeRanges>(
    DEFAULT_PREFERENCES.defaultTimeRange
  );

  useEffect(() => {
    const stored = readStoredPreferences();
    setPreferences(stored);
    setTimeRange(stored.defaultTimeRange);
  }, []);

  const updatePreferences = useCallback((changes: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...changes };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable (private mode); keep the in-memory value
      }
      return next;
    });
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreferences, timeRange, setTimeRange }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return context;
};
