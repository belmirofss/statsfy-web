import { Text } from "@radix-ui/themes";

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

const ONE_THIRD_SCREEN_WIDTH = window.innerWidth / 3;

const SIZE_MULTIPLIER = {
  first: 1.25,
  second: 0.875,
  third: 0.875,
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
  const size = ONE_THIRD_SCREEN_WIDTH * SIZE_MULTIPLIER[position];

  return (
    <div className="flex flex-col">
      <Text>
        {POSITION_NUMBERS[position]}. {title}
      </Text>
      {description && <Text>{description}</Text>}
    </div>
  );
};

export const Podium = ({ first, second, third }: Props) => {
  return (
    <div className="flex flex-row justify-between">
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
