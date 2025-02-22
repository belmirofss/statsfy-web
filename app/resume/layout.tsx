import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Resume",
  description: "Resume from your Spotify account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
