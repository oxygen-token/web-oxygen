"use client";
import { memo, useState, useEffect } from "react";
import Metrics_Row from "../Metrics_Row/Metrics_Row";
import Projects_Row from "../Projects_Row/Projects_Row";
import Bottom_Row from "../Bottom_Row/Bottom_Row";
import Dashboard_Tour from "../Dashboard_Tour/Dashboard_Tour";
import Dashboard_Tour_Button from "../Dashboard_Tour_Button/Dashboard_Tour_Button";

import Affiliate_Reward_Modal from "../../Affiliate_Reward_Modal/Affiliate_Reward_Modal";
import Welcome_Modal from "../../Welcome_Modal/Welcome_Modal";
import Community_Welcome_Modal from "../../Community_Welcome_Modal/Community_Welcome_Modal";

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
  const [shouldShowCommunityModal, setShouldShowCommunityModal] = useState(false);
  const [shouldShowWelcomeModal, setShouldShowWelcomeModal] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [showCommunityBanner, setShowCommunityBanner] = useState(false);

  useEffect(() => {
    if (user) {
      const hasUsedAffiliateCode = user.affiliateCodeUsedAt !== null;
      const isSpecialUser = user.messageType === "special";

      // Prioridad 1: Usuario con código de afiliado
      const shouldShowAffiliateModalCalc = !user.welcomeModalShown && hasUsedAffiliateCode;
      // Prioridad 2: Usuario especial de comunidad (messageType === "special")
      const shouldShowCommunityModalCalc = !user.welcomeModalShown && !hasUsedAffiliateCode && isSpecialUser;
      // Prioridad 3: Usuario nuevo normal
      const shouldShowWelcomeModalForNewUser = !user.welcomeModalShown && !hasUsedAffiliateCode && !isSpecialUser;
      const shouldShowOnboardingTour = user.onboardingStep === "pending" || user.onboardingStep === "skipped";

      // Si el usuario ya aceptó el modal manualmente, no volver a mostrarlo
      if (modalAccepted) {
        setShouldShowAffiliateModal(false);
        setShouldShowCommunityModal(false);
        setShouldShowWelcomeModal(false);
        setShowAffiliateRewardBanner(false);
        setShowCommunityBanner(false);
        setShowWelcomeBanner(false);
        return;
      }

      setShouldShowAffiliateModal(shouldShowAffiliateModalCalc);
      setShouldShowCommunityModal(shouldShowCommunityModalCalc);
      setShouldShowWelcomeModal(shouldShowWelcomeModalForNewUser);
      setShouldShowTour(shouldShowOnboardingTour);

      if (shouldShowAffiliateModalCalc) {
        setShowAffiliateRewardBanner(true);
        setShowCommunityBanner(false);
        setShowWelcomeBanner(false);
      } else if (shouldShowCommunityModalCalc) {
        setShowAffiliateRewardBanner(false);
        setShowCommunityBanner(true);
        setShowWelcomeBanner(false);
      } else if (shouldShowWelcomeModalForNewUser) {
        setShowAffiliateRewardBanner(false);
        setShowCommunityBanner(false);
        setShowWelcomeBanner(true);
      } else {
        setShowAffiliateRewardBanner(false);
        setShowCommunityBanner(false);
        setShowWelcomeBanner(false);
      }
    }
  }, [user?.welcomeModalShown, user?.affiliateCodeUsedAt, user?.onboardingStep, user?.messageType, modalAccepted]);





  const handleCloseAffiliateRewardBanner = async () => {
    setShowAffiliateRewardBanner(false);
  };

  const handleCloseCommunityBanner = async () => {
    setShowCommunityBanner(false);
    setModalAccepted(true);

    try {
      await updateWelcomeModalShown();
    } catch (error) {
      console.error("Error al marcar modal de bienvenida como mostrado:", error);
    }
  };

  const handleCloseWelcomeBanner = async () => {
    console.log("❌ Modal de bienvenida cerrado sin hacer clic en el botón");

    // Cerrar el modal inmediatamente
    setShowWelcomeBanner(false);
    setShouldShowWelcomeModal(false);
    setModalAccepted(true);

    try {
      // Marcar modal de bienvenida como mostrado aunque se cierre sin botón
      console.log("📡 Actualizando welcomeModalShown en el backend (cerrado sin botón)...");
      await updateWelcomeModalShown();
      console.log("✅ welcomeModalShown actualizado exitosamente");
    } catch (error) {
      console.error("❌ Error al marcar modal de bienvenida como mostrado:", error);
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

  const handleCommunityButtonClick = async () => {
    setShowCommunityBanner(false);
    setModalAccepted(true);

    try {
      // 1. Marcar modal de bienvenida como mostrado
      const modalUpdated = await updateWelcomeModal();
      if (modalUpdated) {
        // 2. Marcar perfil como completado
        await updateProfileStatus();
      }
    } catch (error) {
      console.error("Error en el flujo de onboarding:", error);
    }
  };

  const handleWelcomeButtonClick = async () => {
    console.log("🎯 Botón de bienvenida clickeado");

    // Cerrar el modal inmediatamente para evitar múltiples clicks
    setShowWelcomeBanner(false);
    setShouldShowWelcomeModal(false);
    setModalAccepted(true);

    try {
      // Marcar modal de bienvenida como mostrado
      console.log("📡 Actualizando welcomeModalShown en el backend...");
      await updateWelcomeModalShown();
      console.log("✅ welcomeModalShown actualizado exitosamente");
    } catch (error) {
      console.error("❌ Error al marcar modal de bienvenida como mostrado:", error);
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
      
      <Community_Welcome_Modal
        show={showCommunityBanner && shouldShowCommunityModal}
        onClose={handleCloseCommunityBanner}
        onButtonClick={handleCommunityButtonClick}
      />

      <Welcome_Modal
        show={showWelcomeBanner && shouldShowWelcomeModal}
        onClose={handleCloseWelcomeBanner}
        onButtonClick={handleWelcomeButtonClick}
      />

      <div className="dashboard-content space-y-12 sm:space-y-6 lg:space-y-12 xl:space-y-16 p-4 sm:p-6 lg:p-0 xl:p-0">

        <Metrics_Row data={metrics} />
        <Projects_Row projects={projects} footprint={footprint} />
        <Bottom_Row earnings={earnings} social={social} />
      </div>
    </>
  );
});

Dashboard_Main.displayName = 'Dashboard_Main';

export default Dashboard_Main; 