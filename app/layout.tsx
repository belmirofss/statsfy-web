import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { NextAuthProvider } from "./shared/providers/NextAuthProvider";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import ReactQueryProvider from "./shared/providers/QueryClientProvider";

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
      <body className={`${openSans.className} h-full`}>
        <Theme className="h-full">
          <ReactQueryProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </ReactQueryProvider>
        </Theme>
      </body>
    </html>
  );
}
