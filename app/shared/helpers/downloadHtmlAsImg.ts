import html2canvas from "html2canvas";

export const downloadHtmlAsImg = async (
  element: HTMLElement,
  fileName: string
) => {
  const canvas = await html2canvas(element, {
    backgroundColor: "white",
    scale: window.devicePixelRatio || 2,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });
  const image = canvas.toDataURL("image/jpeg", 1.0);

  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = fileName;
  fakeLink.href = image;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
