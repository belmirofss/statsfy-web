import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Statsfy",
    short_name: "Statsfy",
    description: "See your top Spotify tracks, artists and listening stats.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0B0C0A",
    theme_color: "#0B0C0A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
