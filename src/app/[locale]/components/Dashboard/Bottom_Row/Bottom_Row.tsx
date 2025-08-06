"use client";
import { memo } from "react";
import Earnings_Card from "./Earnings_Card";
import Social_Sharing_Card from "./Social_Sharing_Card";
import { EarningsData, SocialSharingData } from "../types";

interface Bottom_RowProps {
  earnings: EarningsData;
  social: SocialSharingData;
}

const Bottom_Row = memo(({ earnings, social }: Bottom_RowProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 sm:gap-16 lg:gap-20">
      <div className="xl:col-span-2 flex justify-center">
        <div className="w-full max-w-4xl">
          <Earnings_Card data={earnings} />
        </div>
      </div>
      
      <div className="xl:col-span-1">
        <Social_Sharing_Card data={social} />
      </div>
    </div>
  );
});

Bottom_Row.displayName = 'Bottom_Row';

export default Bottom_Row; 