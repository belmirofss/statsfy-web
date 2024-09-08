import Image from "next/image";
import logo from "../../../public/logo_statsfy.png";

type Props = {
  size?: "regular" | "small";
};

export const Logo = ({ size = "regular" }: Props) => {
  const customClassNames = {
    regular: "h-16",
    small: "h-8",
  };

  return (
    <Image
      src={logo}
      alt="Statsfy image"
      className={`w-auto ${customClassNames[size]}`}
    />
  );
};
