import { Metadata } from "next";
import { getAuthSession } from "../shared/actions/auth";
import { redirect } from "next/navigation";
import { Page } from "../shared/components/Page";

export const metadata: Metadata = {
  title: "Statsfy | Login",
  description: "Connect with your Spotify account",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/");
  }

  return <Page>{children}</Page>;
}
