import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Share and download",
  description: "Download and share your Spotify stats",
  keywords: [
    "Spotify",
    "Statsfy",
    "Stats",
    "Statstics",
    "Top tracks",
    "Top artists",
    "Share",
    "Download",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
