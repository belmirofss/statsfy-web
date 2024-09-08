import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statsfy | Top artists",
  description: "Artists that you most listened on Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
