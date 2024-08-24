import { Text } from "@radix-ui/themes";
import { MAX_SCREEN_WIDTH, NOT_FOUND_IMG } from "../constants";
import { generateTruncateWhenStyles } from "../helpers/generateTruncateWhenStyles";

type Props = {
  startAt: number;
  data: unknown[];
  getTitle: (item: unknown) => string;
  getDescription?: (item: unknown) => string;
  getImage: (item: unknown) => string;
};

export const List = ({
  startAt,
  data,
  getTitle,
  getDescription,
  getImage,
}: Props) => {
  return (
    <div className="flex flex-row justify-center mt-8">
      <div
        className="flex flex-col gap-8"
        style={{
          width: MAX_SCREEN_WIDTH,
        }}
      >
        {data.map((item, index) => (
          <div
            key={getTitle(item)}
            className="flex flex-row items-center gap-4"
          >
            <Text weight="bold">{index + startAt}.</Text>
            <img
              src={getImage(item) || NOT_FOUND_IMG}
              className="rounded-full border border-black"
              style={{
                height: 72,
                width: 72,
              }}
            />
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
    </div>
  );
};
