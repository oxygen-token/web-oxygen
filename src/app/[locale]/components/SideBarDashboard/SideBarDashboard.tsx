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
  PiSignOut,
  PiGift,
  PiXBold
} from "react-icons/pi";
import { useTransition } from "../../context/Transition_Context";
import { useAuth } from "../../context/Auth_Context";
import { BACKEND_CONFIG } from "../../../../utils/backendConfig";

interface MenuItem {
  nameKey: string;
  href: string | null;
  icon: any;
  iconType?: 'react-icon' | 'svg';
  disabled: boolean;
  isAction: boolean;
  isModal?: boolean;
}

const menuItems: MenuItem[] = [
  { nameKey: "inicio", href: "/en/dashboard", icon: PiHouse, iconType: 'react-icon', disabled: false, isAction: false, isModal: false },
  { nameKey: "claimOms", href: null, icon: PiGift, iconType: 'react-icon', disabled: false, isAction: false, isModal: true },
  { nameKey: "intercambiar", href: "/en/dashboard/exchange", icon: "/assets/images/icons/Change_icon.svg", iconType: 'svg', disabled: true, isAction: false, isModal: false },
  { nameKey: "quemarToken", href: "/en/dashboard/quemar-token", icon: "/assets/images/icons/Burn_icon.svg", iconType: 'svg', disabled: true, isAction: false, isModal: false },
  { nameKey: "compensar", href: "/en/dashboard/compensar", icon: "/assets/images/icons/Compensate_icon.svg", iconType: 'svg', disabled: true, isAction: false, isModal: false },
  { nameKey: "ayuda", href: "/en/dashboard/ayuda", icon: PiQuestion, iconType: 'react-icon', disabled: true, isAction: false, isModal: false },
  { nameKey: "configuracion", href: "/en/dashboard/configuracion", icon: PiGear, iconType: 'react-icon', disabled: true, isAction: false, isModal: false },
  { nameKey: "cerrarSesion", href: null, icon: PiSignOut, iconType: 'react-icon', disabled: false, isAction: true, isModal: false },
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
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaimModalClosing, setIsClaimModalClosing] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const [verifiedCodeData, setVerifiedCodeData] = useState<{ omAmount: number; type: string; description?: string } | null>(null);
  const [claimStep, setClaimStep] = useState<'input' | 'confirm'>('input');
  const [animatedOmCount, setAnimatedOmCount] = useState(0);
  const t = useTranslations("SideBarDashboard");
  const claimT = useTranslations("ClaimOMs");

  const { isTransitioning, startTransition } = useTransition();
  const auth = useAuth();
  const { logout, forceLogout, user, setUser } = auth;

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

  // Animate OM count when entering confirm step
  useEffect(() => {
    if (claimStep === 'confirm' && verifiedCodeData) {
      const targetAmount = verifiedCodeData.omAmount;
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = targetAmount / steps;
      const stepDuration = duration / steps;

      setAnimatedOmCount(0);
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedOmCount(targetAmount);
          clearInterval(timer);
        } else {
          setAnimatedOmCount(Math.round(increment * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setAnimatedOmCount(0);
    }
  }, [claimStep, verifiedCodeData]);

  const handleItemClick = useCallback(async (index: number, href: string | null, disabled: boolean, isAction: boolean, isModal?: boolean) => {
    if (disabled) return;

    if (isModal) {
      setIsClaimModalOpen(true);
      return;
    }

    if (isAction) {
      const item = dynamicMenuItems[index];
      if (item && item.nameKey === "cerrarSesion") {
        try {
          // Llamar al backend para invalidar la sesión y limpiar cookies
          await logout();
          const locale = window.location.pathname.split("/")[1];
          window.location.href = `/${locale}#home`;
        } catch (error) {
          console.error("Logout error:", error);
          // Si falla el logout del backend, forzar limpieza local
          forceLogout();
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
  }, [activeIndex, isTransitioning, startTransition, logout, forceLogout, dynamicMenuItems]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!claimCode.trim()) {
      setClaimError(claimT("error-empty"));
      return;
    }

    setIsClaimLoading(true);
    setClaimError("");

    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/verify-reload-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: claimCode.trim() }),
      });

      const result = await response.json();

      if (!result.success || !result.valid) {
        if (result.message?.includes("not found")) {
          setClaimError(claimT("error-not-found"));
        } else if (result.message?.includes("already used")) {
          setClaimError(claimT("error-already-used"));
        } else if (result.message?.includes("expired")) {
          setClaimError(claimT("error-expired"));
        } else {
          setClaimError(claimT("error-generic"));
        }
        return;
      }

      setVerifiedCodeData(result.data);
      setClaimStep('confirm');

    } catch (err) {
      console.error("Verify code error:", err);
      setClaimError(claimT("error-generic"));
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleRedeemCode = async () => {
    setIsClaimLoading(true);
    setClaimError("");

    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/redeem-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: claimCode.trim() }),
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) {
        setClaimError(claimT("error-generic"));
        setClaimStep('input');
        return;
      }

      if (result.data?.newBalance !== undefined && user) {
        setUser({
          ...user,
          omBalance: result.data.newBalance,
        });
      }

      setClaimedAmount(result.data?.omAmount || verifiedCodeData?.omAmount || 0);
      setClaimSuccess(true);

      setTimeout(() => {
        handleCloseClaimModal();
      }, 3000);

    } catch (err) {
      console.error("Redeem code error:", err);
      setClaimError(claimT("error-generic"));
      setClaimStep('input');
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleCloseClaimModal = () => {
    setIsClaimModalClosing(true);
    setTimeout(() => {
      setIsClaimModalOpen(false);
      setIsClaimModalClosing(false);
      setClaimCode("");
      setClaimError("");
      setClaimSuccess(false);
      setVerifiedCodeData(null);
      setClaimStep('input');
    }, 200);
  };

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
                       onClick={() => handleItemClick(index, item.href, item.disabled, item.isAction, item.isModal)}
                       onMouseEnter={handleMouseEnter}
                       onMouseLeave={handleMouseLeave}
                       className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 ease-out relative w-full text-left h-14 group z-10
                         ${item.nameKey === "cerrarSesion"
                           ? isHovered
                             ? "text-white transform translate-x-1"
                             : "text-white"
                           : isActive && !item.isModal
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

      {/* Claim OMs Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
              isClaimModalClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
            }`}
            onClick={handleCloseClaimModal}
          />

          {/* Modal Content */}
          <div className={`relative bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/20 ${
            isClaimModalClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'
          }`}>
            {/* Close button */}
            <button
              onClick={handleCloseClaimModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <PiXBold className="text-xl" />
            </button>

            {claimSuccess ? (
              /* Success State */
              <div className="flex flex-col items-center gap-4 py-4 animate-claim-state-in">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 animate-success-bounce bg-gradient-to-br from-green-400 to-teal-500 shadow-lg shadow-green-500/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">{claimT("success-title")}</h2>
                <p className="text-white/80 text-center">
                  {claimT("success-message", { amount: claimedAmount })}
                </p>
              </div>
            ) : claimStep === 'confirm' && verifiedCodeData ? (
              /* Confirm State - Preview */
              <div className="flex flex-col items-center gap-6 py-4 animate-claim-state-in">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-white mb-2">{claimT("confirm-title")}</h2>
                  <p className="text-sm text-white/60">{claimT("confirm-subtitle")}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 w-full text-center border border-white/20 animate-om-reveal">
                  <p className="text-4xl font-bold text-white mb-2 tabular-nums">
                    +{animatedOmCount} OMs
                  </p>
                  {verifiedCodeData.description && (
                    <p className="text-sm text-white/60 animate-fade-in-delayed">{verifiedCodeData.description}</p>
                  )}
                </div>

                {claimError && (
                  <p className="text-red-400 text-sm text-center">{claimError}</p>
                )}

                <div className="flex gap-3 w-full animate-fade-in-delayed">
                  <button
                    type="button"
                    onClick={() => { setClaimStep('input'); setVerifiedCodeData(null); }}
                    disabled={isClaimLoading}
                    className="flex-1 px-4 py-3 text-base font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 transition-all duration-300"
                  >
                    {claimT("back")}
                  </button>
                  <button
                    type="button"
                    onClick={handleRedeemCode}
                    disabled={isClaimLoading}
                    className="flex-1 px-4 py-3 text-base font-medium bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isClaimLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{claimT("confirming")}</span>
                      </div>
                    ) : (
                      claimT("confirm")
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Input State */
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white text-center">{claimT("title")}</h2>
                  <p className="text-sm text-white/60 text-center">{claimT("subtitle")}</p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={claimCode}
                      onChange={(e) => setClaimCode(e.target.value)}
                      placeholder={claimT("code-placeholder")}
                      className="claim-input w-full px-4 py-4 rounded-lg font-medium text-lg transition-all tracking-wider shadow-md"
                      disabled={isClaimLoading}
                      autoFocus
                    />
                    {claimCode.trim() && !claimError && (
                      <button
                        type="submit"
                        disabled={isClaimLoading}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium transition-all duration-300 ${
                          isClaimLoading
                            ? "text-teal-accent cursor-not-allowed"
                            : "text-teal-accent hover:text-teal-dark"
                        }`}
                      >
                        {isClaimLoading ? "verifying..." : "verify"}
                      </button>
                    )}
                  </div>

                  {claimError && (
                    <p className="text-red-400 text-sm text-center">{claimError}</p>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isClaimLoading || !claimCode.trim()}
                      className="px-8 py-3 text-base font-medium bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isClaimLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{claimT("verifying")}</span>
                        </div>
                      ) : (
                        claimT("verify")
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}


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