type Props = {
  startAt: number;
  data: unknown[];
  getTitle: (item: unknown) => string;
  getDescription?: (item: unknown) => string;
  getImage?: (item: unknown) => string;
};

export const List = ({
  startAt,
  data,
  getTitle,
  getDescription,
  getImage,
}: Props) => {
  return <div className="flex flex-row"></div>;
};
