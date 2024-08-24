import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statsfy | About",
  description: "About the Statsfy website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
