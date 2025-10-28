"use client";

import { ReactNode, Fragment, useMemo, useState, useEffect, useRef } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

import { LinkButton } from "../ui/Button2";

type DataItemProps = {
  number: number;
  content: ReactNode;
  isInView: boolean;
  delay: number;
};

function DataItem({ number, content, isInView, delay }: DataItemProps) {
  const format = useFormatter();
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Delay inicial diferente para cada elemento
      const startDelay = delay * 300; // 300ms entre cada elemento
      
      const timeout = setTimeout(() => {
        const duration = 2500; // 2.5 segundos total
        const steps = 80; // Más pasos para suavidad
        let currentStep = 0;
        
        // Función de easing personalizada: muy lento al inicio y al final
        const customEase = (t: number) => {
          // Más lento al inicio (0-30%)
          if (t < 0.3) {
            return 0.5 * Math.pow(t / 0.3, 3);
          }
          // Aceleración media (30-70%)
          else if (t < 0.7) {
            const localT = (t - 0.3) / 0.4;
            return 0.5 + 0.4 * (3 * localT * localT - 2 * localT * localT * localT);
          }
          // Muy lento al final (70-100%)
          else {
            const localT = (t - 0.7) / 0.3;
            return 0.9 + 0.1 * (1 - Math.pow(1 - localT, 4));
          }
        };
        
        const interval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;
          const easedProgress = customEase(progress);
          const currentValue = Math.floor(number * easedProgress);
          
          setDisplayNumber(currentValue);
          
          if (currentStep >= steps) {
            clearInterval(interval);
            setDisplayNumber(number);
          }
        }, duration / steps);
        
        return () => clearInterval(interval);
      }, startDelay);
      
      return () => clearTimeout(timeout);
    } else {
      setDisplayNumber(0);
    }
  }, [isInView, number, delay]);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <motion.strong 
        className="font-bold text-4xl/10 leading-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {format.number(displayNumber)}
      </motion.strong>
      <motion.div 
        className="flex flex-col justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-base/5 leading-tight whitespace-nowrap">{content}</p>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const layout = useTranslations("Layout");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const dataItems = useMemo(
    () => [
      {
        number: 30_000,
        content: (
          <>
            {layout("data-content-1")} {layout("data-content-11")}
          </>
        ),
      },
      {
        number: 42_000,
        content: (
          <>
            {layout("data-content-2")} {layout("data-content-21")}
          </>
        ),
      },
      {
        number: 600_000,
        content: (
          <>
            {layout("data-content-3")} {layout("data-content-31")}
          </>
        ),
      },
    ],
    [layout]
  );

  return (
    <section
      className="px-5 lg:px-20 pt-32 lg:pt-48 pb-48 text-white min-h-screen relative z-10"
      id="home"
    >
      <h1 className="text-4xl/10 lg:text-6xl/snug font-semibold">
        {layout("title")}
      </h1>

      <h3 className="mt-16 lg:mt-48 text-lg lg:text-2xl font-medium text-balance max-w-3xl">
        {layout("subtitle-1")}
        {layout("subtitle-2")}
      </h3>

      <div 
        ref={ref}
        className="mt-12 lg:mt-20 flex flex-col lg:flex-row items-center gap-8 justify-between rounded-xl bg-white/30 backdrop-blur p-9" 
        style={{justifyContent: 'space-between'}}
      >
        {dataItems.map((item, i) => (
          <Fragment key={i}>
            {i > 0 ? (
              <hr className="w-full h-1 lg:h-10 lg:w-1 rounded-full bg-white border-none" />
            ) : null}
            <DataItem {...item} isInView={isInView} delay={i} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
