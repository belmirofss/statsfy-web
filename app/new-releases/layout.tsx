import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | New releases",
  description: "New albums and singles from the Spotify artists you play and follow",
  keywords: ["Spotify", "Statsfy", "New releases", "Release radar", "Albums", "Singles"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
