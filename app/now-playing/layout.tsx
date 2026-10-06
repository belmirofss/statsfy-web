import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Now playing",
  description: "What you're playing on Spotify right now, with synced lyrics",
  keywords: ["Spotify", "Statsfy", "Now playing", "Lyrics", "Synced lyrics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
