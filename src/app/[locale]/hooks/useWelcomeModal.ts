"use client";
import { useState } from "react";
import { post } from "../../../utils/request";
import { useAuth } from "../context/Auth_Context";

interface WelcomeModalData {
  welcomeModalShown: boolean;
  email?: string;
}

export const useWelcomeModal = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const updateWelcomeModal = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      console.log("📡 Enviando POST /update-welcome-modal...");
      const payload: WelcomeModalData = { 
        welcomeModalShown: true 
      };
      
      if (user?.email) {
        payload.email = user.email;
      }
      
      const response = await post("/update-welcome-modal", payload);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Modal de bienvenida marcado como mostrado:", data);
        return true;
      } else {
        console.error("❌ Error al marcar modal de bienvenida como mostrado:", response.status);
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
    updateWelcomeModal,
    isUpdating
  };
};
