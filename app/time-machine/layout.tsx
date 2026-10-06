import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Time machine",
  description: "Find your music year and the decades your favourite Spotify songs come from",
  keywords: ["Spotify", "Statsfy", "Stats", "Music year", "Decades", "Time machine"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
