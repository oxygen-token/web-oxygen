"use client";
import { memo, useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { 
  PiHouse, 
  PiGlobe,
  PiArrowsClockwise, 
  PiFire, 
  PiCurrencyDollar, 
  PiQuestion, 
  PiGear, 
  PiSignOut 
} from "react-icons/pi";
import { useSidebarSync } from "../../hooks/useSidebarSync";
import { useTransition } from "../../context/Transition_Context";
import { useAuth } from "../../context/Auth_Context";

interface MenuItem {
  nameKey: string;
  href: string | null;
  icon: any;
  disabled: boolean;
  isAction: boolean;
}

const menuItems: MenuItem[] = [
  { nameKey: "inicio", href: "/en/dashboard", icon: PiHouse, disabled: false, isAction: false },
  { nameKey: "mainPage", href: "/en", icon: PiGlobe, disabled: false, isAction: false },
  { nameKey: "intercambiar", href: "/en/dashboard/intercambiar", icon: PiArrowsClockwise, disabled: true, isAction: false },
  { nameKey: "quemarToken", href: "/en/dashboard/quemar-token", icon: PiFire, disabled: true, isAction: false },
  { nameKey: "compensar", href: "/en/dashboard/compensar", icon: PiCurrencyDollar, disabled: true, isAction: false },
  { nameKey: "ayuda", href: "/en/dashboard/ayuda", icon: PiQuestion, disabled: true, isAction: false },
  { nameKey: "configuracion", href: "/en/dashboard/configuracion", icon: PiGear, disabled: true, isAction: false },
  { nameKey: "cerrarSesion", href: null, icon: PiSignOut, disabled: false, isAction: true },
];

const SideBarDashboard = memo(() => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const t = useTranslations("SideBarDashboard");

  const { isTransitioning, startTransition } = useTransition();
  const auth = useAuth();
  const { forceLogout } = auth;
  
  console.log("🔍 Auth context disponible:", auth);
  console.log("🔍 forceLogout disponible:", typeof forceLogout);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => {
      if (item.href === "/en/dashboard" && pathname === "/en/dashboard") {
        return true;
      }
      if (item.href === "/en" && (pathname === "/en" || pathname === "/en/")) {
        return true;
      }
      return pathname === item.href;
    });
    
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, activeIndex]);

  const handleItemClick = useCallback(async (index: number, href: string | null, disabled: boolean, isAction: boolean) => {
    if (disabled) return;
    
    console.log("Click - index:", index, "current:", activeIndex, "isAction:", isAction);
    
    // Si es una acción (como logout), no cambiar el activeIndex
    if (isAction) {
      if (index === 7) { // índice del logout
        console.log("🔄 Ejecutando forceLogout desde sidebar...");
        console.log("📍 Ubicación actual:", window.location.pathname);
        
        try {
          console.log("🚀 Llamando a forceLogout()...");
          forceLogout();
          console.log("✅ forceLogout() ejecutado exitosamente");
          
          // Esperar un poco para que se procese la limpieza
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Redirigir inmediatamente como hace el navbar
          console.log("🔄 Redirigiendo a página principal...");
          const locale = window.location.pathname.split("/")[1];
          console.log("🌍 Locale detectado:", locale);
          console.log("🎯 Redirigiendo a:", `/${locale}`);
          window.location.replace(`/${locale}`);
        } catch (error) {
          console.error("❌ Error en forceLogout del sidebar:", error);
          // Forzar redirección aunque falle
          const locale = window.location.pathname.split("/")[1];
          console.log("🌍 Locale detectado (fallback):", locale);
          console.log("🎯 Redirigiendo a (fallback):", `/${locale}`);
          window.location.replace(`/${locale}`);
        }
      }
      return;
    }
    
    if (index === activeIndex || isTransitioning) return;
    
    console.log("Setting activeIndex to:", index);
    setClickedIndex(index);
    
    try {
      if (href) {
        await startTransition(href);
        setActiveIndex(index);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => {
        setClickedIndex(null);
      }, 300);
    }
  }, [activeIndex, isTransitioning, startTransition, forceLogout]);

  const handleMouseEnter = useCallback((index: number) => {
    if (!isTransitioning) {
      setHoveredIndex(index);
    }
  }, [isTransitioning]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setShowTooltip(null);
  }, []);

  return (
    <div className="sidebar-navigation bg-gradient-to-b from-teal-dark via-teal-medium to-teal text-white h-full relative overflow-hidden z-20">
      <div className="relative h-full py-6">
        <nav className="relative px-4">
          <ul className="space-y-1 relative">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex;
              const isClicked = index === clickedIndex;
              const isDisabled = item.disabled || isTransitioning;
              
              const handleMouseEnter = () => {
                if (!isTransitioning) {
                  setHoveredIndex(index);
                  if (item.disabled) {
                    setTimeout(() => setShowTooltip(index), 500);
                  }
                }
              };
              
              return (
                <li key={item.nameKey} className="relative z-10">
                  <button
                    onClick={() => handleItemClick(index, item.href, item.disabled, item.isAction)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ease-out relative w-full text-left h-14 group
                      ${isActive
                        ? "bg-white/20 backdrop-blur-sm font-semibold shadow-lg transform translate-x-2 border border-white/30"
                        : "bg-transparent text-white hover:bg-white/10 hover:transform hover:translate-x-1"
                      }
                      ${isClicked ? "scale-95" : ""}
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    disabled={isDisabled}
                  >
                    <div className="relative">
                      <Icon
                        className={`text-xl transition-all duration-300 flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : isHovered
                              ? "text-white scale-110"
                              : item.disabled
                                ? "text-gray-400"
                                : "text-white"
                        }`}
                      />
                    </div>
                    
                    <span
                      className={`text-sm transition-all duration-300 leading-none ${
                        isActive
                          ? "font-semibold text-white"
                          : item.disabled
                            ? "font-medium text-gray-400"
                            : "font-medium text-white"
                      }`}
                    >
                      {t(item.nameKey)}
                    </span>
                    
                    {isActive && (
                      <div className="absolute right-4 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                    )}
                    
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      isHovered && !isActive ? "bg-white/5" : ""
                    }`} />
                  </button>
                  
                  {showTooltip === index && item.disabled && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                      <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm border border-white/20">
                        {t("comingSoon")}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-b border-white/20"></div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-6 left-4 right-4">
          <div className="h-px bg-white opacity-20" />
          <div className="mt-4 text-center">
            <p className="text-xs text-white opacity-40 font-medium">Dashboard v2.0</p>
          </div>
        </div>
      </div>
      

      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
});

SideBarDashboard.displayName = 'SideBarDashboard';

export default SideBarDashboard; 