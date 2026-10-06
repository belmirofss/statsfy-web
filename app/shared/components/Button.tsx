import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost" | "danger";
  size?: "small" | "regular" | "large";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
};

const VARIANTS = {
  primary: "bg-main text-on-main hover:brightness-110",
  secondary: "border border-edge text-fg hover:bg-raised",
  light: "bg-fg text-canvas hover:bg-white",
  ghost: "text-fg hover:text-white",
  danger: "border border-warn text-warn hover:bg-warn/10",
};

const SIZES = {
  small: "h-11 px-5 text-sm",
  regular: "h-12 px-6 text-[15px]",
  large: "h-14 px-7 text-[17px]",
};

export const Button = ({
  children,
  variant = "primary",
  size = "regular",
  href,
  external,
  onClick,
  disabled,
  fullWidth,
  className = "",
  ariaLabel,
}: Props) => {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-not-allowed disabled:opacity-50 ${
    VARIANTS[variant]
  } ${SIZES[size]} ${fullWidth ? "w-full min-w-0" : "shrink-0"} ${className}`;

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
