import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { NextAuthProvider } from "./shared/providers/NextAuthProvider";
import "./globals.css";
import ReactQueryProvider from "./shared/providers/QueryClientProvider";
import { PreferencesProvider } from "./shared/providers/PreferencesProvider";
import { AppDataPrefetcher } from "./shared/providers/AppDataPrefetcher";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AdSense } from "./shared/components/AdSense";
import { SITE_URL } from "./shared/constants";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Statsfy - See your Spotify stats, top tracks and top artists",
    template: "%s | Statsfy",
  },
  description:
    "See your top Spotify tracks and artists from the last 4 weeks, 6 months or all time, find your music year and how mainstream your taste is, and share it with friends.",
  alternates: {
    canonical: "./",
  },
  // Title and description are filled in from each page's own
  openGraph: {
    type: "website",
    siteName: "Statsfy",
    url: "./",
    locale: "en_US",
  },
  verification: {
    google: "foN4mwW-WqNyO7KYHx3nqmP8AZ_6Q2S3j-l-FH3xIb4",
  },
  appleWebApp: {
    capable: true,
    title: "Statsfy",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0A",
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
            <PreferencesProvider>
              <AppDataPrefetcher />
              {children}
            </PreferencesProvider>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId={process.env.G_ID || ""} />
    </html>
  );
}
