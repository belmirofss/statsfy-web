import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { NextAuthProvider } from "./shared/providers/NextAuthProvider";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import ReactQueryProvider from "./shared/providers/QueryClientProvider";
import { AdSense } from "./shared/components/AdSense";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Statsfy",
  description: "Connect with your Spotify account and see your stats",
  keywords: [
    "Spotify",
    "Statsfy",
    "Stats",
    "Statstics",
    "Top",
    "Top tracks",
    "Top artists",
    "Share",
    "Download",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense />
      </head>
      <body className={`${openSans.className} h-full`}>
        <Theme className="h-full">
          <ReactQueryProvider>
            <NextAuthProvider>
              <main className="h-full">{children}</main>
            </NextAuthProvider>
          </ReactQueryProvider>
        </Theme>
      </body>
    </html>
  );
}
