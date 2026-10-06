// Sound bars, used wherever something is playing right now
export const EqualizerIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    aria-hidden
    className={className}
  >
    <path d="M4 10v4M9 6v12M14 9v6M19 7v10" />
  </svg>
);
