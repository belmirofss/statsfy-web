import { Metadata } from "next";
import { Header } from "../shared/components/Header";
import { getAuthSession } from "../shared/actions/auth";
import { redirect } from "next/navigation";
import { Footer } from "../shared/components/Footer";

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
      <main className="px-6 md:px-12 pb-6 pt-20 h-full flex flex-row justify-center w-full">
        <div className="w-full md:max-w-lg">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
