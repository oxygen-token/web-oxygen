"use client";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { get, post } from "../../../../../src/utils/request";
import { capitalizeFirstLetter } from "../../../../../src/utils/stringUtils";
import { useRouter, usePathname } from "next/navigation";

import logoNav from "../../../../../public/assets/images/logo.png";
import logoArg from "../../../../../public/assets/logos/logoArg.png";
import logoUs from "../../../../../public/assets/logos/logoUs.png";

import { PiGlobe, PiListBold, PiXBold } from "react-icons/pi";

const links = [
  {
    nameKey: "home",
    href: "/",
  },
  {
    nameKey: "us",
    href: "/nosotros",
  },
  {
    nameKey: "project",
    href: "/proyectos",
  },
  {
    nameKey: "calculator",
    href: "/calculadora",
  },
  {
    nameKey: "whitepaper",
    href: "/whitepaper",
  },
] as const;

function LanguageSelect({ className }: { className: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Extrae el locale actual y la ruta sin el prefijo de idioma
  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "");

  const handleChangeLang = (lang: string) => {
    // Navega a la misma ruta pero con el nuevo locale
    router.replace(`/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`);
  };

  return (
    <div className={cn("relative p-4 flex flex-row items-center group", className)}>
      <button className="text-2xl">
        <PiGlobe />
      </button>
      <div className="hidden group-hover:block absolute top-10 left-4 bg-teal-dark/70 backdrop-blur rounded-xs p-1 z-10 overflow-hidden">
        <button className="hover:bg-teal-dark block" onClick={() => handleChangeLang('es')}>
          <Image src={logoArg} alt="bandera argentina" className="max-w-8" />
        </button>
        <button className="hover:bg-teal-dark block" onClick={() => handleChangeLang('en')}>
          <Image src={logoUs} alt="bandera usa" className="max-w-8" />
        </button>
      </div>
    </div>
  );
}

function Navbar() {
  const t = useTranslations("Navbar");
  const [username, setUsername] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await get("/session");
        const data = await res.json();
        if (data.loggedIn) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await post("/logout", { credentials: "include" });
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUsername(null);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  const toggleMobileNav = () => {
    const nav = mobileNavRef.current;
    if (!nav) return;
    if (nav.style.display === "none") {
      nav.style.removeProperty("display");
    } else {
      nav.style.setProperty("display", "none");
    }
  };

  return (
    <nav className="fixed top-0 left-0 h-16 lg:h-[100px] lg:items-center lg w-full px-5 lg:px-20 flex flex-row items-center bg-teal-dark/40 text-white backdrop-blur z-50">
      <Link href="/" className="flex items-center">
        <Image
          src={logoNav}
          alt="Oxygen"
          className="max-w-[150px] lg:max-w-[200px] object-cover"
        />
      </Link>

      <ul className="hidden lg:flex lg:items-center flex-row ml-auto gap-16">
        {links.map((link) => (
          <li key={link.nameKey}>
            <Link href={link.href} className="hover:underline">
              {t(link.nameKey)}
            </Link>
          </li>
        ))}
        {username ? (
          <li className="flex items-center gap-4">
            <span className="border border-current px-3 py-1 rounded-full">
              {t("helloUser", { username: capitalizeFirstLetter(username) })}
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
                href="/login"
                className="border border-current px-3 py-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                {t("login")}
              </Link>
            </li>
            <li>
              <Link
                href="/comprar"
                className="border border-current px-3 py-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                {t("buy")}
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="border border-current px-3 py-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                {t("waitlist")}
              </Link>
            </li>
          </>
        )}
      </ul>

      <LanguageSelect className="mx-4 hidden lg:flex" />

      <button
        className="text-2xl p-2 rounded-full hover:bg-white/20 transition-colors duration-200 lg:hidden ml-auto"
        onClick={toggleMobileNav}
      >
        <PiListBold />
      </button>

      <div
        className="lg:hidden fixed inset-0 w-screen h-screen flex flex-row"
        ref={mobileNavRef}
        style={{ display: "none" }}
      >
        <div className="bg-black/20 grow" onPointerDown={toggleMobileNav} />
        <div className="w-3/4 min-w-max bg-white text-black">
          <div className="h-16 flex flex-row items-center justify-end p-5">
            <button onClick={toggleMobileNav} className="text-2xl">
              <PiXBold />
            </button>
          </div>
          <ul className="flex flex-col items-end p-5 text-teal-medium font-medium gap-8">
            {links.map((link) => (
              <li key={link.nameKey}>
                <Link
                  href={link.href}
                  className="hover:underline decoration-2"
                >
                  {t(link.nameKey)}
                </Link>
              </li>
            ))}
            {username ? (
              <>
                <li>
                  <span className="border border-current px-3 py-1 rounded-full">
                    {t("helloUser", { username: capitalizeFirstLetter(username) })}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="border border-red-500 px-3 py-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                  >
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
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
                    href="/register"
                    className="border border-current px-3 py-1 rounded-full hover:bg-teal-medium/20 transition-colors duration-200"
                  >
                    {t("waitlist")}
                  </Link>
                </li>
              </>
            )}
            <LanguageSelect className="-mt-4" />
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
