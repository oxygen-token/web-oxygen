"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Vercel_Analytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

