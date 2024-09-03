import notFoundImg from "../../../public/not_found.png";

type Props = {
  size: number;
  type: "rounded" | "semi-rounded";
  url?: string;
};

export const Image = ({ url, size, type }: Props) => {
  const extraClasses = {
    rounded: "rounded-full",
    "semi-rounded": "rounded-md",
  };

  return (
    <img
      src={url || notFoundImg.src}
      className={`border border-black ${extraClasses[type]}`}
      style={{
        height: size,
        width: size,
      }}
    />
  );
};
