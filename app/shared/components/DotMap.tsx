import { ReactNode } from "react";
import {
  DOT_MAP_COLUMNS,
  DOT_MAP_DOTS,
  DOT_MAP_ROW_COUNT,
} from "@/app/shared/helpers/countries";

type DotMapProps = {
  dotColor: string;
  /** Dot diameter as a fraction of a grid cell */
  dotSize?: number;
  /** Drawn over the land dots, positioned against the map's box */
  children?: ReactNode;
};

/** A dotted world map; place markers with getMapPoint() as children. */
export const DotMap = ({ dotColor, dotSize = 0.55, children }: DotMapProps) => (
  <div
    className="relative w-full"
    style={{ aspectRatio: `${DOT_MAP_COLUMNS} / ${DOT_MAP_ROW_COUNT}` }}
  >
    <svg
      aria-hidden
      viewBox={`0 0 ${DOT_MAP_COLUMNS} ${DOT_MAP_ROW_COUNT}`}
      className="absolute inset-0 h-full w-full"
    >
      {DOT_MAP_DOTS.map(({ column, row }) => (
        <circle
          key={`${column}-${row}`}
          cx={column + 0.5}
          cy={row + 0.5}
          r={dotSize / 2}
          fill={dotColor}
        />
      ))}
    </svg>
    {children}
  </div>
);
