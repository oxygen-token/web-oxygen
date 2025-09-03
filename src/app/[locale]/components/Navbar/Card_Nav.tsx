"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/Auth_Context";
import { capitalizeFirstLetter } from "../../../../utils/stringUtils";
import { usePathname } from "next/navigation";

import logoNav from "../../../../../public/assets/images/logo.png";

const links = [
  { nameKey: "home", href: "/" },
  { nameKey: "us", href: "/nosotros" },
  { nameKey: "project", href: "/proyectos" },
  { nameKey: "whitepaper", href: "/whitepaper" },
];

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  className?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const Card_Nav: React.FC<CardNavProps> = ({
  className = "",
  baseColor = "rgba(39, 109, 112, 0.4)",
  menuColor = "#fff",
  buttonBgColor = "#006a6a",
  buttonTextColor = "#fff",
}) => {
  const t = useTranslations("Navbar");
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const lastScrollY = useRef(0);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  const items: CardNavItem[] = [
    {
      label: t("home"),
      bgColor: "linear-gradient(135deg, rgba(1, 33, 56, 0.95) 0%, rgba(0, 106, 106, 0.95) 50%, rgba(0, 202, 166, 0.95) 100%)",
      textColor: "#fff",
      links: [
        { label: t("home"), href: "/", ariaLabel: t("home") },
        { label: t("us"), href: "/nosotros", ariaLabel: t("us") },
        { label: t("community"), href: "/blog", ariaLabel: t("community") }
      ]
    },
    {
      label: t("project"),
      bgColor: "linear-gradient(135deg, rgba(1, 33, 56, 0.95) 0%, rgba(0, 106, 106, 0.95) 50%, rgba(0, 202, 166, 0.95) 100%)",
      textColor: "#fff",
      links: [
        { label: t("project"), href: "/proyectos", ariaLabel: t("project") },
        { label: t("whitepaper"), href: "/whitepaper", ariaLabel: t("whitepaper") }
      ]
    },
    {
      label: user ? t("helloUser", { username: capitalizeFirstLetter(user.username) }) : t("login"),
      bgColor: "linear-gradient(135deg, rgba(1, 33, 56, 0.95) 0%, rgba(0, 106, 106, 0.95) 50%, rgba(0, 202, 166, 0.95) 100%)",
      textColor: "#fff",
      links: user ? [
        { label: t("dashboard"), href: `/${locale}/dashboard`, ariaLabel: t("dashboard") },
        { label: t("logout"), href: "#", ariaLabel: t("logout") }
      ] : [
        { label: t("login"), href: "/login?panel=login", ariaLabel: t("login") },
        { label: t("buy"), href: "/comprar", ariaLabel: t("buy") }
      ]
    }
  ];

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 64;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };





  const toggleMenu = () => {
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setIsHamburgerOpen(false);
    setIsExpanded(false);
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleLogout();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isExpanded && currentScrollY > lastScrollY.current) {
        closeMenu();
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExpanded]);

  return (
    <div
      className={`card-nav-container fixed top-0 left-0 w-full z-[60] bg-teal-dark/40 ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} block h-16 p-0 relative overflow-hidden`}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-16 flex items-center justify-between px-5 z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>

          <div className="logo-container flex items-center order-1">
            <Link href="/" onClick={closeMenu}>
              <Image
                src={logoNav}
                alt="Oxygen"
                className="logo max-w-[150px] object-cover"
              />
            </Link>
          </div>
        </div>



        <div
          className={`card-nav-content absolute left-0 right-0 top-16 bottom-0 p-4 flex flex-col items-stretch gap-3 justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto opacity-100"
              : "invisible pointer-events-none opacity-0"
          } transition-opacity duration-300`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col justify-center p-6 rounded-lg min-w-0 flex-1 h-auto min-h-[100px] shadow-lg border border-white/10 backdrop-blur-sm"
              ref={setCardRef(idx)}
              style={{ 
                background: item.bgColor, 
                color: item.textColor,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="nav-card-links flex flex-col gap-3 justify-center">
                {item.links?.map((lnk, i) => (
                  <Link
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-3 no-underline cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-105 text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    onClick={(e) => {
                      if (lnk.label === t("logout")) {
                        handleLogoutClick(e);
                      } else {
                        closeMenu();
                      }
                    }}
                  >
                    <svg
                      className="nav-card-link-icon shrink-0 w-4 h-4 drop-shadow-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17L17 7M17 7H7M17 7V17"
                      />
                    </svg>
                    {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Card_Nav;
