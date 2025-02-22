import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Top artists",
  description: "Artists that you most played on Spotify",
  keywords: ["Spotify", "Statsfy", "Stats", "Statstics", "Top artists"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
