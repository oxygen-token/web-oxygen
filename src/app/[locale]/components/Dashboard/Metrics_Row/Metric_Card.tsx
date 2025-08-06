"use client";
import { memo } from "react";
import Image from "next/image";
import { MetricData } from "../types";

interface Metric_CardProps {
  data: MetricData;
}

const Metric_Card = memo(({ data }: Metric_CardProps) => {
  return (
    <div className="dashboard-card relative rounded-lg overflow-hidden h-20 sm:h-24">
      <div className="absolute inset-0">
        <Image
          src={data.icon}
          alt={data.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: '#006A6A', opacity: 0.3 }}></div>
      </div>
      
      <div className="relative h-full flex items-center px-3 sm:px-4">
        <div className="flex-shrink-0">
          <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            X
          </span>
        </div>
        
        <div className="flex-1 ml-2 sm:ml-3">
          <p className="text-white text-sm font-medium leading-tight drop-shadow-lg">
            {data.title}
          </p>
        </div>
      </div>
    </div>
  );
});

Metric_Card.displayName = 'Metric_Card';

export default Metric_Card; 