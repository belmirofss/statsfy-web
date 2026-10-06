import { ReactNode } from "react";
import { MobileTabBar, MobileTopBar, Sidebar } from "./Navigation";

type Props = {
  children: ReactNode;
};

export const Page = ({ children }: Props) => {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-48 pt-3 lg:px-10 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
};
