import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statsfy | Login",
  description: "Connect with your Spotify account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
