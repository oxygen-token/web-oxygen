"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Vercel_Analytics() {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return null;
  }
  
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}



