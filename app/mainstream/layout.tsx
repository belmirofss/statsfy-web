import { Metadata } from "next";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "How mainstream is your Spotify taste?",
  description:
    "Measure how mainstream or underground your Spotify taste is, and see your most underground favourites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Page>{children}</Page>;
}
