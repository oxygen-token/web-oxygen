import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
  certificateId: string;
  area: string;
}

const Certificate_SubCard: React.FC<{ 
  certificateId: string;
  area: string; 
  socialPlatform: 'instagram' | 'linkedin' 
}> = ({ 
  certificateId,
  area, 
  socialPlatform 
}) => {
  const t = useTranslations("Dashboard");
  const getSocialIcon = () => {
    switch (socialPlatform) {
      case 'instagram':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getSocialText = () => {
    switch (socialPlatform) {
      case 'instagram':
        return t("social.instagramAction");
      case 'linkedin':
        return t("social.linkedinAction");
      default:
        return '';
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden h-16 sm:h-20">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/forestHD.jpg"
          alt="Certificate Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: '#1a4d2e', opacity: 0.7 }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-green-800 to-green-600 opacity-60"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
            <Image
              src="/assets/images/logo_O.svg"
              alt="Certificate Icon"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <div>
            <p className="text-green-300 text-xs font-medium" style={{ color: 'white' }}>#{certificateId}</p>
            <p className="text-white text-base font-semibold">X M²</p>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-1.5 hover:bg-opacity-20 transition-all duration-200">
          <span className="text-white">
            {getSocialIcon()}
          </span>
          <span className="text-white font-medium text-xs">{getSocialText()}</span>
        </button>
      </div>
    </div>
  );
};

const Certificate_Card: React.FC<Props> = ({
  certificateId,
  area
}) => {
  const t = useTranslations("Dashboard");
  return (
    <div className="relative rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-white font-bold text-sm mb-1" style={{ color: 'white !important' }}>#{certificateId}</h3>
        <p className="text-white text-xs" style={{ color: 'white !important' }}>
          {t("sections.shareCertificate")}
        </p>
      </div>
      
      <div className="space-y-3">
        <Certificate_SubCard certificateId={certificateId} area={area} socialPlatform="instagram" />
        <Certificate_SubCard certificateId={certificateId} area={area} socialPlatform="linkedin" />
      </div>
    </div>
  );
};

export default Certificate_Card;
