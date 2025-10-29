import { useState } from 'react';
import { post } from '../../../utils/request';
import { useAuth } from '../context/Auth_Context';

interface OnboardingData {
  onboardingStep: string;
  profileCompleted: boolean;
  welcomeModalShown: boolean;
}

export const useOnboarding = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const updateWelcomeModal = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log("📡 Enviando POST /update-welcome-modal...");
      const payload: { welcomeModalShown: boolean; email?: string } = { 
        welcomeModalShown: true 
      };
      
      if (user?.email) {
        payload.email = user.email;
      }
      
      const response = await post("/update-welcome-modal", payload);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Modal marcado como mostrado:", data);
        return true;
      } else {
        console.error("❌ Error al marcar modal como mostrado:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOnboardingStep = async (step: string, skipped?: boolean, stepNumber?: number): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log(`📡 Enviando POST /update-onboarding-step...`);
      
      const payload: { 
        onboardingStep: string; 
        skipped?: boolean; 
        step?: number;
        email?: string;
      } = { 
        onboardingStep: step 
      };
      
      if (skipped !== undefined) {
        payload.skipped = skipped;
      }
      
      if (stepNumber !== undefined) {
        payload.step = stepNumber;
      }
      
      if (user?.email) {
        payload.email = user.email;
      }
      
      const response = await post("/update-onboarding-step", payload);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Onboarding step actualizado:", data);
        return true;
      } else {
        console.error("❌ Error al actualizar onboarding step:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfileStatus = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log("📡 Enviando POST /update-profile-status...");
      const response = await post("/update-profile-status");
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Perfil marcado como completado:", data);
        return true;
      } else {
        console.error("❌ Error al marcar perfil como completado:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateWelcomeModal,
    updateOnboardingStep,
    updateProfileStatus,
  };
};
