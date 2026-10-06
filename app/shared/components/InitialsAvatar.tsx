import { getInitials } from "../helpers/getInitials";

type Props = {
  name: string;
  size: number;
  imageUrl?: string;
  // Background and text color
  tone?: "you" | "friend" | "unknown";
  className?: string;
};

const TONES = {
  you: "bg-[#F4A259] text-[#2B1B0E]",
  friend: "bg-[#8E7DFF] text-[#120C2B]",
  unknown: "bg-edge text-subtle",
};

export const InitialsAvatar = ({ name, size, imageUrl, tone = "you", className = "" }: Props) => (
  <span
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold ${TONES[tone]} ${className}`}
    style={{ width: size, height: size, fontSize: size * 0.34 }}
  >
    {imageUrl ? (
      // Profile pictures can come from hosts outside the image allowlist
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
    ) : (
      getInitials(name) || "?"
    )}
  </span>
);
