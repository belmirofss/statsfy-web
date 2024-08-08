import { Button as RadixButton } from "@radix-ui/themes";
import { Responsive } from "@radix-ui/themes/props";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  type: "primary" | "secondary" | "transparent";
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
    primary: "bg-main text-white",
    secondary: "bg-gray-300 text-black",
    transparent: "bg-transparent text-black",
  };

  const customSizeClasses = {
    regular: "text-xl",
    small: "text-m",
  };

  const sizes = {
    regular: "4",
    small: "2",
  };

  return (
    <RadixButton
      className={`w-full font-bold cursor-pointer hover:brightness-90 ${customClasses[type]} ${customSizeClasses[size]} ${className}`}
      onClick={onClick}
      radius="full"
      size={sizes[size] as Responsive<"4" | "2" | "1" | "3">}
    >
      {children}
    </RadixButton>
  );
};
