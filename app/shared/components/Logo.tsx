import Image from "next/image";
import logo from "../../../public/logo_statsfy.png";

export const Logo = () => {
  return <Image src={logo} alt="Statsfy image" className="h-16 w-auto" />;
};
