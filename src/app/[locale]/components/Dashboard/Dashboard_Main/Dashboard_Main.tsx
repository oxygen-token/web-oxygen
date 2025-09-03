"use client";
import { memo, useState, useEffect } from "react";
import Metrics_Row from "../Metrics_Row/Metrics_Row";
import Projects_Row from "../Projects_Row/Projects_Row";
import Bottom_Row from "../Bottom_Row/Bottom_Row";
import Dashboard_Tour from "../Dashboard_Tour/Dashboard_Tour";
import Dashboard_Tour_Button from "../Dashboard_Tour_Button/Dashboard_Tour_Button";

import OM_Modal from "../../OM_Modal/OM_Modal";

import { useAuth } from "../../../context/Auth_Context";
import { useOnboarding } from "../../../hooks/useOnboarding";
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
  const [showAffiliateBanner, setShowAffiliateBanner] = useState(false);
  const [modalAccepted, setModalAccepted] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    // Verificar si se debe mostrar el modal y tour basado en las variables del backend
    if (user) {
      console.log("🔍 Verificando estado del onboarding para usuario:", user);
      
      // Por ahora, asumimos que siempre se debe mostrar (esto se puede cambiar cuando tengamos las variables del backend)
      // TODO: Verificar welcomeModalShown y onboardingStep del backend
      setShouldShowModal(true);
      setShouldShowTour(false); // El tour se activa cuando se acepta el modal
      
      // Si el usuario ya vio el modal, no mostrarlo
      if (user.isFirstLogin === false) {
        console.log("👤 Usuario ya no es primer login, ocultando modal");
        setShouldShowModal(false);
      } else {
        console.log("🆕 Usuario es primer login, mostrando modal");
        setShowAffiliateBanner(true);
      }
    }
  }, [user]);





  const handleCloseAffiliateBanner = async () => {
    setShowAffiliateBanner(false);
  };

  const handleButtonClick = async () => {
    setShowAffiliateBanner(false);
    setModalAccepted(true);
    
    try {
      // 1. Marcar modal de bienvenida como mostrado
      const modalUpdated = await updateWelcomeModal();
      if (modalUpdated) {
        // 2. Actualizar onboarding step a "welcome_shown"
        const stepUpdated = await updateOnboardingStep("welcome_shown");
        if (stepUpdated) {
          // 3. Marcar perfil como completado
          await updateProfileStatus();
        }
      }
    } catch (error) {
      console.error("Error en el flujo de onboarding:", error);
    }
  };



  return (
    <>
      <Dashboard_Tour shouldShowTour={modalAccepted && shouldShowTour} />
      <Dashboard_Tour_Button />
      <OM_Modal 
        show={showAffiliateBanner && shouldShowModal} 
        onClose={handleCloseAffiliateBanner}
        onButtonClick={handleButtonClick}
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