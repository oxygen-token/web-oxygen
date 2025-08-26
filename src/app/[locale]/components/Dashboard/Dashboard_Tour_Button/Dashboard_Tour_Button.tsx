"use client";
import { useDashboardTour } from "../../../hooks/useDashboardTour";
import { useTranslations } from "next-intl";

const Dashboard_Tour_Button = () => {
  const t = useTranslations("dashboard");
  
  const resetTour = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={resetTour}
      className="fixed bottom-4 right-4 z-50 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
      title={t("tour.restart")}
    >
      {t("tour.restart")}
    </button>
  );
};

export default Dashboard_Tour_Button;
