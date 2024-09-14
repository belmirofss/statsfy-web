import { Spinner } from "@radix-ui/themes";

export const Loading = () => {
  return (
    <div className="h-full flex flex-row justify-center items-center">
      <Spinner size="3" />;
    </div>
  );
};
