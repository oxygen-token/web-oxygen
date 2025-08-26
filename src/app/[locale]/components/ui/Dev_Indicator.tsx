"use client";
import { useDev } from "../../context/Dev_Context";

const DevIndicator = () => {
  const { isDevMode } = useDev();

  if (!isDevMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
      🚀 DEV MODE
    </div>
  );
};

export default DevIndicator; 