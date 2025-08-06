"use client";
import { memo, ReactNode, useEffect, useState } from "react";

interface Animated_Page_Props {
  children: ReactNode;
  className?: string;
}

const Animated_Page = memo(({ children, className = "" }: Animated_Page_Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-700 ease-out ${
      isVisible 
        ? "opacity-100 transform translate-y-0 scale-100" 
        : "opacity-0 transform translate-y-8 scale-95"
    } ${className}`}>
      {children}
    </div>
  );
});

Animated_Page.displayName = 'Animated_Page';

export default Animated_Page; 