import { domToBlob } from "modern-screenshot";

type RenderOptions = {
  width: number;
  height: number;
  scale: number;
};

export const renderToBlob = async (
  node: HTMLElement,
  { width, height, scale }: RenderOptions
) => {
  const blob = await domToBlob(node, {
    width,
    height,
    scale,
    type: "image/png",
  });

  if (!blob) {
    throw new Error("Could not render the image");
  }

  return blob;
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.download = `${fileName}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const canCopyImages = () =>
  typeof window !== "undefined" &&
  "ClipboardItem" in window &&
  !!navigator.clipboard?.write;

export const copyBlob = (blob: Blob) =>
  navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);

export const canShareFiles = () => {
  if (typeof navigator === "undefined" || !navigator.canShare) {
    return false;
  }
  try {
    return navigator.canShare({
      files: [new File([""], "statsfy.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
};

export const shareBlobs = (images: { blob: Blob; fileName: string }[]) =>
  navigator.share({
    title: "My Spotify stats",
    files: images.map(
      ({ blob, fileName }) =>
        new File([blob], `${fileName}.png`, { type: "image/png" })
    ),
  });
