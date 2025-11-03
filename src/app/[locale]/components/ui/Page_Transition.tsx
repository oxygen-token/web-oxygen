"use client";
import { memo, ReactNode } from "react";

interface Page_Transition_Props {
  children: ReactNode;
  isTransitioning: boolean;
  className?: string;
}

const Page_Transition = memo(({ 
  children, 
  isTransitioning, 
  className = "" 
}: Page_Transition_Props) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`transition-all duration-300 ease-out h-full ${
        isTransitioning 
          ? "opacity-50 transform translate-x-2" 
          : "opacity-100 transform translate-x-0"
      }`}>
        {children}
      </div>
    </div>
  );
});

Page_Transition.displayName = 'Page_Transition';

export default Page_Transition; 