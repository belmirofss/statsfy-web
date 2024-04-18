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
    <button
      className={`w-full text-xl font-bold p-3 rounded-full hover:brightness-90 ${customClasses[type]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
