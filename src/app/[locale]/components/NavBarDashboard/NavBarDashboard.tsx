"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { capitalizeFirstLetter } from "../../../../../src/utils/stringUtils";
import { useAuth } from "../../context/Auth_Context";
import {
  PiListBold,
  PiXBold,
  PiUser,
  PiHouse,
  PiArrowsClockwise,
  PiFire,
  PiQuestion,
  PiGear,
  PiSignOut,
  PiGift
} from "react-icons/pi";
import { usePathname } from "next/navigation";
import LanguageSelect from "../Navbar/LanguageSelect";
import { useTransition } from "../../context/Transition_Context";
import Wallet_Connect_Banner from "../Wallet/Wallet_Connect_Banner";
import Wallet_Status from "../Wallet/Wallet_Status";
import { BACKEND_CONFIG } from "../../../../utils/backendConfig";

const NavBarDashboard = () => {
  const t = useTranslations("Navbar");
  const sidebarT = useTranslations("SideBarDashboard");
  const claimT = useTranslations("ClaimOMs");
  const { user, logout, setUser, clearAuthState, forceLogout } = useAuth();
  const { isTransitioning, startTransition } = useTransition();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const menuItems = useMemo(() => [
    { nameKey: "inicio", href: `/${locale}/dashboard`, icon: PiHouse, iconType: 'react-icon', disabled: false, isModal: false },
    { nameKey: "claimOms", href: "#", icon: PiGift, iconType: 'react-icon', disabled: false, isModal: true },
    { nameKey: "intercambiar", href: `/${locale}/dashboard/exchange`, icon: PiArrowsClockwise, iconType: 'react-icon', disabled: true, isModal: false },
    { nameKey: "quemarToken", href: `/${locale}/dashboard/quemar-token`, icon: PiFire, iconType: 'react-icon', disabled: true, isModal: false },
    { nameKey: "compensar", href: `/${locale}/dashboard/compensar`, icon: "/assets/images/icons/Compensate_icon.svg", iconType: 'svg', disabled: true, isModal: false },
    { nameKey: "ayuda", href: `/${locale}/dashboard/ayuda`, icon: PiQuestion, iconType: 'react-icon', disabled: true, isModal: false },
    { nameKey: "configuracion", href: `/${locale}/dashboard/configuracion`, icon: PiGear, iconType: 'react-icon', disabled: true, isModal: false },
  ], [locale]);

  useEffect(() => {
    if (mobileNavOpen && !pathname.includes('/dashboard')) {
      setMobileNavOpen(false);
    }
  }, [pathname, mobileNavOpen]);

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

  const handleItemClick = useCallback(async (index: number, href: string, disabled: boolean, isModal: boolean) => {
    setMobileNavOpen(false);

    if (disabled || isTransitioning) return;

    if (isModal) {
      setIsClaimModalOpen(true);
      return;
    }

    try {
      await startTransition(href);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [isTransitioning, startTransition]);

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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (mobileNavOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
      setMobileNavOpen(false);
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (mobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mobileNavOpen, handleClickOutside]);

  const handleLogout = async () => {
    console.log("🔄 Iniciando logout desde navbar...");
    
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("hasEnteredBefore", "true");
        sessionStorage.setItem("forceLogout", "true");
      }
      forceLogout();
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = `/${locale}#home`;
    } catch (error) {
      console.error("❌ Error en logout:", error);
      window.location.href = `/${locale}#home`;
    }
  };

  const navContent = (
    <nav className={`h-16 backdrop-blur-sm border-b border-white/10 z-50 transition-colors duration-200 flex-shrink-0 ${
      mobileNavOpen ? 'bg-teal-dark/95' : 'bg-teal-dark/10'
    }`}>
      
      <div className="flex items-center justify-between h-full px-4 lg:px-6 relative">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/logo.png"
              alt="Oxygen"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-4">
          <Wallet_Connect_Banner />
          <Wallet_Status />
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <PiUser className="text-white text-sm" />
                </div>
                <span className="text-white text-sm font-medium">
                  {capitalizeFirstLetter(user.username.split(' ')[0])}
                </span>
                <div className="h-6 w-px bg-white/20" />
                <LanguageSelect className="text-white" />
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>

        <button
          className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors mobile-menu-button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? (
            <PiXBold className="text-xl text-white" />
          ) : (
            <PiListBold className="text-xl text-white" />
          )}
        </button>
      </div>

      <div className={`lg:hidden absolute top-16 left-0 right-0 bg-teal-dark/95 border-b border-white/10 transition-transform duration-200 ease-out z-40 mobile-menu ${
        mobileNavOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-[-100%] pointer-events-none'
      }`}>
          <div className="px-4 py-6">
            <div className="mb-4 space-y-3 flex flex-col items-center">
              <Wallet_Connect_Banner />
              <Wallet_Status />
            </div>
            {user ? (
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <PiUser className="text-white text-sm" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {capitalizeFirstLetter(user.username.split(' ')[0])}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LanguageSelect className="text-white" />
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.iconType === 'react-icon' ? item.icon : null;
                    const iconSrc = item.iconType === 'svg' && typeof item.icon === 'string' ? item.icon : null;
                    const isActive = (item.href === `/${locale}/dashboard` && pathname === `/${locale}/dashboard`) || pathname === item.href;
                    const isDisabled = item.disabled || isTransitioning;
                    
                    return (
                      <button
                        key={item.nameKey}
                        onClick={() => handleItemClick(index, item.href, item.disabled, item.isModal)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group
                          ${isActive && !item.isModal
                            ? "bg-white/20 font-semibold shadow-lg border border-white/30"
                            : "bg-transparent text-white hover:bg-white/10"
                          }
                          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        disabled={isDisabled}
                      >
                        <div className="relative w-5 h-5 flex-shrink-0">
                          {iconSrc ? (
                            <Image
                              src={iconSrc}
                              alt={item.nameKey}
                              width={20}
                              height={20}
                              className={`w-5 h-5 transition-all duration-300 brightness-0 invert ${
                                isActive
                                  ? "opacity-100"
                                  : isDisabled
                                    ? "opacity-50 brightness-0 invert"
                                    : "opacity-100"
                              }`}
                            />
                          ) : Icon ? (
                            <Icon
                              className={`text-xl flex-shrink-0 ${
                                isActive
                                  ? "text-white"
                                  : item.disabled
                                    ? "text-gray-400"
                                    : "text-white"
                              }`}
                            />
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-sm ${
                              isActive
                                ? "font-semibold text-white"
                                : item.disabled
                                  ? "font-medium text-gray-400"
                                  : "font-medium text-white"
                            }`}
                          >
                            {sidebarT(item.nameKey)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group bg-transparent text-white hover:bg-red-500/20 border-t border-white/10 pt-4 mt-4"
                >
                  <PiSignOut className="text-xl flex-shrink-0 text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    {t("logout")}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <LanguageSelect className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

    </nav>
  );

  const claimModal = isClaimModalOpen && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${
          isClaimModalClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
        }`}
        onClick={handleCloseClaimModal}
      />

      {/* Modal Content */}
      <div className={`relative bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 ${
        isClaimModalClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'
      }`}>
        {/* Close button */}
        <button
          onClick={handleCloseClaimModal}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
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
    </div>,
    document.body
  ) : null;

  return (
    <>
      {navContent}
      {claimModal}
    </>
  );
};

export default NavBarDashboard; 