"use client";

import React from "react";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
  }

const Star_Border = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  disabled,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  return (
    <Component 
      className={`relative inline-block rounded-[20px] transition-all duration-300 hover:scale-105 hover:shadow-lg ${className} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : 'cursor-pointer'}`} 
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style,
      }}
    >
      <div className={`relative z-1 border text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px] transition-all duration-300 ${
        disabled 
          ? 'bg-gray-600 border-gray-500 text-gray-300' 
          : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
      }`}>
        {children}
      </div>
    </Component>
  );
};

export default Star_Border;
