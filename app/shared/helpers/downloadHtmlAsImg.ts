import { domToPng } from "modern-screenshot";

export const downloadHtmlAsImg = async (
  element: HTMLElement,
  fileName: string
) => {
  const image = await domToPng(element, {
    backgroundColor: "white",
  });

  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = fileName;
  fakeLink.href = image;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
