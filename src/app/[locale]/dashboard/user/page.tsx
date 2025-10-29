"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Dashboard_Main from "../../components/Dashboard/Dashboard_Main/Dashboard_Main";
import Animated_Page from "../../components/ui/Animated_Page";
import OM_Modal from "../../components/OM_Modal/OM_Modal";
import Code_Modal from "../../components/Code_Modal/Code_Modal";
import { useAuth } from "../../context/Auth_Context";
import { useOnboarding } from "../../hooks/useOnboarding";

const userDashboardData = {
  metrics: [
    {
      title: "mis bonos",
      value: "X",
      icon: "/assets/images/imgTrees.jpg",
      description: "Créditos personales"
    },
    {
      title: "mi CO₂",
      value: "X",
      icon: "/assets/images/forest.jpg",
      description: "Toneladas compensadas"
    },
    {
      title: "m² salvados",
      value: "5",
      icon: "/assets/images/imgTrees.jpg",
      description: "M² protegidos"
    }
  ],
  projects: [
    {
      id: "1",
      name: "La Florencia",
      location: "Formosa",
      price: "$15.00 / tnCO2",
      image: "/assets/images/forestHD.jpg",
      status: "active" as const
    }
  ],
  earnings: {
    total: "$180.00",
    chartData: [
      { month: "Ene", value: 50 },
      { month: "Feb", value: 75 },
      { month: "Mar", value: 100 },
      { month: "Abr", value: 120 },
      { month: "May", value: 140 },
      { month: "Jun", value: 160 },
      { month: "Jul", value: 175 },
      { month: "Ago", value: 180 },
      { month: "Sep", value: 185 },
      { month: "Oct", value: 190 }
    ]
  },
  footprint: {
    value: "2,50",
    unit: "tn CO₂",
    period: "año"
  },
  social: {
    certificateValue: "48 M²",
    socialPlatforms: [
      {
        name: "Instagram",
        icon: "instagram",
        action: "Compartir en Instagram"
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        action: "Compartir en LinkedIn"
      }
    ]
  }
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { updateWelcomeModal, updateProfileStatus } = useOnboarding();
  const [showCodeModal, setShowCodeModal] = useState(true);
  const [showOMModal, setShowOMModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user) {
      const shouldShowWelcomeModal = !user.welcomeModalShown;
      console.log("🔍 Estado del usuario en /dashboard/user:", {
        welcomeModalShown: user.welcomeModalShown,
        shouldShowWelcomeModal
      });
      
      if (shouldShowWelcomeModal) {
        setShowOMModal(true);
      } else {
        setIsVerified(true);
      }
    }
  }, [user]);

  const handleCloseCodeModal = () => {
    return;
  };

  const handleCodeSubmit = async (code: string): Promise<boolean> => {
    console.log("Code submitted:", code);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (code === "123456") {
        setShowCodeModal(false);
        setShowOMModal(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleCloseOMModal = async () => {
    setShowOMModal(false);
    setIsVerified(true);
    
    try {
      await updateWelcomeModal();
      await updateProfileStatus();
    } catch (error) {
      console.error("Error al actualizar estado del modal:", error);
    }
  };

  const handleOMModalButtonClick = async () => {
    setShowOMModal(false);
    setIsVerified(true);
    
    try {
      await updateWelcomeModal();
      await updateProfileStatus();
    } catch (error) {
      console.error("Error al actualizar estado del modal:", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <Animated_Page>
          {isVerified ? (
            <Dashboard_Main {...userDashboardData} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-teal-600 mb-2">Verificación Requerida</h2>
                <p className="text-gray-600">Por favor completa la verificación para acceder a tu dashboard</p>
              </div>
            </div>
          )}
        </Animated_Page>
      </DashboardLayout>
      
      <Code_Modal 
        show={showCodeModal} 
        onClose={handleCloseCodeModal} 
        onSubmit={handleCodeSubmit}
      />
      
      <OM_Modal show={showOMModal} onClose={handleCloseOMModal} onButtonClick={handleOMModalButtonClick} />
    </>
  );
} 