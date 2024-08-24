import notFoundImg from "../../../public/not_found.png";

type Props = {
  size: number;
  url?: string;
};

export const Image = ({ url, size }: Props) => {
  return (
    <img
      src={url || notFoundImg.src}
      className="rounded-full border border-black"
      style={{
        height: size,
        width: size,
      }}
    />
  );
};
