import { Spinner } from "@radix-ui/themes";

export const Loading = () => {
  return (
    <div className="flex flex-row justify-center">
      <Spinner size="3" />;
    </div>
  );
};
