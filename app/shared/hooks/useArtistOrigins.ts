import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { isCountryCode } from "../helpers/countries";
import { SpotifyArtist } from "../types";

const MUSICBRAINZ = "https://musicbrainz.org/ws/2";
// MusicBrainz allows about one request per second per client
const REQUEST_GAP = 1100;
// Spotify links resolved per URL lookup (MusicBrainz accepts up to 100)
const URL_BATCH = 50;
// Names per search; more and common names crowd each other out of the results
const NAME_BATCH = 10;
const CACHE_KEY = "statsfy:artist-origins:v1";
// Artists MusicBrainz couldn't place are retried after a month
const UNKNOWN_TTL = 1000 * 60 * 60 * 24 * 30;

type CacheEntry = { country: string | null; checkedAt: number };
type Cache = Record<string, CacheEntry>;

// Spotify artist id → ISO country code, or null when unknown
type Origins = Record<string, string | null>;

type MusicBrainzArtist = {
  id: string;
  name: string;
  country?: string | null;
};

class RetryLaterError extends Error {}

const readCache = (): Cache => {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const writeCacheEntries = (entries: Origins) => {
  try {
    const cache = readCache();
    const checkedAt = Date.now();
    Object.entries(entries).forEach(([id, country]) => {
      cache[id] = { country, checkedAt };
    });
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Without storage, origins are looked up again next visit
  }
};

const isFresh = (entry: CacheEntry | undefined): entry is CacheEntry =>
  !!entry && (entry.country !== null || Date.now() - entry.checkedAt < UNKNOWN_TTL);

const readCachedOrigins = (artists: SpotifyArtist[]) => {
  const cache = readCache();
  const known: Origins = {};
  artists.forEach(({ id }) => {
    const entry = cache[id];
    if (isFresh(entry)) known[id] = entry.country;
  });
  return known;
};

// One request at a time for the whole app, spaced out for the rate limit
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
    if (!response.ok) throw new Error(`MusicBrainz answered ${response.status}`);
    return response.json();
  };
  const next = chain.then(run, run);
  chain = next.catch(() => undefined);
  return next;
};

const countryOf = (artist: MusicBrainzArtist | undefined) => {
  const code = artist?.country ?? null;
  return isCountryCode(code) ? code : null;
};

const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  );

const spotifyUrl = (id: string) => `https://open.spotify.com/artist/${id}`;

/**
 * Best match: MusicBrainz artists linked to these exact Spotify pages, many per
 * request. Returns the artists that have no link, to be searched by name.
 */
const lookUpByLink = async (artists: SpotifyArtist[], found: Origins) => {
  const resources = artists
    .map(({ id }) => `resource=${encodeURIComponent(spotifyUrl(id))}`)
    .join("&");
  const data: {
    urls?: { resource: string; relations?: { artist?: MusicBrainzArtist }[] }[];
  } = await throttledFetch(`${MUSICBRAINZ}/url?${resources}&inc=artist-rels&fmt=json`);

  const linked = new Map(
    data.urls?.map((url) => [url.resource, url.relations?.find((relation) => relation.artist)?.artist])
  );

  return artists.filter((artist) => {
    const match = linked.get(spotifyUrl(artist.id));
    if (match) found[artist.id] = countryOf(match);
    return !match;
  });
};

/** Otherwise search by name and only trust an exact match, the best ranked one. */
const lookUpByName = async (artists: SpotifyArtist[], found: Origins) => {
  const query = artists
    .map(({ name }) => `artist:"${name.replace(/["\\]/g, "")}"`)
    .join(" OR ");
  const data: { artists?: MusicBrainzArtist[] } = await throttledFetch(
    `${MUSICBRAINZ}/artist?query=${encodeURIComponent(query)}&limit=100&fmt=json`
  );

  artists.forEach((artist) => {
    const name = artist.name.toLowerCase();
    found[artist.id] = countryOf(
      data.artists?.find((candidate) => candidate.name.toLowerCase() === name)
    );
  });
};

const lookUpOrigins = async (artists: SpotifyArtist[]): Promise<Origins> => {
  const known = readCachedOrigins(artists);
  const missing = artists.filter(({ id }) => !(id in known));
  const found: Origins = {};

  const unlinked: SpotifyArtist[] = [];
  for (const batch of chunk(missing, URL_BATCH)) {
    // A failed batch stays unknown for now and is tried again next visit
    unlinked.push(...(await lookUpByLink(batch, found).catch(() => [])));
  }
  for (const batch of chunk(unlinked, NAME_BATCH)) {
    await lookUpByName(batch, found).catch(() => undefined);
  }

  writeCacheEntries(found);
  const origins: Origins = { ...known, ...found };
  missing.forEach(({ id }) => {
    if (!(id in origins)) origins[id] = null;
  });
  return origins;
};

// One lookup at a time: lists overlap (time ranges share artists), so each one
// starts from what the previous lookup already cached
let lookups: Promise<unknown> = Promise.resolve();

const queueLookup = (artists: SpotifyArtist[]) => {
  const next = lookups.then(() => lookUpOrigins(artists));
  lookups = next.catch(() => undefined);
  return next;
};

export const artistOriginsQuery = (artists: SpotifyArtist[]) =>
  queryOptions({
    queryKey: ["ARTIST_ORIGINS", artists.map(({ id }) => id).join(",")],
    queryFn: () => queueLookup(artists),
    // Cached on this device; a failed lookup is retried on the next visit
    staleTime: Infinity,
    retry: false,
  });

export type ArtistOrigins = {
  // Spotify artist id → ISO country code, or null when unknown
  countries: Map<string, string | null>;
  done: boolean;
};

/**
 * Country of origin for each artist, from MusicBrainz, cached on this device.
 * Batched (one request covers 50 artists), so a full lookup takes a few seconds.
 */
export const useArtistOrigins = (artists: SpotifyArtist[] | undefined): ArtistOrigins => {
  const list = artists ?? [];
  const query = useQuery({
    ...artistOriginsQuery(list),
    // Everything already cached: show it on the first render, no lookup
    initialData: () => {
      if (list.length === 0) return undefined;
      const known = readCachedOrigins(list);
      return Object.keys(known).length === list.length ? known : undefined;
    },
    enabled: list.length > 0,
  });

  const countries = useMemo(() => new Map(Object.entries(query.data ?? {})), [query.data]);

  return { countries, done: !!query.data };
};
