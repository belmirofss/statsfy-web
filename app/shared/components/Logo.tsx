import Image from "next/image";
import logo from "../../../public/logo_statsfy.png";
import logoinverse from "../../../public/logo_statsfy_inverse.png";

type Props = {
  size?: "regular" | "small";
  inverse?: boolean;
};

export const Logo = ({ size = "regular", inverse }: Props) => {
  const customClassNames = {
    regular: "h-16",
    small: "h-8",
  };

  return (
    <Image
      src={inverse ? logoinverse : logo}
      alt="Statsfy image"
      className={`w-auto ${customClassNames[size]}`}
    />
  );
};
