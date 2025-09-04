"use client";
import { useState, useCallback, useEffect } from "react";
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
  PiCurrencyDollar, 
  PiQuestion, 
  PiGear, 
  PiSignOut
} from "react-icons/pi";
import { usePathname } from "next/navigation";
import LanguageSelect from "../Navbar/LanguageSelect";
import { useTransition } from "../../context/Transition_Context";

const NavBarDashboard = () => {
  const t = useTranslations("Navbar");
  const sidebarT = useTranslations("SideBarDashboard");
  const { user, logout, setUser, clearAuthState, forceLogout } = useAuth();
  const { isTransitioning, startTransition } = useTransition();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const menuItems = [
    { nameKey: "inicio", href: `/${locale}/dashboard`, icon: PiHouse, disabled: false },
    { nameKey: "intercambiar", href: `/${locale}/dashboard/intercambiar`, icon: PiArrowsClockwise, disabled: true },
    { nameKey: "quemarToken", href: `/${locale}/dashboard/quemar-token`, icon: PiFire, disabled: true },
    { nameKey: "compensar", href: `/${locale}/dashboard/compensar`, icon: PiCurrencyDollar, disabled: true },
    { nameKey: "ayuda", href: `/${locale}/dashboard/ayuda`, icon: PiQuestion, disabled: true },
    { nameKey: "configuracion", href: `/${locale}/dashboard/configuracion`, icon: PiGear, disabled: true },
  ];

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => {
      if (item.href === `/${locale}/dashboard` && pathname === `/${locale}/dashboard`) {
        return true;
      }
      return pathname === item.href;
    });
    
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, activeIndex, locale]);

  useEffect(() => {
    if (mobileNavOpen && !pathname.includes('/dashboard')) {
      setMobileNavOpen(false);
    }
  }, [pathname, mobileNavOpen]);

  const handleItemClick = useCallback(async (index: number, href: string, disabled: boolean) => {
    setMobileNavOpen(false);
    
    if (disabled) return;
    
    if (index === activeIndex || isTransitioning) return;
    
    setActiveIndex(index);
    
    try {
      await startTransition(href);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [activeIndex, isTransitioning, startTransition]);

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
    <nav className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-white/10 z-50 transition-colors duration-200 ${
      mobileNavOpen ? 'bg-teal-dark/95' : 'bg-teal-dark/20'
    }`}>
      
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
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
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-colors"
                >
                  {t("logout")}
                </button>
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

      <div className={`lg:hidden fixed top-16 left-0 right-0 bg-teal-dark/95 border-b border-white/10 transition-transform duration-200 ease-out z-40 mobile-menu ${
        mobileNavOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-[-100%] pointer-events-none'
      }`}>
          <div className="px-4 py-6">
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
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-xs border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-colors"
                    >
                      {t("logout")}
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LanguageSelect className="text-white" />
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
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
                        <Icon
                          className={`text-xl flex-shrink-0 ${
                            isActive
                              ? "text-white"
                              : item.disabled
                                ? "text-gray-400"
                                : "text-white"
                          }`}
                        />
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
                          {item.nameKey !== "inicio" && (
                            <span className="text-xs text-gray-500 opacity-60 font-light">
                              {locale === "es" ? "Próximamente" : "Coming soon"}
                            </span>
                          )}
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