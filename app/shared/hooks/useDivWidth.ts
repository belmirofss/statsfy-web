import { useEffect, useRef, useState } from "react";

export const useDivWidth = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, []);

  return { divRef, divWidth: width };
};
