const IS_DEV = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

const getBaseBackendUrl = () => {
  if (IS_DEV) {
    return "http://localhost:10001";
  }
  
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envUrl) {
    return envUrl;
  }
  
  return "https://backend-render-7vh2.onrender.com";
};

const BACKEND_URL = getBaseBackendUrl();

if (typeof window !== 'undefined') {
  console.log('🔧 Backend Config URL:', {
    envVar: process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET',
    resolvedUrl: BACKEND_URL,
    nodeEnv: process.env.NODE_ENV,
    isDev: IS_DEV,
    warning: !process.env.NEXT_PUBLIC_BACKEND_URL ? '⚠️ Using fallback URL - Check Vercel environment variables!' : '✅ Using env var'
  });
}

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
    GOOGLE_SHEETS: "/google-sheets",
  }
};

export const getBackendUrl = (endpoint: string) => `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
