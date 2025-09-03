import React from 'react';
import Certificate_Card from './Certificate_Card';

const Certificate_Example: React.FC = () => {
  return (
    <div className="p-6 bg-teal-600 min-h-screen">
      <div className="max-w-md mx-auto">
        <Certificate_Card
          certificateId="SoyCarbonoNeutral"
          area="48 M²"
          socialPlatform="instagram"
          socialText="Publica en Instagram"
          hasBorder={false}
        />
      </div>
    </div>
  );
};

export default Certificate_Example;
