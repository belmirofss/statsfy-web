import { Button } from "@radix-ui/themes";
import { FaHouse, FaMusic, FaStar } from "react-icons/fa6";

export const BottomNavBar = () => {
  const buttons = [
    {
      label: "Resume",
      Icon: () => <FaHouse />,
    },
    {
      label: "Top tracks",
      Icon: () => <FaMusic />,
    },
    {
      label: "Top artists",
      Icon: () => <FaStar />,
    },
  ];

  return (
    <div className="px-6 py-4 flex flex-row items-center drop-shadow-lg bg-white">
      {buttons.map(({ label, Icon }) => (
        <Button key={label} className="">
          <Icon />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};
