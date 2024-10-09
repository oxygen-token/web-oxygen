"use client";
import cn from "classnames";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

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
  // {
  //   nameKey: "login",
  //   href: "/login",
  // },
] as const;

function LanguageSelect({ className }: { className: string }) {
  return (
    <div
      className={cn("relative p-4 flex flex-row items-center group", className)}
    >
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
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const toggleMobileNav = () => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    if (nav.style.display == "none") {
      nav.style.removeProperty("display");
    } else {
      nav.style.setProperty("display", "none");
    }
  };

  return (
    <nav className="fixed top-0 left-0 h-16 lg:h-[100px] w-full px-5 lg:px-20 flex flex-row items-center bg-teal-dark/40 text-white backdrop-blur z-50">
      <Image
        src={logoNav}
        alt="Oxygen"
        className="max-w-[150px] lg:max-w-[200px] object-cover"
      />

      {/* Desktop links */}
      <ul className="hidden lg:flex flex-row ml-auto gap-16">
        {links.map((link) => (
          <li key={link.nameKey}>
            <Link href={link.href} className="hover:underline">
              {t(link.nameKey)}
            </Link>
          </li>
        ))}

        {/* <li>
          <Link
            href="/comprar"
            className="border border-current px-3 py-1 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            {t("buy")}
          </Link>
        </li> */}

        <li>
          <Link
            href="/register"
            className="border border-current px-3 py-1 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            {t("waitlist")}
          </Link>
        </li>
      </ul>

      <LanguageSelect className="mx-4 hidden lg:flex" />

      <button
        className="text-2xl p-2 rounded-full hover:bg-white/20 transition-colors duration-200 lg:hidden ml-auto"
        onClick={toggleMobileNav}
      >
        <PiListBold />
      </button>

      {/* Mobile nav menu */}
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
          <ul className="flex flex-col items-end p-5 text-teal-medium font-medium gap-16">
            {links
              // .filter((link) => link.nameKey !== "login")
              .map((link) => (
                <li key={link.nameKey}>
                  <Link
                    href={link.href}
                    className="hover:underline decoration-2"
                  >
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}

            {/* <li key="login">
              <Link
                href="/login"
                className="border-2 border-current px-6 py-1 rounded-full hover:bg-teal-medium/20 transition-colors duration-200"
              >
                {t("login")}
              </Link>
            </li> */}

            {/* <li>
              <Link
                href="/comprar"
                className="border-2 border-teal-dark bg-teal-dark text-white px-6 py-1 rounded-full hover:bg-teal-dark/80 transition-colors duration-200"
              >
                {t("buy")}
              </Link>
            </li> */}

            <li>
              <Link
                href="/register"
                className="border-2 border-teal-dark bg-teal-dark text-white px-6 py-1 rounded-full hover:bg-teal-dark/80 transition-colors duration-200"
              >
                {t("waitlist")}
              </Link>
            </li>

            <LanguageSelect className="-mt-4" />
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
