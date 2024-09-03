"use client";

import { Text } from "@radix-ui/themes";
import { FaCrown } from "react-icons/fa6";
import { generateTruncateWhenStyles } from "../helpers/generateTruncateWhenStyles";
import { Image } from "./Image";

type PodiumPositionProps = {
  position: "first" | "second" | "third";
  title: string;
  description?: string;
  imageUrl?: string;
};

type Props = {
  first: Omit<PodiumPositionProps, "position">;
  second: Omit<PodiumPositionProps, "position">;
  third: Omit<PodiumPositionProps, "position">;
};

const COLORS = {
  first: "#FFBF00",
  second: "#B5B7BB",
  third: "#804A00",
};

const ICON_SIZES = {
  first: 36,
  second: 32,
  third: 32,
};

const SIZE_MULTIPLIER = {
  first: 1.25,
  second: 0.875,
  third: 0.875,
};

const MARGIN_TOP_POSITIONS = {
  first: 0,
  second: 0.7,
  third: 0.7,
};

const POSITION_NUMBERS = {
  first: 1,
  second: 2,
  third: 3,
};

const PodiumItem = ({
  position,
  title,
  description,
  imageUrl,
}: PodiumPositionProps) => {
  const size =
    Math.min(window.innerWidth / 3 - 16, 164) * SIZE_MULTIPLIER[position];

  const textWidthSize = size - 2;

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{
        marginTop: size * MARGIN_TOP_POSITIONS[position],
      }}
    >
      <FaCrown color={COLORS[position]} size={ICON_SIZES[position]} />

      <Image url={imageUrl} size={size} type="rounded" />

      <div className="flex flex-col">
        <Text
          size="3"
          weight="bold"
          align="center"
          className="px-2"
          style={{
            width: textWidthSize,
            ...generateTruncateWhenStyles(3),
          }}
        >
          {POSITION_NUMBERS[position]}. {title}
        </Text>
        {description && (
          <Text
            size="2"
            align="center"
            className="px-2"
            style={{
              width: textWidthSize,
              ...generateTruncateWhenStyles(3),
            }}
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};

export const Podium = ({ first, second, third }: Props) => {
  return (
    <div className="flex flex-row justify-center gap-2">
      <PodiumItem
        position="second"
        title={second.title}
        description={second.description}
        imageUrl={second.imageUrl}
      />
      <PodiumItem
        position="first"
        title={first.title}
        description={first.description}
        imageUrl={first.imageUrl}
      />
      <PodiumItem
        position="third"
        title={third.title}
        description={third.description}
        imageUrl={third.imageUrl}
      />
    </div>
  );
};
