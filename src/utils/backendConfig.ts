// Configuración del backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-main.onrender.com";

export const BACKEND_CONFIG = {
  BASE_URL: BACKEND_URL,
  ENDPOINTS: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    SESSION: "/session",
    VERIFY_EMAIL: "/verify-email",
    VERIFY_AFFILIATE_CODE: "/verify-affiliate-code",
    UPDATE_WELCOME_MODAL: "/update-welcome-modal",
    UPDATE_ONBOARDING_STEP: "/update-onboarding-step",
    UPDATE_PROFILE_STATUS: "/update-profile-status",
  }
};

export const getBackendUrl = (endpoint: string) => `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
