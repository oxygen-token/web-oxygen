"use client";
import { memo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PiX } from "react-icons/pi";

interface Affiliate_Success_BannerProps {
  isVisible: boolean;
  onClose: () => void;
}

const Affiliate_Success_Banner = memo(({ isVisible, onClose }: Affiliate_Success_BannerProps) => {
  const t = useTranslations("AffiliateSuccessBanner");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gradient-to-br from-teal-500 via-teal-600 to-green-600 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-center">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-2 mx-auto">
              <span className="text-white text-2xl font-bold">X</span>
              <span className="text-white text-2xl font-bold">OXYGEN</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <PiX className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="text-white space-y-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold leading-tight">
              {t("headline")}
            </h2>
            
            <div className="text-sm sm:text-base space-y-3 text-left">
              <p>{t("explanation")}</p>
              <p className="font-medium">{t("summary")}</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full bg-teal-400 hover:bg-teal-300 text-teal-900 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            {t("cta")}
          </button>
        </div>
      </div>
    </div>
  );
});

Affiliate_Success_Banner.displayName = 'Affiliate_Success_Banner';

export default Affiliate_Success_Banner;
