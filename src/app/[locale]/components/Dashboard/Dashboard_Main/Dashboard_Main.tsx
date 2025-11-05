"use client";
import { memo, useState, useEffect } from "react";
import Metrics_Row from "../Metrics_Row/Metrics_Row";
import Projects_Row from "../Projects_Row/Projects_Row";
import Bottom_Row from "../Bottom_Row/Bottom_Row";
import Dashboard_Tour from "../Dashboard_Tour/Dashboard_Tour";
import Dashboard_Tour_Button from "../Dashboard_Tour_Button/Dashboard_Tour_Button";

import Affiliate_Reward_Modal from "../../Affiliate_Reward_Modal/Affiliate_Reward_Modal";
import Welcome_Modal from "../../Welcome_Modal/Welcome_Modal";

import { useAuth } from "../../../context/Auth_Context";
import { useOnboarding } from "../../../hooks/useOnboarding";
import { useWelcomeModal } from "../../../hooks/useWelcomeModal";
import { 
  MetricData, 
  ProjectData, 
  EarningsData, 
  CarbonFootprintData, 
  SocialSharingData 
} from "../types";

interface Dashboard_MainProps {
  metrics: MetricData[];
  projects: ProjectData[];
  earnings: EarningsData;
  footprint: CarbonFootprintData;
  social: SocialSharingData;
}

const Dashboard_Main = memo(({ 
  metrics, 
  projects, 
  earnings, 
  footprint, 
  social
}: Dashboard_MainProps) => {

  const { user } = useAuth();
  const { updateWelcomeModal, updateOnboardingStep, updateProfileStatus } = useOnboarding();
  const { updateWelcomeModal: updateWelcomeModalShown } = useWelcomeModal();
  const [showAffiliateRewardBanner, setShowAffiliateRewardBanner] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [modalAccepted, setModalAccepted] = useState(false);
  const [shouldShowAffiliateModal, setShouldShowAffiliateModal] = useState(false);
  const [shouldShowWelcomeModal, setShouldShowWelcomeModal] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    if (user) {
      const hasUsedAffiliateCode = user.affiliateCodeUsedAt !== null;
      const shouldShowAffiliateModal = !user.welcomeModalShown && hasUsedAffiliateCode;
      const shouldShowWelcomeModalForNewUser = !user.welcomeModalShown && !hasUsedAffiliateCode;
      const shouldShowOnboardingTour = user.onboardingStep === "pending" || user.onboardingStep === "skipped";
      
      setShouldShowAffiliateModal(shouldShowAffiliateModal);
      setShouldShowWelcomeModal(shouldShowWelcomeModalForNewUser);
      setShouldShowTour(shouldShowOnboardingTour);
      
      if (shouldShowAffiliateModal) {
        setShowAffiliateRewardBanner(true);
        setShowWelcomeBanner(false);
      } else if (shouldShowWelcomeModalForNewUser) {
        setShowAffiliateRewardBanner(false);
        setShowWelcomeBanner(true);
      } else {
        setShowAffiliateRewardBanner(false);
        setShowWelcomeBanner(false);
      }
    }
  }, [user]);





  const handleCloseAffiliateRewardBanner = async () => {
    setShowAffiliateRewardBanner(false);
  };

  const handleCloseWelcomeBanner = async () => {
    setShowWelcomeBanner(false);
    setModalAccepted(true);
    
    try {
      // Marcar modal de bienvenida como mostrado aunque se cierre sin botón
      await updateWelcomeModalShown();
    } catch (error) {
      console.error("Error al marcar modal de bienvenida como mostrado:", error);
    }
  };

  const handleAffiliateRewardButtonClick = async () => {
    setShowAffiliateRewardBanner(false);
    setModalAccepted(true);
    
    try {
      // 1. Marcar modal de bienvenida como mostrado
      const modalUpdated = await updateWelcomeModal();
      if (modalUpdated) {
        // 2. Marcar perfil como completado
        await updateProfileStatus();
        // 3. El tour se iniciará automáticamente, pero NO haremos API calls hasta que el usuario interactúe
      }
    } catch (error) {
      console.error("Error en el flujo de onboarding:", error);
    }
  };

  const handleWelcomeButtonClick = async () => {
    setShowWelcomeBanner(false);
    setModalAccepted(true);
    
    try {
      // Marcar modal de bienvenida como mostrado
      await updateWelcomeModalShown();
    } catch (error) {
      console.error("Error al marcar modal de bienvenida como mostrado:", error);
    }
  };




  return (
    <>
      <Dashboard_Tour shouldShowTour={modalAccepted && shouldShowTour} />
      <Dashboard_Tour_Button />
      <Affiliate_Reward_Modal 
        show={showAffiliateRewardBanner && shouldShowAffiliateModal} 
        onClose={handleCloseAffiliateRewardBanner}
        onButtonClick={handleAffiliateRewardButtonClick}
      />
      
      <Welcome_Modal 
        show={showWelcomeBanner && shouldShowWelcomeModal} 
        onClose={handleCloseWelcomeBanner}
        onButtonClick={handleWelcomeButtonClick}
      />

      <div className="dashboard-content space-y-8 sm:space-y-6 lg:space-y-6 xl:space-y-8 p-4 sm:p-6 lg:p-0 xl:p-0">

        <Metrics_Row data={metrics} />
        <Projects_Row projects={projects} footprint={footprint} />
        <Bottom_Row earnings={earnings} social={social} />
      </div>
    </>
  );
});

Dashboard_Main.displayName = 'Dashboard_Main';

export default Dashboard_Main; 