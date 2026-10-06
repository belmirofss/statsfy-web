"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type BoxProps = {
  width: number;
  height: number;
  scale: number;
  children: ReactNode;
};

/** Shows children (rendered at their real size) visually scaled. */
export const ScaledBox = ({ width, height, scale, children }: BoxProps) => (
  <div className="shrink-0" style={{ width: width * scale, height: height * scale }}>
    <div
      style={{
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {children}
    </div>
  </div>
);

type FitProps = {
  width: number;
  height: number;
  maxHeight: number;
  children: ReactNode;
};

/** Scales children down to fit the available width and a max height. */
export const FitPreview = ({ width, height, maxHeight, children }: FitProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      setScale(Math.min(1, available / width, maxHeight / height));
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [width, height, maxHeight]);

  return (
    <div ref={containerRef} className="flex w-full justify-center">
      {scale > 0 && (
        <ScaledBox width={width} height={height} scale={scale}>
          {children}
        </ScaledBox>
      )}
    </div>
  );
};
