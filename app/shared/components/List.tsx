import { Text } from "@radix-ui/themes";
import { generateTruncateWhenStyles } from "../helpers/generateTruncateWhenStyles";
import { Image } from "./Image";

type Props = {
  startAt: number;
  data: unknown[];
  getTitle: (item: unknown) => string;
  getDescription?: (item: unknown) => string;
  getImage: (item: unknown) => string | undefined;
};

export const List = ({
  startAt,
  data,
  getTitle,
  getDescription,
  getImage,
}: Props) => {
  return (
    <div className="flex flex-col gap-8 mt-8">
      {data.map((item, index) => (
        <div key={getTitle(item)} className="flex flex-row items-center gap-4">
          <Text weight="bold">{String(index + startAt).padStart(2, "0")}.</Text>
          <Image url={getImage(item)} size={72} type="rounded" />
          <div className="flex flex-col">
            <Text weight="bold" style={{ ...generateTruncateWhenStyles(2) }}>
              {getTitle(item)}
            </Text>
            {getDescription && (
              <Text style={{ ...generateTruncateWhenStyles(3) }}>
                {getDescription(item)}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
