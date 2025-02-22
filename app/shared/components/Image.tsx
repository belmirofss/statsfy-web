import * as NextImage from "next/image";
import notFoundImg from "../../../public/not_found.png";

type Props = {
  size: number;
  type: "rounded" | "semi-rounded";
  alt: string;
  url?: string;
};

export const Image = ({ url, size, alt, type }: Props) => {
  const extraClasses = {
    rounded: "rounded-full",
    "semi-rounded": "rounded-lg",
  };

  return (
    <NextImage.default
      className={`border border-black ${extraClasses[type]}`}
      src={url || notFoundImg.src}
      alt={alt}
      height={size}
      width={size}
      style={{
        height: size,
        width: size,
      }}
    />
  );
};
