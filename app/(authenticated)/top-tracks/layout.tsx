import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statsfy | Top tracks",
  description: "Tracks that you most played on Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
