import { COUNTRY_CENTERS, DOT_MAP_NORTH, DOT_MAP_ROWS, DOT_MAP_STEP } from "./worldMapData";

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

const CONTINENT_BY_CODE = new Map<string, Continent>();
const CENTER_BY_CODE = new Map<string, { lat: number; lon: number }>();

(Object.entries(COUNTRY_CENTERS) as [Continent, string][]).forEach(([continent, list]) =>
  list.split(", ").forEach((entry) => {
    const [code, lat, lon] = entry.split(" ");
    CONTINENT_BY_CODE.set(code, continent);
    CENTER_BY_CODE.set(code, { lat: Number(lat), lon: Number(lon) });
  })
);

export const DOT_MAP_COLUMNS = DOT_MAP_ROWS[0].length;
export const DOT_MAP_ROW_COUNT = DOT_MAP_ROWS.length;

/** Every land cell of the dot map, as grid column and row */
export const DOT_MAP_DOTS = DOT_MAP_ROWS.flatMap((line, row) =>
  Array.from(line).flatMap((cell, column) => (cell === "#" ? [{ column, row }] : []))
);

/** Where a country sits on the dot map, as fractions (0–1) of its width and height */
export const getMapPoint = (code: string) => {
  const center = CENTER_BY_CODE.get(code);
  if (!center) return null;
  return {
    x: (center.lon + 180) / 360,
    y: Math.min(Math.max((DOT_MAP_NORTH - center.lat) / (DOT_MAP_STEP * DOT_MAP_ROW_COUNT), 0), 1),
  };
};

export const getContinent = (code: string): Continent | null =>
  CONTINENT_BY_CODE.get(code) ?? null;

let displayNames: Intl.DisplayNames | null = null;

export const getCountryName = (code: string) => {
  try {
    displayNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
};

/**
 * MusicBrainz also uses pseudo-codes like XE (Europe) and XW (worldwide);
 * those don't point at a single country.
 */
export const isCountryCode = (code: string | null | undefined): code is string =>
  !!code && /^[A-Z]{2}$/.test(code) && !code.startsWith("X");
