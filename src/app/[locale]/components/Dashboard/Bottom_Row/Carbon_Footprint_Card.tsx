"use client";
import { memo } from "react";
import { CarbonFootprintData } from "../types";
import { PiThermometer, PiGlobe } from "react-icons/pi";

interface Carbon_Footprint_CardProps {
  data: CarbonFootprintData;
}

const Carbon_Footprint_Card = memo(({ data }: Carbon_Footprint_CardProps) => {
  return (
    <div 
      className="dashboard-card rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-white/20"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
          Tú huella
        </h3>
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <PiGlobe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          <div className="relative">
            <PiThermometer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="mb-3 sm:mb-4">
        <div className="text-center">
          <p className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
            {data.value}
          </p>
          <p className="text-xs text-gray-600">
            {data.unit} / {data.period}
          </p>
        </div>
      </div>
      
      <button 
        className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-semibold transition-colors bg-white border border-gray-200"
        style={{ color: '#006A6A' }}
      >
        Compensar
      </button>
    </div>
  );
});

Carbon_Footprint_Card.displayName = 'Carbon_Footprint_Card';

export default Carbon_Footprint_Card; 