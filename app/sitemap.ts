import type { MetadataRoute } from "next";
import { SITE_URL } from "./shared/constants";
import { FEATURE_LIST } from "./shared/features";

// Only pages with content for logged out visitors; the overview, share and
// account pages are noindex
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...FEATURE_LIST.map((feature) => feature.href), "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
