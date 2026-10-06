import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Mainstream meter",
  description: "How mainstream or underground is your Spotify taste?",
  keywords: ["Spotify", "Statsfy", "Stats", "Mainstream", "Underground", "Popularity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
