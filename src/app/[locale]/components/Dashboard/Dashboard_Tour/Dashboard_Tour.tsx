"use client";
import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, TooltipRenderProps } from "react-joyride";
import { useTranslations } from "next-intl";
import { useDashboardTour } from "../../../hooks/useDashboardTour";
import { useOnboarding } from "../../../hooks/useOnboarding";
import "./Dashboard_Tour.css";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

interface Dashboard_Tour_Props {
  shouldShowTour: boolean;
}

const Dashboard_Tour = ({ shouldShowTour }: Dashboard_Tour_Props) => {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const t = useTranslations("dashboard");
  const common = useTranslations("common");
  const { isFirstVisit, shouldRestart, completeTour } = useDashboardTour();
  const { updateOnboardingStep } = useOnboarding();

  useEffect(() => {
    setMounted(true);
    
    // Run tour only if shouldShowTour is true and it's the first visit or restart is requested
    if (shouldShowTour && (isFirstVisit || shouldRestart)) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, isFirstVisit, shouldRestart]);

  const steps: Step[] = [
    {
      target: ".metrics-row .dashboard-card:last-child",
      content: t("tour.metrics"),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".project-card:first-child .flex-1.space-y-1\\.5",
      content: t("tour.projects"),
      placement: isMobile ? "bottom" : "right",
      disableBeacon: isMobile,
      offset: isMobile ? 30 : 0,
    },
    {
      target: ".carbon-footprint-card",
      content: t("tour.earnings"),
      placement: isMobile ? "bottom" : "left",
      offset: isMobile ? 20 : 0,
    },
    {
      target: isMobile ? ".mobile-menu-button" : ".sidebar-navigation",
      content: t("tour.social"),
      placement: isMobile ? "bottom" : "right",
    },
  ];

  const handleCallback = async (data: CallBackProps) => {
    const { status, type, index } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      console.log("🎯 Tour terminado o saltado, marcando onboarding como completado...");
      setRun(false);
      completeTour();
      
      try {
        // Marcar onboarding como completado en el backend
        if (status === STATUS.FINISHED) {
          console.log("✅ Tour completado, marcando como 'tour_completed'");
          await updateOnboardingStep("tour_completed");
        } else if (status === STATUS.SKIPPED) {
          console.log("⏭️ Tour saltado, marcando como 'tour_skipped'");
          await updateOnboardingStep("tour_skipped");
        }
      } catch (error) {
        console.error("❌ Error al marcar onboarding como completado:", error);
      }
      
      return;
    }
    
    if (type === 'step:after' && isMobile) {
      const currentStep = steps[index];
      if (currentStep && currentStep.target) {
        const targetElement = document.querySelector(currentStep.target);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }
  };

  const CustomTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    tooltipProps,
  }: TooltipRenderProps) => {
    const currentStep = index + 1;
    const totalSteps = steps.length;
    
    return (
      <div {...tooltipProps} className="custom-tooltip">
        <div className="tooltip-content">
          {step.content}
        </div>
        <div className="tooltip-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          {skipProps && (
            <button {...skipProps} className="skip-button" style={{ flex: '0.8', minWidth: '60px', maxWidth: '80px' }}>
              {t("tour.skip")}
            </button>
          )}
          {continuous && (
            <div className="navigation-buttons">
              <button {...primaryProps} className="next-button" style={{ flex: '1.5', minWidth: '140px', maxWidth: '200px' }}>
                {t("tour.next")} ({currentStep} {t("tour.of")} {totalSteps})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Solo renderizar si está montado y debe mostrar el tour
  if (!mounted || !shouldShowTour) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleCallback}
      scrollToFirstStep={isMobile}
      scrollOffset={isMobile ? 150 : 0}
      disableScrolling={!isMobile}
      disableOverlayClose={true}
      disableOverlay={false}
      spotlightClicks={false}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          primaryColor: "#10B981",
          backgroundColor: "#1F2937",
          textColor: "#F9FAFB",
          arrowColor: "#1F2937",
          spotlightPadding: isMobile ? 8 : 16,
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
