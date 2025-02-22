import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/resume",
        "/top-tracks",
        "/top-artists",
        "/share",
        "/my-account",
        "/about",
      ],
      disallow: [],
    },
    sitemap: "https://acme.com/sitemap.xml",
  };
}
