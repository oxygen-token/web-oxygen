"use client";
import { memo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MetricData } from "../types";

interface Metric_CardProps {
  data: MetricData;
}

const Metric_Card = memo(({ data }: Metric_CardProps) => {
  const numericValue = parseInt(data.value, 10);
  const isNumeric = !isNaN(numericValue);

  const [displayValue, setDisplayValue] = useState(isNumeric ? numericValue : 0);
  const prevValueRef = useRef(isNumeric ? numericValue : 0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isNumeric) return;

    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayValue(numericValue);
      prevValueRef.current = numericValue;
      return;
    }

    const prevValue = prevValueRef.current;
    const targetValue = numericValue;

    // Only animate if value increased
    if (targetValue <= prevValue) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const difference = targetValue - prevValue;
    const duration = 1200; // 1.2 seconds
    const steps = 40;
    const increment = difference / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(prevValue + increment * currentStep));
      }
    }, stepDuration);

    prevValueRef.current = targetValue;

    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  return (
    <div className="dashboard-card relative rounded-xl overflow-hidden h-16 sm:h-20 w-full sm:w-3/4 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/10">
      <div className="absolute inset-0">
        <Image
          src={data.icon}
          alt={data.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: '#006A6A', opacity: 0.3 }}></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-1 sm:px-4 text-center">
        <div className="mb-1">
          <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg tabular-nums">
            {isNumeric ? displayValue : data.value}
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