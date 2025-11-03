"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function Back_To_Top() {
  const [mounted, setMounted] = useState(false);
  const [visible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    return () => {};
  }, []);

  const goTop = useCallback(() => {
    try {
      const containers: (HTMLElement | null | undefined)[] = [];
      containers.push(document.scrollingElement as HTMLElement);
      containers.push(document.documentElement);
      containers.push(document.body as unknown as HTMLElement);
      containers.push(document.querySelector('.blog-main-container') as HTMLElement | null);
      document.querySelectorAll('.overflow-y-auto').forEach((el) => containers.push(el as HTMLElement));

      window.scrollTo({ top: 0, behavior: 'smooth' });
      containers.forEach((el) => {
        if (el && typeof el.scrollTo === 'function') {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (el) {
          el.scrollTop = 0;
        }
      });
    } catch (_) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (!mounted) return null;

  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "");
  const isHomePage = pathWithoutLocale === "/" || pathWithoutLocale === "";
  const isDashboard = pathname.includes("/dashboard");

  if (isHomePage || isDashboard) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={goTop}
      className={`fixed bottom-8 right-8 z-[99999] rounded-full text-white shadow-2xl transition-all duration-500 ease-in-out hover:scale-110 active:scale-90 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, #0bb899 0%, #00caa6 100%)",
        width: 56,
        height: 56,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(11, 184, 153, 0.4)",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}


