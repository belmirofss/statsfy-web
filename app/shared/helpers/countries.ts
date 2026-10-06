export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

// [ISO 3166-1 alpha-2, column, row, continent] for the tile grid world map
const TILES: [string, number, number, Continent][] = [
  ["GL", 6, 0, "North America"], ["CA", 3, 1, "North America"], ["US", 3, 2, "North America"],
  ["MX", 3, 3, "North America"], ["CU", 4, 3, "North America"], ["DO", 5, 3, "North America"],
  ["PR", 6, 3, "North America"], ["GT", 3, 4, "North America"], ["CR", 4, 4, "North America"],
  ["JM", 5, 4, "North America"],
  ["CO", 4, 5, "South America"], ["VE", 5, 5, "South America"], ["EC", 3, 6, "South America"],
  ["PE", 4, 6, "South America"], ["BR", 5, 6, "South America"], ["BO", 4, 7, "South America"],
  ["PY", 5, 7, "South America"], ["CL", 4, 8, "South America"], ["AR", 5, 8, "South America"],
  ["UY", 6, 8, "South America"],
  ["IS", 9, 0, "Europe"], ["NO", 11, 0, "Europe"], ["SE", 12, 0, "Europe"], ["FI", 13, 0, "Europe"],
  ["IE", 9, 1, "Europe"], ["GB", 10, 1, "Europe"], ["DK", 11, 1, "Europe"], ["EE", 13, 1, "Europe"],
  ["BE", 10, 2, "Europe"], ["NL", 11, 2, "Europe"], ["DE", 12, 2, "Europe"], ["PL", 13, 2, "Europe"],
  ["UA", 14, 2, "Europe"], ["FR", 10, 3, "Europe"], ["CH", 11, 3, "Europe"], ["AT", 12, 3, "Europe"],
  ["HU", 13, 3, "Europe"], ["RO", 14, 3, "Europe"], ["PT", 9, 4, "Europe"], ["ES", 10, 4, "Europe"],
  ["IT", 11, 4, "Europe"], ["HR", 12, 4, "Europe"], ["GR", 13, 4, "Europe"], ["RU", 16, 1, "Europe"],
  ["TR", 14, 4, "Asia"],
  ["MA", 9, 5, "Africa"], ["DZ", 10, 5, "Africa"], ["TN", 11, 5, "Africa"], ["LY", 12, 5, "Africa"],
  ["EG", 13, 5, "Africa"], ["SN", 9, 6, "Africa"], ["ML", 10, 6, "Africa"], ["NG", 11, 6, "Africa"],
  ["SD", 12, 6, "Africa"], ["ET", 13, 6, "Africa"], ["GH", 10, 7, "Africa"], ["CM", 11, 7, "Africa"],
  ["CD", 12, 7, "Africa"], ["KE", 13, 7, "Africa"], ["AO", 11, 8, "Africa"], ["ZM", 12, 8, "Africa"],
  ["TZ", 13, 8, "Africa"], ["ZA", 12, 9, "Africa"],
  ["KZ", 16, 2, "Asia"], ["MN", 18, 2, "Asia"], ["IR", 15, 4, "Asia"], ["PK", 16, 4, "Asia"],
  ["IL", 14, 5, "Asia"], ["SA", 15, 5, "Asia"], ["AE", 16, 5, "Asia"], ["IN", 17, 5, "Asia"],
  ["CN", 18, 3, "Asia"], ["KR", 20, 3, "Asia"], ["JP", 21, 3, "Asia"], ["TW", 20, 4, "Asia"],
  ["TH", 18, 6, "Asia"], ["VN", 19, 5, "Asia"], ["PH", 20, 5, "Asia"], ["MY", 19, 6, "Asia"],
  ["SG", 18, 7, "Asia"], ["ID", 19, 7, "Asia"],
  ["AU", 20, 9, "Oceania"], ["NZ", 22, 10, "Oceania"],
];

export const MAP_COLUMNS = 24;
export const MAP_ROWS = 11;

export type MapTile = { code: string; column: number; row: number; continent: Continent };

export const MAP_TILES: MapTile[] = TILES.map(([code, column, row, continent]) => ({
  code,
  column,
  row,
  continent,
}));

const TILE_BY_CODE = new Map(MAP_TILES.map((tile) => [tile.code, tile]));

export const getContinent = (code: string): Continent | null =>
  TILE_BY_CODE.get(code)?.continent ?? null;

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
