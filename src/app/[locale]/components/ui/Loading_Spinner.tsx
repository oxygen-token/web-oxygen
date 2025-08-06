import { memo } from "react";

interface Loading_Spinner_Props {
  size?: "sm" | "md" | "lg";
  color?: "white" | "teal" | "gray";
  className?: string;
}

const Loading_Spinner = memo(({ 
  size = "md", 
  color = "teal", 
  className = "" 
}: Loading_Spinner_Props) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const colorClasses = {
    white: "border-white border-t-transparent",
    teal: "border-teal-400 border-t-transparent",
    gray: "border-gray-400 border-t-transparent"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin ${className}`} />
  );
});

Loading_Spinner.displayName = 'Loading_Spinner';

export default Loading_Spinner; 