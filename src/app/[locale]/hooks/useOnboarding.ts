import { useState } from 'react';

interface OnboardingData {
  onboardingStep: string;
  profileCompleted: boolean;
  welcomeModalShown: boolean;
}

export const useOnboarding = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateWelcomeModal = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log("📡 Enviando POST /update-welcome-modal...");
      const response = await fetch('/api/update-welcome-modal', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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

  const updateOnboardingStep = async (step: string): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log(`📡 Enviando POST /update-onboarding-step con step: ${step}...`);
      const response = await fetch('/api/update-onboarding-step', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onboardingStep: step }),
      });
      
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
      const response = await fetch('/api/update-profile-status', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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
