import { Text } from "@radix-ui/themes";

export const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Text size="3" weight="bold">
        Something went wrong
      </Text>
      <Text size="3">Try again later</Text>
    </div>
  );
};
