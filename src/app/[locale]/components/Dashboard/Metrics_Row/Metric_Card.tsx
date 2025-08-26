"use client";
import { memo } from "react";
import Image from "next/image";
import { MetricData } from "../types";

interface Metric_CardProps {
  data: MetricData;
}

const Metric_Card = memo(({ data }: Metric_CardProps) => {
  return (
    <div className="dashboard-card relative rounded-lg overflow-hidden h-16 sm:h-20 w-3/4 mx-auto">
      <div className="absolute inset-0">
        <Image
          src={data.icon}
          alt={data.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: '#006A6A', opacity: 0.3 }}></div>
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-3 sm:px-4 text-center">
        <div className="mb-1">
          <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
            {data.value}
          </span>
        </div>
        
        <div>
          <p className="text-white text-xs sm:text-sm font-medium leading-tight drop-shadow-lg">
            {data.title}
          </p>
        </div>
      </div>
    </div>
  );
});

Metric_Card.displayName = 'Metric_Card';

export default Metric_Card; 