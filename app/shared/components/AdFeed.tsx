"use client";

import React, { useEffect, useState } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
};

export const AdFeed = ({ dataAdSlot }: AdBannerTypes) => {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      setShouldHide(true);
      console.log(error.message);
    }
  }, []);

  if (shouldHide) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.PUBLISHER_ID}
      data-ad-slot={dataAdSlot}
      data-ad-format="auto"
      data-full-width-responsive={true.toString()}
    />
  );
};
