import { useState, useEffect } from "react";

export const useDashboardTour = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true); // SIEMPRE true
  const [shouldRestart, setShouldRestart] = useState(false);

  useEffect(() => {
    // SIEMPRE mostrar el tour
    setIsFirstVisit(true);
  }, []);

  const completeTour = () => {
    // NO marcar como completado - siempre mostrar
    // localStorage.setItem("dashboard-tour-completed", "true");
    // setIsFirstVisit(false);
    // setShouldRestart(false);
    
    // Solo resetear shouldRestart
    setShouldRestart(false);
  };

  const resetTour = () => {
    // SIEMPRE resetear el tour
    // localStorage.removeItem("dashboard-tour-completed");
    setIsFirstVisit(true);
    setShouldRestart(true);
    
    // Reset shouldRestart after a short delay to allow the tour to start
    setTimeout(() => {
      setShouldRestart(false);
    }, 100);
  };

  return {
    isFirstVisit,
    shouldRestart,
    completeTour,
    resetTour,
  };
};

