import { MostStreamedArtist, MostStreamedTrack } from "./types";

const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

// From https://simplescraper.io/
const MOST_STREAMED_TRACKS_API =
  "https://api.simplescraper.io/v1/recipes/wzcVmuoDYiE5Jm1oMGt5/run?apikey=73YPVJZePGhWwm7cflToXXBd7EAj4Ne6";
const MOST_STREAMED_ARTISTS_API =
  "https://api.simplescraper.io/v1/recipes/QFrFWUBWofLMGwTYSM7S/run?apikey=73YPVJZePGhWwm7cflToXXBd7EAj4Ne6";

export const getMostStreamedTracks = async (): Promise<MostStreamedTrack[]> => {
  const response = await fetch(MOST_STREAMED_TRACKS_API, {
    next: {
      revalidate: ONE_DAY * 7,
    },
  });

  const data = (await response.json()) as {
    data: MostStreamedTrack[];
  };

  return data.data;
};

export const getMostStreamedArtists = async (): Promise<MostStreamedArtist[]> => {
  const response = await fetch(MOST_STREAMED_ARTISTS_API, {
    next: {
      revalidate: ONE_DAY * 7,
    },
  });

  const data = (await response.json()) as {
    data: MostStreamedArtist[];
  };

  return data.data;
};
