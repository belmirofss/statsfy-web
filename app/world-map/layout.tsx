import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | World map",
  description: "See which countries your favourite Spotify artists come from",
  keywords: ["Spotify", "Statsfy", "Stats", "World map", "Countries", "Top artists"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
