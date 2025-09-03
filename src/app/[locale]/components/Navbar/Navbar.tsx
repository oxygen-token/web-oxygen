"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { capitalizeFirstLetter } from "../../../../utils/stringUtils";
import { useAuth } from "../../context/Auth_Context";
import LanguageSelect from "./LanguageSelect";
import { usePathname } from "next/navigation";
import { PiListBold, PiXBold, PiUser, PiHouse, PiQuestion, PiGear, PiSignOut } from "react-icons/pi";

import logoNav from "../../../../../public/assets/images/logo.png";

const links = [
  { nameKey: "home", href: "/" },
  { nameKey: "us", href: "/nosotros" },
  { nameKey: "project", href: "/proyectos" },
  { nameKey: "community", href: "/blog" },
  { nameKey: "whitepaper", href: "/whitepaper" },
];

function Navbar() {
  const t = useTranslations("Navbar");
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isBlogPage = pathname.includes("/blog");
  const isDashboardPage = pathname.includes("/dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
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

  if (isDashboardPage) return null;

  const menuItems = [
    { nameKey: "home", href: "/", icon: PiHouse, disabled: false },
    { nameKey: "us", href: "/nosotros", icon: PiUser, disabled: false },
    { nameKey: "project", href: "/proyectos", icon: PiQuestion, disabled: false },
    { nameKey: "community", href: "/blog", icon: PiGear, disabled: false },
    { nameKey: "whitepaper", href: "/whitepaper", icon: PiSignOut, disabled: false },
  ];

  return (
    <>
      <nav className={`hidden lg:flex fixed top-0 left-0 h-16 lg:h-[100px] lg:items-center lg w-full px-5 lg:px-20 flex-row items-center text-white backdrop-blur z-50 ${isBlogPage ? 'navbar-transparent' : 'bg-teal-dark/40'}`}>
        <Link href="/" className="flex items-center">
          <Image
            src={logoNav}
            alt="Oxygen"
            className="max-w-[150px] lg:max-w-[200px] object-cover"
          />
        </Link>

        <ul className="hidden lg:flex lg:items-center flex-row ml-auto gap-8">
          {links.map((link) => (
            <li key={link.nameKey}>
              <Link href={link.href} className="hover:underline">
                {t(link.nameKey)}
              </Link>
            </li>
          ))}
          {user ? (
            <li className="flex items-center gap-4">
              <Link
                href={`/${locale}/dashboard`}
                className="border border-teal-400 px-3 py-1 rounded-full text-teal-400 hover:bg-teal-400 hover:text-white transition-colors duration-200"
              >
                {t("dashboard")}
              </Link>
              <span className="border border-current px-3 py-1 rounded-full">
                {t("helloUser", { username: capitalizeFirstLetter(user.username) })}
              </span>
              <button
                onClick={handleLogout}
                className="border border-red-500 px-3 py-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                {t("logout")}
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login?panel=login"
                  className="border border-current px-3 py-1 rounded-full hover:bg-teal-medium/20 transition-colors duration-200"
                >
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link
                  href="/comprar"
                  className="border border-current px-3 py-1 rounded-full hover:bg-teal-medium/20 transition-colors duration-200"
                >
                  {t("buy")}
                </Link>
              </li>
            </>
          )}
          <LanguageSelect />
        </ul>
      </nav>
      
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-teal-dark/95 backdrop-blur-md border-b border-white/10 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="flex items-center">
            <Image
              src={logoNav}
              alt="Oxygen"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors mobile-menu-button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? (
              <PiXBold className="text-xl text-white" />
            ) : (
              <PiListBold className="text-xl text-white" />
            )}
          </button>
        </div>

        <div className={`fixed top-16 left-0 right-0 bg-teal-dark/95 border-b border-white/10 transition-transform duration-200 ease-out z-40 mobile-menu ${
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
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-xs border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-colors"
                    >
                      {t("logout")}
                    </button>
                    <LanguageSelect className="text-white" />
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.nameKey}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group bg-transparent text-white hover:bg-white/10 cursor-pointer"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Icon className="text-xl flex-shrink-0 text-white" />
                        <span className="text-sm font-medium text-white">
                          {t(item.nameKey)}
                        </span>
                      </Link>
                    );
                  })}
                  <Link
                    href={`/${locale}/dashboard`}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group bg-transparent text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <PiHouse className="text-xl flex-shrink-0 text-white" />
                    <span className="text-sm font-medium text-white">
                      {t("dashboard")}
                    </span>
                  </Link>
                </nav>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/login?panel=login"
                    className="px-4 py-2 text-sm border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <LanguageSelect className="text-white" />
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.nameKey}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group bg-transparent text-white hover:bg-white/10 cursor-pointer"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Icon className="text-xl flex-shrink-0 text-white" />
                        <span className="text-sm font-medium text-white">
                          {t(item.nameKey)}
                        </span>
                      </Link>
                    );
                  })}
                  <Link
                    href="/comprar"
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 w-full text-left group bg-transparent text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <PiGear className="text-xl flex-shrink-0 text-white" />
                    <span className="text-sm font-medium text-white">
                      {t("buy")}
                    </span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
