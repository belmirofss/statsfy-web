import { ReactNode } from "react";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Page = async ({ children }: Props) => {
  return (
    <div className="h-full w-full">
      <Header />
      <div className="p-8 pt-24 w-full h-full flex flex-col items-center overscroll-y-auto gap-4">
        <main className="w-full md:max-w-lg flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
};
