import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Your top Spotify tracks",
  description:
    "See the 50 songs you've played most on Spotify in the last 4 weeks, 6 months or of all time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
