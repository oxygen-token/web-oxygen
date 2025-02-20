"use client";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { get, post } from "../../../../../src/utils/request"; // Ajusta la ruta según tu estructura
import { capitalizeFirstLetter } from "../../../../../src/utils/stringUtils";

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
] as const;

function LanguageSelect({ className }: { className: string }) {
  return (
    <div className={cn("relative p-4 flex flex-row items-center group", className)}>
      <button className="text-2xl">
        <PiGlobe />
      </button>
      <div className="hidden group-hover:block absolute top-10 left-4 bg-teal-dark/70 backdrop-blur rounded-xs p-1 z-10 overflow-hidden">
        <Link className="hover:bg-teal-dark" href="/es">
          <Image src={logoArg} alt="bandera argentina" className="max-w-8" />
        </Link>
        <Link className="hover:bg-teal-dark" href="/en">
          <Image src={logoUs} alt="bandera usa" className="max-w-8" />
        </Link>
      </div>
    </div>
  );
}

function Navbar() {
  const t = useTranslations("Navbar");
  const [username, setUsername] = useState<string | null>(null);

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
      window.location.href = "/"; // Redirigir al home
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
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

      {/* Desktop links */}
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
    </nav>
  );
}

export default Navbar;
