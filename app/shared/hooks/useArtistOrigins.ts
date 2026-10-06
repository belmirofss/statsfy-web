import { useEffect, useState } from "react";
import { isCountryCode } from "../helpers/countries";
import { SpotifyArtist } from "../types";

const MUSICBRAINZ = "https://musicbrainz.org/ws/2";
// MusicBrainz allows about one request per second per client
const REQUEST_GAP = 1100;
const CACHE_KEY = "statsfy:artist-origins:v1";
// Artists MusicBrainz couldn't place are retried after a month
const UNKNOWN_TTL = 1000 * 60 * 60 * 24 * 30;

type CacheEntry = { country: string | null; checkedAt: number };
type Cache = Record<string, CacheEntry>;

type MusicBrainzArtist = {
  id: string;
  name: string;
  score?: number;
  country?: string | null;
  area?: { "iso-3166-1-codes"?: string[] } | null;
};

class RetryLaterError extends Error {}

const readCache = (): Cache => {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const writeCacheEntry = (id: string, entry: CacheEntry) => {
  try {
    const cache = readCache();
    cache[id] = entry;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Without storage, origins are looked up again next visit
  }
};

const isFresh = (entry: CacheEntry | undefined) =>
  !!entry && (entry.country !== null || Date.now() - entry.checkedAt < UNKNOWN_TTL);

// One request at a time for the whole page, spaced out for the rate limit
let lastRequestAt = 0;
let chain: Promise<unknown> = Promise.resolve();

const throttledFetch = (url: string) => {
  const run = async () => {
    const delay = lastRequestAt + REQUEST_GAP - Date.now();
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    lastRequestAt = Date.now();
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (response.status === 503 || response.status === 429) {
      throw new RetryLaterError();
    }
    return response;
  };
  const next = chain.then(run, run);
  chain = next.catch(() => undefined);
  return next;
};

const countryOf = (artist: MusicBrainzArtist) => {
  const code = artist.country ?? artist.area?.["iso-3166-1-codes"]?.[0] ?? null;
  return isCountryCode(code) ? code : null;
};

const lookUpCountry = async (artist: SpotifyArtist): Promise<string | null> => {
  // Best match: MusicBrainz artists linked to this exact Spotify page
  const spotifyUrl = `https://open.spotify.com/artist/${artist.id}`;
  const urlResponse = await throttledFetch(
    `${MUSICBRAINZ}/url?resource=${encodeURIComponent(spotifyUrl)}&inc=artist-rels&fmt=json`
  );

  if (urlResponse.ok) {
    const data: { relations?: { artist?: MusicBrainzArtist }[] } = await urlResponse.json();
    const linked = data.relations?.find((relation) => relation.artist)?.artist;
    if (linked) {
      const country = countryOf(linked);
      if (country) return country;

      // The link lookup doesn't include the area, the artist lookup does
      const artistResponse = await throttledFetch(`${MUSICBRAINZ}/artist/${linked.id}?fmt=json`);
      return artistResponse.ok ? countryOf(await artistResponse.json()) : null;
    }
  }

  // Otherwise search by name and only trust an exact, high-scoring match
  const query = `artist:"${artist.name.replace(/"/g, "")}"`;
  const searchResponse = await throttledFetch(
    `${MUSICBRAINZ}/artist?query=${encodeURIComponent(query)}&limit=5&fmt=json`
  );
  if (!searchResponse.ok) return null;

  const data: { artists?: MusicBrainzArtist[] } = await searchResponse.json();
  const match = data.artists?.find(
    (candidate) =>
      (candidate.score ?? 0) >= 95 && candidate.name.toLowerCase() === artist.name.toLowerCase()
  );
  return match ? countryOf(match) : null;
};

// Lookups already running, shared between components on the same page
const inFlight = new Map<string, Promise<string | null>>();

const getCountry = (artist: SpotifyArtist) => {
  let pending = inFlight.get(artist.id);
  if (!pending) {
    pending = lookUpCountry(artist)
      .then((country) => {
        writeCacheEntry(artist.id, { country, checkedAt: Date.now() });
        return country;
      })
      .finally(() => inFlight.delete(artist.id));
    inFlight.set(artist.id, pending);
  }
  return pending;
};

export type ArtistOrigins = {
  // Spotify artist id → ISO country code, or null when unknown
  countries: Map<string, string | null>;
  checked: number;
  total: number;
  done: boolean;
};

/**
 * Country of origin for each artist, from MusicBrainz. Results arrive one by
 * one (rate limit) and are cached on this device.
 */
export const useArtistOrigins = (artists: SpotifyArtist[] | undefined): ArtistOrigins => {
  const [countries, setCountries] = useState<Map<string, string | null>>(new Map());
  const ids = artists?.map(({ id }) => id).join(",") ?? "";

  useEffect(() => {
    if (!artists || artists.length === 0) return;

    let cancelled = false;
    const cache = readCache();
    const known = new Map<string, string | null>();
    artists.forEach((artist) => {
      const entry = cache[artist.id];
      if (isFresh(entry)) known.set(artist.id, entry.country);
    });
    setCountries(known);

    const run = async () => {
      for (const artist of artists) {
        if (cancelled) return;
        if (known.has(artist.id)) continue;
        try {
          const country = await getCountry(artist);
          if (cancelled) return;
          setCountries((current) => new Map(current).set(artist.id, country));
        } catch {
          // Rate limited or offline: leave it unknown for now, try again next visit
          if (cancelled) return;
          setCountries((current) => new Map(current).set(artist.id, null));
        }
      }
    };
    run();

    return () => {
      cancelled = true;
    };
    // `ids` captures the artist list; the array itself changes on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const total = artists?.length ?? 0;
  const checked = artists?.filter(({ id }) => countries.has(id)).length ?? 0;

  return { countries, checked, total, done: total > 0 && checked === total };
};
