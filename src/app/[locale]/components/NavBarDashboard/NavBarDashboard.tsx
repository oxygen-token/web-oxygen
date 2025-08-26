"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { capitalizeFirstLetter } from "../../../../../src/utils/stringUtils";
import { useAuth } from "../../context/Auth_Context";
import { PiListBold, PiXBold, PiBell, PiUser } from "react-icons/pi";
import { usePathname } from "next/navigation";

const NavBarDashboard = () => {
  const t = useTranslations("Navbar");
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-teal-dark/95 backdrop-blur-md border-b border-white/10 z-50">
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
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <PiBell className="text-xl text-white" />
            </button>
            <div className="h-6 w-px bg-white/20" />
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <PiUser className="text-white text-sm" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {capitalizeFirstLetter(user.username)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-colors"
                >
                  {t("logout")}
                </button>
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
          className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? (
            <PiXBold className="text-xl text-white" />
          ) : (
            <PiListBold className="text-xl text-white" />
          )}
        </button>
      </div>

      {mobileNavOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-teal-dark/95 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-4 space-y-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <PiUser className="text-white text-sm" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {capitalizeFirstLetter(user.username)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 text-sm border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors text-center"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBarDashboard; 