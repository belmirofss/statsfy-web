import { NOT_FOUND_IMG } from "../constants";

type Props = {
  size: number;
  url?: string;
};

export const Image = ({ url, size }: Props) => {
  return (
    <img
      src={url || NOT_FOUND_IMG}
      className="rounded-full border border-black"
      style={{
        height: size,
        width: size,
      }}
    />
  );
};
