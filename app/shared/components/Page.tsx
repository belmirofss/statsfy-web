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
    <div className="h-full w-full">
      {session && <Header />}
      <div className="pt-20 w-full h-full flex flex-col items-center overscroll-y-auto gap-4">
        <main className="p-6 w-full md:max-w-lg flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
