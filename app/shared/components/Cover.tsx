import Image from "next/image";
import { LuMusic } from "react-icons/lu";

type Props = {
  src?: string;
  alt: string;
  // Fixed size in px. Leave empty to fill a sized parent.
  size?: number;
  shape?: "square" | "circle";
  radius?: string;
  // Rendered width hint; raise it for images that get exported at higher scale
  sizes?: string;
  fallback?: string;
  className?: string;
  eager?: boolean;
};

export const Cover = ({
  src,
  alt,
  size,
  shape = "square",
  radius = "rounded-lg",
  sizes,
  fallback,
  className = "",
  eager,
}: Props) => {
  const shapeClass = shape === "circle" ? "rounded-full" : radius;

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-raised ${shapeClass} ${
        size ? "" : "h-full w-full"
      } ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? (size ? `${size}px` : "320px")}
          loading={eager ? "eager" : "lazy"}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center font-display font-bold text-muted"
        >
          {fallback ?? <LuMusic aria-hidden />}
        </div>
      )}
    </div>
  );
};
