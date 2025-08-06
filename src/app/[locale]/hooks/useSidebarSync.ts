import { useState } from "react";

export const useSidebarSync = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return { activeIndex, setActiveIndex };
}; 