import { Metadata } from "next";
import { Header } from "../shared/components/Header";
import { getAuthSession } from "../shared/actions/auth";
import { redirect } from "next/navigation";

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
    redirect("/login");
  }

  return (
    <div>
      <Header />
      <main className="px-6 md:px-12 pb-6 pt-20 h-full">{children}</main>
    </div>
  );
}
