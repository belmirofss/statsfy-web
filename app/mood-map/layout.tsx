import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Spotify mood map: is your music happy or sad?",
  description:
    "See where your top Spotify songs sit between happy and sad, calm and intense, and find your vibe and your tempo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
