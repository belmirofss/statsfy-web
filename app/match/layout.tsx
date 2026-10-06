import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Taste match",
  description: "Compare your Spotify music taste with a friend",
  // Match links carry someone's top artists; keep them out of search results
  robots: { index: false, follow: false },
  // The match data lives in the hash, which the server never sees. Chat apps
  // open og:url when the preview card is tapped, so an og:url or canonical of
  // plain /match would drop the data. Leave both out so the shared link is used.
  alternates: {},
  openGraph: {
    type: "website",
    siteName: "Statsfy",
    locale: "en_US",
    title: "Taste match | Statsfy",
    description: "Compare your Spotify music taste with a friend",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
