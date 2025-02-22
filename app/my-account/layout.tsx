import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | My account",
  description: "Your account on Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
