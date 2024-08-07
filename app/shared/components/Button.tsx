import { Button as RadixButton } from "@radix-ui/themes";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  type: "primary" | "secondary";
  className?: string;
};

export const Button = ({ children, onClick, type, className }: Props) => {
  const customClasses = {
    primary: "bg-main text-white",
    secondary: "bg-gray-300 text-black",
  };

  return (
    <RadixButton
      className={`w-full text-xl font-bold cursor-pointer hover:brightness-90 ${customClasses[type]} ${className}`}
      onClick={onClick}
      radius="full"
      size="4"
    >
      {children}
    </RadixButton>
  );
};
