"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { capitalizeFirstLetter } from "../../../../utils/stringUtils";
import { useAuth } from "../../context/Auth_Context";
import LanguageSelect from "./LanguageSelect";
import { usePathname } from "next/navigation";
import Card_Nav from "./Card_Nav";

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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  if (isDashboardPage) return null;

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
              <li>
                <Link
                  href="/login?panel=register"
                  className="border border-current px-3 py-1 rounded-full hover:bg-teal-medium/20 transition-colors duration-200"
                >
                  {t("waitlist")}
                </Link>
              </li>
            </>
          )}
          <LanguageSelect />
        </ul>
      </nav>
      
      <div className="block lg:hidden">
        <Card_Nav />
      </div>
    </>
  );
}

export default Navbar;
