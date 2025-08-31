import React from 'react';
import Certificate_Card from './Certificate_Card';

interface CertificateData {
  id: string;
  certificateId: string;
  area: string;
  socialPlatform: 'instagram' | 'linkedin';
  socialText: string;
  hasBorder?: boolean;
}

interface Props {
  certificates: CertificateData[];
  className?: string;
}

const Certificate_Container: React.FC<Props> = ({ certificates, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {certificates.map((certificate) => (
        <Certificate_Card
          key={certificate.id}
          certificateId={certificate.certificateId}
          area={certificate.area}
          socialPlatform={certificate.socialPlatform}
          socialText={certificate.socialText}
          hasBorder={certificate.hasBorder}
        />
      ))}
    </div>
  );
};

export default Certificate_Container;

