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
  affiliateCode?: string | null;
  affiliateCodeUsedAt?: string | null;
  carbonCredits?: number;
  omBalance?: number;
  bonusOMsReceived?: number;
  messageType?: string | null;
}

type LoginResponse = { success: boolean };

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

      // Usar API Route de Next.js en lugar de llamar directamente al backend
      const response = await Promise.race([
        fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        timeoutPromise
      ]) as Response;

      const data: any = await response.json();

      if (data.loggedIn) {
        setUser({
          username: data.fullName || data.username,
          email: data.email || "",
          isFirstLogin: data.isFirstLogin || false,
          welcomeModalShown: data.welcomeModalShown || false,
          onboardingStep: data.onboardingStep || "pending",
          affiliateCode: data.affiliateCode || null,
          affiliateCodeUsedAt: data.affiliateCodeUsedAt || null,
          carbonCredits: data.carbonCredits ?? 0,
          omBalance: data.omBalance ?? 0,
          bonusOMsReceived: data.bonusOMsReceived ?? 0,
          messageType: data.messageType || null,
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

      // Usar API Route de Next.js en lugar de llamar directamente al backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("📥 Login response:", responseData);

      if (!response.ok) {
        throw response;
      }

      // El backend devuelve success:true o un objeto user cuando el login es exitoso
      if (responseData.success || responseData.user) {
        const userData = responseData.user;
        console.log("✅ Login condition met, setting user:", userData);

        const userObj = {
          username: userData?.fullName || userData?.name || email.split('@')[0],
          email: userData?.email || email,
          isFirstLogin: userData?.isFirstLogin || false,
          welcomeModalShown: userData?.welcomeModalShown || false,
          onboardingStep: userData?.onboardingStep || "pending",
          affiliateCode: userData?.affiliateCode || null,
          affiliateCodeUsedAt: userData?.affiliateCodeUsedAt || null,
          messageType: responseData.messageType || null,
          carbonCredits: userData?.carbonCredits ?? 0,
          omBalance: userData?.omBalance ?? 0,
          bonusOMsReceived: userData?.bonusOMsReceived ?? 0,
        };

        setUser(userObj);
        // Guardar en localStorage para persistir entre navegaciones
        localStorage.setItem('user', JSON.stringify(userObj));
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
    console.log("🚪 Iniciando LOGOUT NUCLEAR...");
    setIsLoggingOut(true);
    setLoading(true);

    // 1. Llamar al API route de Next.js para limpiar cookies HttpOnly
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("✅ Logout exitoso - Cookies HttpOnly limpiadas");
      } else {
        console.warn("⚠️ Logout del servidor falló, continuando con limpieza local");
      }
    } catch (error) {
      console.error("❌ Error en logout:", error);
      // Continuar con logout aunque falle el backend
    }

    // 2. LIMPIEZA NUCLEAR DE COOKIES - Producción y desarrollo
    try {
      // Obtener el dominio actual
      const currentDomain = window.location.hostname;
      const isProduction = !currentDomain.includes('localhost') && !currentDomain.includes('127.0.0.1');

      // Lista de nombres de cookies conocidas
      const cookieNames = [
        'jwt', 'username', 'session', 'auth', 'token',
        'connect.sid', 'next-auth.session-token', 'next-auth.csrf-token',
        'next-auth.callback-url', 'oxygen_token', 'oxygen_session',
        'oxygen_auth', 'oxygen_user', 'NEXT_LOCALE'
      ];

      // Paths posibles
      const paths = ['/', '/dashboard', '/api', '/es', '/en'];

      // Dominios para producción y desarrollo
      const domains = [
        '',
        currentDomain,
        `.${currentDomain}`,
        'localhost',
        '.localhost',
        '127.0.0.1',
      ];

      console.log(`🍪 Limpiando cookies para dominio: ${currentDomain} (${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'})`);

      // Limpiar cookies conocidas con todas las variaciones
      cookieNames.forEach(name => {
        paths.forEach(path => {
          domains.forEach(domain => {
            // Variaciones básicas
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;

            // Con flags de seguridad
            if (isProduction) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure; samesite=none`;
            }

            // SameSite variations
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; samesite=strict`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; samesite=lax`;
          });
        });
      });

      // Limpiar TODAS las cookies que existan actualmente
      const allCookies = document.cookie.split(";");
      allCookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        if (name) {
          paths.forEach(path => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${currentDomain}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${currentDomain}`;

            if (isProduction) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${currentDomain}; secure`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${currentDomain}; secure`;
            }
          });
        }
      });

      console.log("✅ Cookies limpiadas");
    } catch (cookieError) {
      console.error("❌ Error limpiando cookies:", cookieError);
    }

    // 3. LIMPIEZA NUCLEAR DE STORAGE
    try {
      // LocalStorage
      const localStorageKeys = Object.keys(localStorage);
      console.log(`🗄️ Limpiando ${localStorageKeys.length} items de localStorage`);
      localStorageKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      localStorage.clear();

      // SessionStorage
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log(`🗄️ Limpiando ${sessionStorageKeys.length} items de sessionStorage`);
      sessionStorageKeys.forEach(key => {
        sessionStorage.removeItem(key);
      });
      sessionStorage.clear();

      console.log("✅ Storage limpiado completamente");
    } catch (storageError) {
      console.error("❌ Error limpiando storage:", storageError);
    }

    // 4. LIMPIEZA DE CACHÉ (ServiceWorker y Cache API)
    try {
      // Limpiar Cache API si está disponible
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`🗑️ Limpiando ${cacheNames.length} cachés`);
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log("✅ Caché limpiado");
      }
    } catch (cacheError) {
      console.error("❌ Error limpiando caché:", cacheError);
    }

    // 5. Limpiar estado de la aplicación
    setUser(null);
    setHasLoggedOut(true);
    setLoading(false);
    setIsLoggingOut(false);

    console.log("✅ LOGOUT NUCLEAR COMPLETADO");

    // 6. FORZAR REDIRECCIÓN Y RECARGA
    // Esperar un momento para que todas las operaciones async terminen
    setTimeout(() => {
      // Redirigir a home y forzar recarga completa
      window.location.href = '/';
      // Forzar recarga dura (sin caché)
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 300);
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
        localStorage.removeItem('user');
        setLoading(false);
        sessionStorage.removeItem("forceLogout");
        return;
      }

      // Intentar cargar usuario desde localStorage primero
      const savedUser = localStorage.getItem('user');
      if (savedUser && !user) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log("📦 Usuario cargado desde localStorage:", parsedUser);
          setUser(parsedUser);
          setLoading(false);
          return;
        } catch (e) {
          console.error("❌ Error parsing saved user:", e);
          localStorage.removeItem('user');
        }
      }

      // Skip checkAuth on public pages where user is not expected to be logged in
      const publicPaths = ['/post-register', '/login', '/register'];
      const currentPath = window.location.pathname;
      const isPublicPage = publicPaths.some(path => currentPath.includes(path));

      // Para verify-success, solo skip checkAuth pero no resetear user
      if (currentPath.includes('/verify-success')) {
        setLoading(false);
        return;
      }

      // Si estamos en una página pública, solo terminar loading
      if (isPublicPage) {
        setLoading(false);
        return;
      }
    }

    // Si el usuario ya está seteado, no hacer checkAuth
    if (user) {
      console.log("✅ Usuario ya existe en contexto, saltando checkAuth");
      setLoading(false);
      return;
    }

    // Solo hacer checkAuth si no tenemos usuario y no estamos en logout
    if (!isLoggingOut && !hasLoggedOut && !user) {
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
  }, [isLoggingOut, hasLoggedOut, isDevMode, mockUser, user]);

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