"use client";
import { memo } from "react";
import { SocialSharingData } from "../types";
import Certificate_Card from "../Certificate/Certificate_Card";

interface Social_Sharing_CardProps {
  data: SocialSharingData;
}

const Social_Sharing_Card = memo(({ data }: Social_Sharing_CardProps) => {
  return (
    <Certificate_Card
      certificateId="SoyCarbonoNeutral"
      area={data.certificateValue}
      socialPlatform="instagram"
      socialText="Publica en Instagram"
      hasBorder={false}
    />
  );
});

Social_Sharing_Card.displayName = 'Social_Sharing_Card';

export default Social_Sharing_Card; 