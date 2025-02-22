import { Button as RadixButton } from "@radix-ui/themes";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type: "primary" | "secondary" | "danger" | "menu";
  size?: "regular" | "small";
  className?: string;
};

export const Button = ({
  children,
  onClick,
  type,
  className,
  size = "regular",
}: Props) => {
  const customClasses = {
    primary: "bg-main text-white hover:brightness-90",
    secondary: "bg-gray-300 text-black hover:brightness-90",
    danger: "bg-red-700 text-white hover:brightness-90",
    menu: "bg-transparent text-black hover:text-main",
  };

  const customSizeClasses = {
    regular: "text-lg",
    small: "text-m",
  };

  return (
    <RadixButton
      className={`w-full font-bold cursor-pointer py-5 ${customClasses[type]} ${customSizeClasses[size]} ${className}`}
      onClick={onClick}
      radius="full"
    >
      {children}
    </RadixButton>
  );
};
