import { SpotifyArtist } from "../types";
import { getContinent, getCountryName } from "./countries";

export type CountryGroup = {
  code: string;
  name: string;
  artists: { artist: SpotifyArtist; rank: number }[];
};

export type CountryStats = {
  countries: CountryGroup[];
  continents: number;
  unknown: number;
};

/** Groups ranked artists by their country of origin, most artists first. */
export const getCountryStats = (
  artists: SpotifyArtist[],
  origins: Map<string, string | null>
): CountryStats => {
  const groups = new Map<string, CountryGroup>();
  let unknown = 0;

  artists.forEach((artist, index) => {
    const code = origins.get(artist.id);
    if (!code) {
      if (origins.has(artist.id)) unknown += 1;
      return;
    }
    const group = groups.get(code) ?? { code, name: getCountryName(code), artists: [] };
    group.artists.push({ artist, rank: index + 1 });
    groups.set(code, group);
  });

  const countries = Array.from(groups.values()).sort(
    (a, b) => b.artists.length - a.artists.length || a.artists[0].rank - b.artists[0].rank
  );
  const continents = new Set(
    countries.map(({ code }) => getContinent(code)).filter((continent) => continent !== null)
  );

  return { countries, continents: continents.size, unknown };
};
