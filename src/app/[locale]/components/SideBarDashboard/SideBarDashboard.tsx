"use client";
import { memo, useCallback, useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  PiHouse, 
  PiCurrencyDollar, 
  PiQuestion, 
  PiGear, 
  PiSignOut 
} from "react-icons/pi";
import { useTransition } from "../../context/Transition_Context";
import { useAuth } from "../../context/Auth_Context";

interface MenuItem {
  nameKey: string;
  href: string | null;
  icon: any;
  iconType?: 'react-icon' | 'svg';
  disabled: boolean;
  isAction: boolean;
}

const menuItems: MenuItem[] = [
  { nameKey: "inicio", href: "/en/dashboard", icon: PiHouse, iconType: 'react-icon', disabled: false, isAction: false },
  { nameKey: "intercambiar", href: "/en/dashboard/exchange", icon: "/assets/images/icons/Change_icon.svg", iconType: 'svg', disabled: false, isAction: false },
  { nameKey: "quemarToken", href: "/en/dashboard/quemar-token", icon: "/assets/images/icons/Burn_icon.svg", iconType: 'svg', disabled: false, isAction: false },
  { nameKey: "compensar", href: "/en/dashboard/compensar", icon: "/assets/images/icons/Compensate_icon.svg", iconType: 'svg', disabled: false, isAction: false },
  { nameKey: "ayuda", href: "/en/dashboard/ayuda", icon: PiQuestion, iconType: 'react-icon', disabled: false, isAction: false },
  { nameKey: "configuracion", href: "/en/dashboard/configuracion", icon: PiGear, iconType: 'react-icon', disabled: false, isAction: false },
  { nameKey: "cerrarSesion", href: null, icon: PiSignOut, iconType: 'react-icon', disabled: false, isAction: true },
];

