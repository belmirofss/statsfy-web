import { Select } from "@/app/shared/components/Select";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { Button, Theme } from "@radix-ui/themes";
import { ReactNode, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  contentLabel: string;
  title: ReactNode | string;
  children: ReactNode;
};

ReactModal.setAppElement("#app");

export const Modal = ({
  isOpen,
  onClose,
  contentLabel,
  title,
  children,
}: Props) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{}}
      contentLabel={contentLabel}
    >
      <Theme>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            {title}

            <Button
              className="cursor-pointer bg-transparent text-black hover:text-red-700"
              onClick={onClose}
            >
              <IoMdClose size={24} />
            </Button>
          </div>
          <div>{children}</div>
        </div>
      </Theme>
    </ReactModal>
  );
};
