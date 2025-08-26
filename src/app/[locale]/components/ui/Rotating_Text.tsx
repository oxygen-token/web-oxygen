"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RotatingTextProps {
  staticText?: string;
  rotatingTexts?: string[];
  mainClassName?: string;
  boxClassName?: string;
  rotationInterval?: number;
  transition?: any;
}

const Rotating_Text: React.FC<RotatingTextProps> = ({
  staticText = "Creative",
  rotatingTexts = [".na", ".dev", ".io", ".co", ".tech"],
  mainClassName = "text-white text-4xl font-bold",
  boxClassName = "bg-blue-500 text-white px-2 py-1 rounded ml-2",
  rotationInterval = 2000,
  transition = { duration: 0.5, ease: "easeInOut" },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [rotatingTexts.length, rotationInterval]);

  return (
    <div className={`${mainClassName} !flex !flex-col lg:!flex-row lg:!items-center`}>
      <span>{staticText}</span>
      <div className={`${boxClassName} !mt-2 lg:!mt-0 lg:!ml-2`}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transition}
            className="inline-block"
          >
            {rotatingTexts[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Rotating_Text;
