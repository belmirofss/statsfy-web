"use client";

import React, { useEffect } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
};

export const AdFeed = ({ dataAdSlot }: AdBannerTypes) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.PUBLISHER_ID}
      data-ad-slot={dataAdSlot}
      data-ad-format="auto"
      data-full-width-responsive={true.toString()}
    ></ins>
  );
};
