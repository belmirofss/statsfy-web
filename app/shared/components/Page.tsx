import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { getAuthSession } from "../actions/auth";

type Props = {
  children: ReactNode;
};

export const Page = async ({ children }: Props) => {
  const session = await getAuthSession();

  return (
    <div className="h-full w-full flex flex-col">
      {session && <Header />}
      <main className="p-6 pt-20 h-full flex flex-row justify-center overscroll-y-auto">
        <div className="w-full md:max-w-lg">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
