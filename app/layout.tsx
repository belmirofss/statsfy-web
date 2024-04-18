import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { NextAuthProvider } from "./shared/providers/NextAuthProvider";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Statsfy",
  description: "Connect with your Spotify account and see your stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className}`}>
        <NextAuthProvider>
          <main className="p-6 h-full">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
