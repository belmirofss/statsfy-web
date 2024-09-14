import Script from "next/script";

export const AdSense = () => {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
