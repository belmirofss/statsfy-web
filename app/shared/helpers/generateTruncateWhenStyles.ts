import { CSSProperties } from "react";

export const generateTruncateWhenStyles = (
  numberOfLines: number
): {
  display: CSSProperties["display"];
  WebkitLineClamp: CSSProperties["WebkitLineClamp"];
  WebkitBoxOrient: CSSProperties["WebkitBoxOrient"];
  overflow: CSSProperties["overflow"];
} => {
  return {
    display: "-webkit-box",
    WebkitLineClamp: numberOfLines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
};
