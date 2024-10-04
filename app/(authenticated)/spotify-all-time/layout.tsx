import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statsfy | Global ranking all time",
  description: "Most streamed tracks and artists on Spotify all time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
