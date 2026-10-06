import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Recently played",
  description: "Tracks you played recently on Spotify",
  keywords: ["Spotify", "Statsfy", "Stats", "Statstics", "Recently played"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
