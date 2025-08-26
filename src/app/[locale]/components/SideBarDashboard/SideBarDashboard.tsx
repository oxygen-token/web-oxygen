"use client";
import { memo, useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { 
  PiHouse, 
  PiArrowsClockwise, 
  PiFire, 
  PiCurrencyDollar, 
  PiQuestion, 
  PiGear, 
  PiSignOut 
} from "react-icons/pi";
import { useSidebarSync } from "../../hooks/useSidebarSync";
import { useTransition } from "../../context/Transition_Context";

const menuItems = [
  { nameKey: "inicio", href: "/en/dashboard", icon: PiHouse, disabled: false },
  { nameKey: "intercambiar", href: "/en/dashboard/intercambiar", icon: PiArrowsClockwise, disabled: true },
  { nameKey: "quemarToken", href: "/en/dashboard/quemar-token", icon: PiFire, disabled: true },
  { nameKey: "compensar", href: "/en/dashboard/compensar", icon: PiCurrencyDollar, disabled: true },
  { nameKey: "ayuda", href: "/en/dashboard/ayuda", icon: PiQuestion, disabled: true },
  { nameKey: "configuracion", href: "/en/dashboard/configuracion", icon: PiGear, disabled: true },
  { nameKey: "cerrarSesion", href: "/logout", icon: PiSignOut, disabled: false },
];

const SideBarDashboard = memo(() => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const { isTransitioning, startTransition } = useTransition();

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => {
      if (item.href === "/en/dashboard" && pathname === "/en/dashboard") {
        return true;
      }
      return pathname === item.href;
    });
    
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, activeIndex]);

  const handleItemClick = useCallback(async (index: number, href: string, disabled: boolean) => {
    if (disabled) return;
    
    console.log("Click - index:", index, "current:", activeIndex);
    if (index === activeIndex || isTransitioning) return;
    
    console.log("Setting activeIndex to:", index);
    setClickedIndex(index);
    
    try {
      await startTransition(href);
      setActiveIndex(index);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => {
        setClickedIndex(null);
      }, 300);
    }
  }, [activeIndex, isTransitioning, startTransition]);

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
    <div className="sidebar-navigation bg-gradient-to-b from-teal-dark via-teal-medium to-teal text-white h-full relative overflow-hidden">
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
                    onClick={() => handleItemClick(index, item.href, item.disabled)}
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
                      {item.nameKey === "inicio" ? "Home" : 
                       item.nameKey === "intercambiar" ? "Exchange" :
                       item.nameKey === "quemarToken" ? "Burn Token" :
                       item.nameKey === "compensar" ? "Offset" :
                       item.nameKey === "ayuda" ? "Help" :
                       item.nameKey === "configuracion" ? "Settings" :
                       item.nameKey === "cerrarSesion" ? "Log Out" : item.nameKey}
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
                        Pronto podrás acceder a esta opción
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