const SideBarDashboard = memo(() => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  
  const dashboardPath = `/${locale}/dashboard`;
  
  const getInitialActiveIndex = () => {
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      if (!item.href) continue;
      
      const itemHref = item.href.replace("/en/", `/${locale}/`);
      
      if (itemHref === dashboardPath) {
        if (pathname === dashboardPath || pathname === `${dashboardPath}/`) {
          return i;
        }
        continue;
      }
      
      if (pathname === itemHref || pathname.startsWith(itemHref + "/")) {
        return i;
      }
    }
    return 0;
  };
  
  const [activeIndex, setActiveIndex] = useState(() => getInitialActiveIndex());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const t = useTranslations("SideBarDashboard");

  const { isTransitioning, startTransition } = useTransition();
  const auth = useAuth();
  const { forceLogout } = auth;

  const dynamicMenuItems = useMemo(() => menuItems.map(item => ({
    ...item,
    href: item.href ? item.href.replace("/en/", `/${locale}/`) : null
  })), [locale]);
  
  useEffect(() => {
    if (isTransitioning) {
      return;
    }
    
    const dashboardPath = `/${locale}/dashboard`;
    let exactMatchIndex = -1;
    let childRouteIndex = -1;
    let longestChildMatch = 0;
    
    for (let i = 0; i < dynamicMenuItems.length; i++) {
      const item = dynamicMenuItems[i];
      if (!item.href) continue;
      
      if (item.href === dashboardPath) {
        if (pathname === dashboardPath || pathname === `${dashboardPath}/`) {
          exactMatchIndex = i;
          break;
        }
        continue;
      }
      
      if (pathname === item.href) {
        exactMatchIndex = i;
        break;
      }
    }
    
    if (exactMatchIndex === -1) {
      for (let i = 0; i < dynamicMenuItems.length; i++) {
        const item = dynamicMenuItems[i];
        if (!item.href || item.href === dashboardPath) continue;
        
        if (pathname.startsWith(item.href + "/")) {
          if (item.href.length > longestChildMatch) {
            childRouteIndex = i;
            longestChildMatch = item.href.length;
          }
        }
      }
    }
    
    const currentIndex = exactMatchIndex !== -1 ? exactMatchIndex : childRouteIndex;
    
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, locale, dynamicMenuItems, isTransitioning]);
  

  const handleItemClick = useCallback(async (index: number, href: string | null, disabled: boolean, isAction: boolean) => {
    if (disabled) return;
    
    if (isAction) {
      const item = dynamicMenuItems[index];
      if (item && item.nameKey === "cerrarSesion") {
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem("hasEnteredBefore", "true");
            sessionStorage.setItem("forceLogout", "true");
          }
          forceLogout();
          await new Promise(resolve => setTimeout(resolve, 100));
          const locale = window.location.pathname.split("/")[1];
          window.location.href = `/${locale}#home`;
        } catch (error) {
          const locale = window.location.pathname.split("/")[1];
          window.location.href = `/${locale}#home`;
        }
      }
      return;
    }
    
    if (index === activeIndex || isTransitioning) {
      return;
    }
    
    setClickedIndex(index);
    
    try {
      if (href) {
        await startTransition(href);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => {
        setClickedIndex(null);
      }, 300);
    }
  }, [activeIndex, isTransitioning, startTransition, forceLogout, dynamicMenuItems]);

  const handleMouseEnter = useCallback((index: number) => {
    if (!isTransitioning && index !== activeIndex) {
      setHoveredIndex(index);
    }
  }, [isTransitioning, activeIndex]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setShowTooltip(null);
  }, []);

  return (
    <div className="sidebar-navigation bg-gradient-to-b from-teal-dark via-teal-medium to-teal text-white h-full relative overflow-y-auto z-20">
      <div className="relative h-full py-6">
        <nav className="relative px-4">
          <ul className="space-y-1 relative">
            {dynamicMenuItems.map((item, index) => {
              const Icon = item.iconType === 'react-icon' ? item.icon : null;
              const iconSrc = item.iconType === 'svg' ? item.icon : null;
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex;
              const isClicked = index === clickedIndex;
              const isDisabled = item.disabled || isTransitioning;
              
              const handleMouseEnter = () => {
                if (!isTransitioning && !isActive) {
                  setHoveredIndex(index);
                  if (item.disabled) {
                    setTimeout(() => setShowTooltip(index), 500);
                  }
                }
              };
              
                 return (
                   <li 
                     key={item.nameKey} 
                     className="relative z-10"
                   >
                     <button
                       onClick={() => handleItemClick(index, item.href, item.disabled, item.isAction)}
                       onMouseEnter={handleMouseEnter}
                       onMouseLeave={handleMouseLeave}
                       className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 ease-out relative w-full text-left h-14 group z-10
                         ${item.nameKey === "cerrarSesion"
                           ? isHovered
                             ? "text-white transform translate-x-1"
                             : "text-white"
                           : isActive
                           ? "bg-white/20 backdrop-blur-sm font-semibold text-white transform translate-x-2 border border-white/30 shadow-lg"
                           : isHovered && !isActive
                             ? "text-white transform translate-x-1"
                             : "text-white"
                         }
                         ${isClicked ? "scale-95" : ""}
                         ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                       `}
                       disabled={isDisabled}
                     >
                    <div className="relative w-5 h-5 flex-shrink-0">
                      {item.iconType === 'svg' && iconSrc ? (
                        <Image
                          src={iconSrc}
                          alt={item.nameKey}
                          width={20}
                          height={20}
                          className={`w-5 h-5 transition-all duration-300 brightness-0 invert ${
                            isActive
                              ? "opacity-100"
                              : isHovered
                                ? "opacity-100 scale-110"
                                : item.disabled
                                  ? "opacity-50 brightness-0 invert"
                                  : "opacity-100"
                          }`}
                        />
                      ) : Icon ? (
                        <Icon
                          className={`text-xl transition-all duration-300 ${
                            item.nameKey === "cerrarSesion"
                              ? isHovered
                                ? "text-white scale-110"
                                : "text-white"
                              : isActive
                              ? "text-white"
                              : isHovered
                                ? "text-white scale-110"
                                : item.disabled
                                  ? "text-gray-400"
                                  : "text-white"
                          }`}
                        />
                      ) : null}
                    </div>
                    
                    <span
                      className={`text-sm transition-all duration-300 leading-none ${
                        item.nameKey === "cerrarSesion"
                          ? isHovered
                            ? "font-medium text-white"
                            : "font-medium text-white"
                          : isActive
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