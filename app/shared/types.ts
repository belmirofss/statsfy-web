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

export type SpotifyAccount = {
  id: string;
  country: string;
  display_name: string;
  images: SpotifyImage[];
  product: "free" | "premium";
  email: string;
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

export type SpotifyItemsResponse<T> = {
  items: T[];
};

export type SpotifyArtist = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
};

export type SpotifyHistoryTrack = {
  track: SpotifyTrack;
  played_at: string;
};
