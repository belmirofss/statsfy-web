import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "How well do you know your Spotify taste?",
  description:
    "Guess which of your top Spotify songs you play more, or name them from their first second, then challenge a friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
