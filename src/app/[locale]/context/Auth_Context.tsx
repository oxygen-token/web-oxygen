"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { get, post } from "../../../utils/request";
import { useDev } from "./Dev_Context";

interface User {
  username: string;
  email?: string;
  isFirstLogin?: boolean;
  welcomeModalShown?: boolean;
  onboardingStep?: string;
  affiliateCodeUsedAt?: string | null;
  carbonCredits?: number;
  omBalance?: number;
  bonusOMsReceived?: number;
}

type LoginResponse = 
  | { requires2FA: true; email: string }
  | { success: boolean };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggingOut: boolean;
  hasLoggedOut: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuthState: () => void;
  forceLogout: () => void;
  resetLogoutState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const { isDevMode, mockUser } = useDev();
  const loadingRef = useRef(true);

  const checkAuth = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );
      
      const data: any = await Promise.race([
        get("/session"),
        timeoutPromise
      ]);
      
      if (data.loggedIn) {
        setUser({
          username: data.fullName || data.username,
          email: data.email || "",
          isFirstLogin: data.isFirstLogin || false,
          welcomeModalShown: data.welcomeModalShown || false,
          onboardingStep: data.onboardingStep || "pending",
          affiliateCodeUsedAt: data.affiliateCodeUsedAt || null,
          carbonCredits: data.carbonCredits ?? 0,
          omBalance: data.omBalance ?? 0,
          bonusOMsReceived: data.bonusOMsReceived ?? 0,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const login = async (email: string, password: string) => {
    setHasLoggedOut(false);
    setIsLoggingOut(false);
    
    try {
      const loginData = {
        email: email,
        password: password,
      };
      
      const responseData = await post("/login", loginData);
      
      if (responseData.status === "2fa_required" || responseData.requires2FA || responseData.twoFactorRequired) {
        return {
          requires2FA: true as const,
          email: email,
        };
      }

      if (responseData.success) {
        const username = responseData.user?.fullName || responseData.fullName || email.split('@')[0];
        const userEmail = responseData.user?.email || responseData.email || email;
        const isFirstLogin = responseData.isFirstLogin || false;
        const welcomeModalShown = responseData.user?.welcomeModalShown || false;
        const onboardingStep = responseData.user?.onboardingStep || "pending";
        const affiliateCodeUsedAt = responseData.user?.affiliateCodeUsedAt || null;
        
        setUser({ 
          username: username, 
          email: userEmail,
          isFirstLogin: isFirstLogin,
          welcomeModalShown: welcomeModalShown,
          onboardingStep: onboardingStep,
          affiliateCodeUsedAt: affiliateCodeUsedAt
        });
        setLoading(false);
        return { success: true };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("❌ Login error in context:", error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    setLoading(true);
    
    try {
      await post("/logout");
    } catch (error) {
      console.error("Error en logout del backend:", error);
    }

    // Limpiar cookies de sesión
    try {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost";
      
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
      
      document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (cookieError) {
      console.error("Error limpiando cookies:", cookieError);
    }

    // Limpiar localStorage
    try {
      localStorage.removeItem('affiliateCode');
      localStorage.removeItem('affiliateVerified');
      localStorage.removeItem('affiliateBannerSeen');
    } catch (storageError) {
      console.error("Error limpiando localStorage:", storageError);
    }

    setUser(null);
    setLoading(false);
    setIsLoggingOut(false);
  };

  // Función adicional para limpiar completamente el estado
  const clearAuthState = () => {
    setIsLoggingOut(true);
    setUser(null);
    setLoading(false);
    
    // Limpiar cookies
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost;";
    });
    
    setIsLoggingOut(false);
  };

  // Función de logout forzado que no depende del backend
  const forceLogout = () => {
    console.log("🔄 Force logout iniciado...");
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("forceLogout", "true");
    }
    
    // NUCLEAR APPROACH - Limpiar TODO inmediatamente
    setUser(null);
    setLoading(false);
    setIsLoggingOut(true);
    setHasLoggedOut(true);
    
    // Limpiar cookies de manera NUCLEAR
    try {
      // Cookies específicas que vimos en las dev tools
      const cookieNames = [
        'jwt', 'NEXT_LOCALE', 'username', 'session', 'auth', 'token', 
        'connect.sid', 'next-auth.session-token', 'next-auth.csrf-token', 
        'next-auth.callback-url', 'oxygen_token', 'oxygen_session', 
        'oxygen_auth', 'oxygen_user', '_Secure-YEC', 'GPS', 'PREF', 'wide'
      ];
      
      // Todos los paths posibles
      const paths = ['/', '/dashboard', '/api', '/es', '/en', '/dashboard/*', '/api/*', '/es/*', '/en/*'];
      
      // Dominios específicos para desarrollo local
      const domains = ['', 'localhost', '.localhost', '127.0.0.1', 'localhost:3000', window.location.hostname, window.location.host]
      
      console.log("🍪 Limpiando cookies específicas:", cookieNames);
      
      // Limpiar cada cookie con todas las variaciones posibles
      cookieNames.forEach(name => {
        paths.forEach(path => {
          domains.forEach(domain => {
            const variations = [
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; httponly`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure; httponly`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; samesite=strict`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; samesite=lax`,
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; samesite=none`,
            ];
            
            variations.forEach(cookieString => {
              document.cookie = cookieString;
            });
          });
        });
      });
      
      // Limpiar TODAS las cookies restantes (nuclear approach)
      const allCookies = document.cookie.split(";");
      
      allCookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          paths.forEach(path => {
            domains.forEach(domain => {
              const variations = [
                `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`,
                `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`,
                `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure`,
                `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; httponly`,
              ];
              
              variations.forEach(cookieString => {
                document.cookie = cookieString;
              });
            });
          });
        }
      });
      
    } catch (error) {
      console.error("❌ Error limpiando cookies:", error);
    }
    
    // Limpiar storage NUCLEAR - ESPECÍFICO PARA localhost:3000
    try {
      // Limpiar storage específico para localhost:3000
      if (window.location.origin === 'http://localhost:3000') {
        // Limpiar localStorage
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Limpiar sessionStorage
        const sessionStorageKeys = Object.keys(sessionStorage);
        sessionStorageKeys.forEach(key => {
          sessionStorage.removeItem(key);
        });
        
        // También limpiar con clear() por si acaso
        localStorage.clear();
        sessionStorage.clear();
      } else {
        // Para otros dominios, limpiar todo
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("❌ Error limpiando storage:", error);
    }
    
    // Forzar recarga del estado después de un delay
    setTimeout(() => {
      setUser(null);
      setLoading(false);
      setIsLoggingOut(false);
      
      // Forzar recarga de la página si es necesario
      if (window.location.pathname.includes('/dashboard')) {
        window.location.href = '/';
      }
    }, 200);
  };

  useEffect(() => {
    if (isDevMode && mockUser) {
      setUser({
        username: mockUser.username,
        email: mockUser.email,
        isFirstLogin: mockUser.isFirstLogin,
        welcomeModalShown: true,
        onboardingStep: "completed",
        affiliateCodeUsedAt: null,
      });
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const forceLogoutFlag = sessionStorage.getItem("forceLogout");
      if (forceLogoutFlag === "true") {
        setUser(null);
        setLoading(false);
        sessionStorage.removeItem("forceLogout");
        return;
      }

      // Skip checkAuth on public pages where user is not expected to be logged in
      // Note: verify-success puede setear el user después de verificación exitosa
      const publicPaths = ['/post-register', '/login', '/register'];
      const currentPath = window.location.pathname;
      const isPublicPage = publicPaths.some(path => currentPath.includes(path));

      // Para verify-success, solo skip checkAuth pero no resetear user
      // porque el user se setea después de verificación exitosa
      if (currentPath.includes('/verify-success')) {
        setLoading(false);
        return;
      }

      if (isPublicPage) {
        setUser(null);
        setLoading(false);
        return;
      }
    }

    if (!isLoggingOut && !hasLoggedOut) {
      loadingRef.current = true;
      checkAuth();

      const fallbackTimeout = setTimeout(() => {
        if (loadingRef.current) {
          setLoading(false);
          loadingRef.current = false;
        }
      }, 15000);

      return () => {
        clearTimeout(fallbackTimeout);
      };
    } else {
      console.log("⏸️ Saltando checkAuth:", { isLoggingOut, hasLoggedOut });
    }
  }, [isLoggingOut, hasLoggedOut, isDevMode, mockUser]);

  // Efecto adicional para limpiar el estado cuando se hace logout
  useEffect(() => {
    if (hasLoggedOut) {
      setUser(null);
      setLoading(false);
      setIsLoggingOut(false);
    }
  }, [hasLoggedOut]);

  const value = {
    user,
    loading,
    isLoggingOut,
    hasLoggedOut,
    login,
    logout,
    checkAuth,
    setUser,
    clearAuthState,
    forceLogout,
    resetLogoutState: () => {
      setIsLoggingOut(false);
      setHasLoggedOut(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 