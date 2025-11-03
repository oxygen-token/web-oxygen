"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
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
  PiSignOut
} from "react-icons/pi";
import { usePathname } from "next/navigation";
import LanguageSelect from "../Navbar/LanguageSelect";
import { useTransition } from "../../context/Transition_Context";
import Wallet_Connect_Banner from "../Wallet/Wallet_Connect_Banner";
import Wallet_Status from "../Wallet/Wallet_Status";

const NavBarDashboard = () => {
  const t = useTranslations("Navbar");
  const sidebarT = useTranslations("SideBarDashboard");
  const { user, logout, setUser, clearAuthState, forceLogout } = useAuth();
  const { isTransitioning, startTransition } = useTransition();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const menuItems = useMemo(() => [
    { nameKey: "inicio", href: `/${locale}/dashboard`, icon: PiHouse, iconType: 'react-icon', disabled: false },
    { nameKey: "intercambiar", href: `/${locale}/dashboard/exchange`, icon: PiArrowsClockwise, iconType: 'react-icon', disabled: false },
    { nameKey: "quemarToken", href: `/${locale}/dashboard/quemar-token`, icon: PiFire, iconType: 'react-icon', disabled: false },
    { nameKey: "compensar", href: `/${locale}/dashboard/compensar`, icon: "/assets/images/icons/Compensate_icon.svg", iconType: 'svg', disabled: false },
    { nameKey: "ayuda", href: `/${locale}/dashboard/ayuda`, icon: PiQuestion, iconType: 'react-icon', disabled: false },
    { nameKey: "configuracion", href: `/${locale}/dashboard/configuracion`, icon: PiGear, iconType: 'react-icon', disabled: false },
  ], [locale]);

  useEffect(() => {
    if (mobileNavOpen && !pathname.includes('/dashboard')) {
      setMobileNavOpen(false);
    }
  }, [pathname, mobileNavOpen]);

  const handleItemClick = useCallback(async (index: number, href: string, disabled: boolean) => {
    setMobileNavOpen(false);
    
    if (disabled || isTransitioning) return;
    
    try {
      await startTransition(href);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [isTransitioning, startTransition]);

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
      // Usar forceLogout para asegurar que se limpie todo
      forceLogout();
      
      // Esperar un poco para que se procese la limpieza
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirigir inmediatamente
      console.log("🔄 Redirigiendo a página principal...");
      window.location.replace(`/${locale}`);
    } catch (error) {
      console.error("❌ Error en logout:", error);
      // Forzar redirección aunque falle
      window.location.replace(`/${locale}`);
    }
  };

  return (
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
            <div className="mb-4 space-y-3">
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
                        onClick={() => handleItemClick(index, item.href, item.disabled)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group
                          ${isActive
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
};

export default NavBarDashboard; 