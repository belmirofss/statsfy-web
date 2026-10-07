type Props = {
  total: number;
  // Right or wrong for each round answered so far
  results: boolean[];
  current: number;
};

export const RoundProgress = ({ total, results, current }: Props) => (
  <div aria-hidden className="flex w-full gap-1.5">
    {Array.from({ length: total }, (_, index) => (
      <span
        key={index}
        className={`h-1.5 flex-1 rounded-full ${
          index < results.length
            ? results[index]
              ? "bg-main"
              : "bg-warn"
            : index === current
              ? "bg-fg"
              : "bg-edge"
        }`}
      />
    ))}
  </div>
);
