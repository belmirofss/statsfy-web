import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { NextAuthProvider } from "./shared/providers/NextAuthProvider";
import "./globals.css";
import ReactQueryProvider from "./shared/providers/QueryClientProvider";
import { PreferencesProvider } from "./shared/providers/PreferencesProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AdSense } from "./shared/components/AdSense";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Statsfy - Connect with your Spotify account and see your stats",
  description:
    "Connect with your Spotify account to see your most listened tracks and artists, and much more stats. Download and share your Spotify insights easily with frinds",
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
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <AdSense />
      </head>
      <body>
        <ReactQueryProvider>
          <NextAuthProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId={process.env.G_ID || ""} />
    </html>
  );
}
