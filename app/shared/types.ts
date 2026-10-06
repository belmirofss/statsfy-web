import { DefaultSession } from "next-auth";

interface AuthUser {
  name: string;
  email: string;
  picture?: string | null;
  image?: string | null;
  accessToken: string;
  sub: string;
  expires_at: number;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Omit<DefaultSession, "user"> {
    user: AuthUser;
  }
}

export interface AuthSession extends Omit<DefaultSession, "user"> {
  user: AuthUser;
}

export type StatsfyAuthSeesion = AuthSession | null;

export enum SpotifyModes {
  TRACKS = "tracks",
  ARTISTS = "artists",
}

export enum SpotifyTimeRanges {
  LONG = "long_term",
  MEDIUM = "medium_term",
  SHORT = "short_term",
}

export type SpotifyImage = {
  height: number;
  width: number;
  url: string;
};

export type SpotifyExternalUrls = {
  spotify?: string;
};

export type SpotifyAccount = {
  id: string;
  country: string;
  display_name: string;
  images: SpotifyImage[];
  product: "free" | "premium" | "open";
  email: string;
  external_urls?: SpotifyExternalUrls;
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  images: SpotifyImage[];
  album_type?: "album" | "single" | "compilation";
  release_date?: string;
  release_date_precision?: "year" | "month" | "day";
  total_tracks?: number;
  artists?: SpotifyArtist[];
  external_urls?: SpotifyExternalUrls;
};

export type SpotifyItemsResponse<T> = {
  items: T[];
};

// Spotify stopped returning `popularity` for Development Mode apps (Feb 2026),
// so it is optional everywhere and features must cope without it
export type SpotifyArtist = {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
  external_urls?: SpotifyExternalUrls;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms?: number;
  popularity?: number;
  external_urls?: SpotifyExternalUrls;
};

export type SpotifyHistoryTrack = {
  track: SpotifyTrack;
  played_at: string;
};

export type SpotifyDevice = {
  id: string | null;
  name: string;
  type: string;
};

export type SpotifyCurrentlyPlaying = {
  is_playing: boolean;
  progress_ms: number | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  item: SpotifyTrack | null;
  device?: SpotifyDevice;
};

export type SpotifyQueue = {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
};

export type SpotifyFollowedArtistsResponse = {
  artists: {
    items: SpotifyArtist[];
    next: string | null;
    cursors: { after: string | null };
  };
};
