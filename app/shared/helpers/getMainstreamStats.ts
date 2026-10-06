export type MainstreamTier = {
  name: string;
  range: string;
  min: number;
  description: string;
};

export const MAINSTREAM_TIERS: MainstreamTier[] = [
  {
    name: "Deep underground",
    range: "0–19",
    min: 0,
    description:
      "Most of what you play barely registers on the charts. You find music before anyone else does.",
  },
  {
    name: "Crate digger",
    range: "20–39",
    min: 20,
    description: "You know the hits, but most of your rotation lives well below the charts.",
  },
  {
    name: "Balanced",
    range: "40–59",
    min: 40,
    description: "An even mix of what everyone is playing and things only you seem to know.",
  },
  {
    name: "Chart regular",
    range: "60–79",
    min: 60,
    description: "Your rotation leans on songs that are big right now, with a few personal picks.",
  },
  {
    name: "Top 40",
    range: "80–100",
    min: 80,
    description: "If it's on the charts, it's probably in your top 50 too.",
  },
];

// Darkest to brightest green, one per tier
export const MAINSTREAM_TIER_COLORS = ["#173D24", "#1F5A33", "#1A9A4B", "#1ED760", "#A6F3C2"];

export const GEM_THRESHOLD = 35;

type Rated<T> = { item: T; popularity: number; rank: number };

export type MainstreamStats<T> = {
  score: number;
  tier: MainstreamTier;
  lowest: Rated<T>;
  highest: Rated<T>;
  gems: Rated<T>[];
  buckets: { label: string; count: number }[];
  rated: number;
};

export const getMainstreamTier = (score: number) =>
  [...MAINSTREAM_TIERS].reverse().find((tier) => score >= tier.min) ?? MAINSTREAM_TIERS[0];

/**
 * Average Spotify popularity (0-100) of a ranking. Returns null when Spotify
 * doesn't share popularity, which is the case for Development Mode apps.
 */
export const getMainstreamStats = <T extends { popularity?: number }>(
  items: T[]
): MainstreamStats<T> | null => {
  const rated = items
    .map((item, index) => ({ item, popularity: item.popularity, rank: index + 1 }))
    .filter((entry): entry is Rated<T> => typeof entry.popularity === "number");

  if (rated.length === 0) {
    return null;
  }

  const score = Math.round(
    rated.reduce((sum, entry) => sum + entry.popularity, 0) / rated.length
  );
  const byPopularity = [...rated].sort((a, b) => a.popularity - b.popularity);

  const buckets = Array.from({ length: 10 }, (_, index) => ({
    label: String(index * 10),
    count: rated.filter((entry) => Math.min(9, Math.floor(entry.popularity / 10)) === index)
      .length,
  }));

  return {
    score,
    tier: getMainstreamTier(score),
    lowest: byPopularity[0],
    highest: byPopularity[byPopularity.length - 1],
    gems: byPopularity.filter((entry) => entry.popularity < GEM_THRESHOLD).slice(0, 5),
    buckets,
    rated: rated.length,
  };
};
