import { useState, useEffect } from "react";

export const useDashboardTour = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("dashboard-tour-completed");
    if (!tourCompleted) {
      setIsFirstVisit(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem("dashboard-tour-completed", "true");
    setIsFirstVisit(false);
  };

  const resetTour = () => {
    localStorage.removeItem("dashboard-tour-completed");
    setIsFirstVisit(true);
  };

  return {
    isFirstVisit,
    completeTour,
    resetTour,
  };
};

