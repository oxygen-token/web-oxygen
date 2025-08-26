"use client";
import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useTranslations } from "next-intl";

const Dashboard_Tour = () => {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("dashboard");
  const common = useTranslations("common");

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setRun(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const steps: Step[] = [
    {
      target: ".metrics-row .dashboard-card:last-child",
      content: t("tour.metrics"),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".carbon-footprint-card",
      content: t("tour.projects"),
      placement: "left",
    },
    {
      target: ".project-card:first-child",
      content: t("tour.earnings"),
      placement: "right",
    },
    {
      target: ".sidebar-navigation",
      content: t("tour.social"),
      placement: "right",
    },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleCallback}
      scrollToFirstStep={false}
      scrollOffset={0}
      disableScrolling={true}
      disableOverlayClose={true}
      disableOverlay={false}
      spotlightClicks={false}
      styles={{
        options: {
          primaryColor: "#10B981",
          backgroundColor: "#1F2937",
          textColor: "#F9FAFB",
          arrowColor: "#1F2937",
        },
        tooltip: {
          backgroundColor: "#1F2937",
          borderRadius: "8px",
          padding: "16px",
        },
        tooltipTitle: {
          color: "#F9FAFB",
          fontSize: "18px",
          fontWeight: "600",
        },
        tooltipContent: {
          color: "#D1D5DB",
          fontSize: "14px",
        },
        buttonNext: {
          backgroundColor: "#10B981",
          color: "#FFFFFF",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        buttonBack: {
          color: "#9CA3AF",
          marginRight: "8px",
        },
        buttonSkip: {
          color: "#9CA3AF",
        },
        buttonClose: {
          color: "#9CA3AF",
        },
      }}
      locale={{
        back: common("back"),
        close: common("close"),
        last: common("finish"),
        next: common("next"),
        skip: common("skip"),
      }}
    />
  );
};

export default Dashboard_Tour;
