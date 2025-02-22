import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Top tracks",
  description: "Tracks that you most played on Spotify",
  keywords: ["Spotify", "Statsfy", "Stats", "Statstics", "Top tracks"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
