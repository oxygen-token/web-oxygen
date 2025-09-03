"use client";
import { memo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CarbonFootprintData } from "../types";

interface Carbon_Footprint_CardProps {
  data: CarbonFootprintData;
}

const Carbon_Footprint_Card = memo(({ data }: Carbon_Footprint_CardProps) => {
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const handleCalculateClick = () => {
    router.push('/calculadora');
  };

  return (
    <div 
      className="carbon-footprint-card dashboard-card rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-white/20 h-44 w-full flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="grid grid-cols-2 h-full gap-0">
        {/* Columna Izquierda - Información + Texto */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
              {t("sections.yourFootprint")}
            </h3>
            <div className="flex items-baseline space-x-1">
              <p className="text-xl sm:text-2xl font-bold text-white">
                0,00
              </p>
              <p className="text-sm text-white/80">
                {data.unit} / {data.period}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleCalculateClick}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 text-white cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0f766e 100%)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(13, 148, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {t("sections.calculateFootprint")}
          </button>
        </div>
        
        {/* Columna Derecha - Logo */}
        <div className="flex items-center justify-center m-0 p-0 w-full h-full">
          <Image
            src="/assets/images/mundo.png"
            alt="Mundo"
            width={120}
            height={120}
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 m-0 p-0"
            style={{ margin: 0, padding: 0, display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
});

Carbon_Footprint_Card.displayName = 'Carbon_Footprint_Card';

export default Carbon_Footprint_Card; 