"use client";
import Image from "next/image";

interface Token_Chip_Props {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
}

export default function Token_Chip({ title, value, subtitle, icon }: Token_Chip_Props) {
  return (
    <div className="bg-gradient-to-r from-teal-900/40 to-teal-800/30 backdrop-blur-sm rounded-xl px-3 flex flex-row items-center gap-3 h-[75px]">
      <div className="flex flex-col flex-1 justify-center">
        <div className="text-white font-bold text-xs mb-0.5 h-4 flex items-center">{title}</div>
        <div className="text-white text-base font-bold flex items-center leading-tight">
          {value}
          {subtitle && (
            <span className="text-white/60 text-sm font-normal ml-1">= {subtitle}</span>
          )}
        </div>
      </div>
      {icon && (
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <Image 
            src={icon} 
            alt={title} 
            width={20} 
            height={20} 
            className="w-5 h-5"
          />
        </div>
      )}
    </div>
  );
}
