import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Spotify now playing with synced lyrics",
  description:
    "Follow along with synced lyrics for the song you're playing on Spotify, and see your history with it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
