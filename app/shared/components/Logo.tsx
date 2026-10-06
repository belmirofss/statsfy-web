type Props = {
  size?: "regular" | "small";
  withText?: boolean;
};

const SIZES = {
  regular: { mark: "h-[34px] w-[34px] rounded-[10px] p-[9px] gap-[3px]", bar: "w-1", bars: [8, 16, 11], text: "text-[21px]" },
  small: { mark: "h-7 w-7 rounded-lg p-[7px] gap-[2px]", bar: "w-[3px]", bars: [6, 13, 9], text: "text-lg" },
};

export const Logo = ({ size = "regular", withText = true }: Props) => {
  const config = SIZES[size];

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={`flex shrink-0 items-end justify-center bg-main ${config.mark}`}
      >
        {config.bars.map((height, index) => (
          <span
            key={index}
            className={`rounded-sm bg-canvas ${config.bar}`}
            style={{ height }}
          />
        ))}
      </span>
      {withText && (
        <span className={`font-display font-bold text-fg ${config.text}`}>
          Statsfy
        </span>
      )}
    </span>
  );
};
