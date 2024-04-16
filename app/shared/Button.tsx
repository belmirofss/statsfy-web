import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Button = ({ children }: Props) => {
  return <button className="w-full text-xl font-bold p-4">{children}</button>;
};
