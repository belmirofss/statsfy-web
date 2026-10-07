import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Know yourself challenge",
  description: "Guess which of your friend's top Spotify songs they play more",
  // Challenge links carry someone's top tracks; keep them out of search results
  robots: { index: false, follow: false },
  // The challenge lives in the hash, which the server never sees. Chat apps
  // open og:url when the preview card is tapped, so leave og:url and the
  // canonical out and the shared link is used.
  alternates: {},
  openGraph: {
    type: "website",
    siteName: "Statsfy",
    locale: "en_US",
    title: "Know yourself challenge | Statsfy",
    description: "Guess which of your friend's top Spotify songs they play more",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
