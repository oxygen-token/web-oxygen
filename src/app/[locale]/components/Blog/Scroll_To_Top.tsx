"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Scroll_To_Top() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 150);
    };
    setMounted(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const btn = (
    <button
      aria-label="Back to top"
      onClick={goTop}
      className={`fixed bottom-6 right-6 z-[999] rounded-full bg-teal-500 text-white shadow-xl shadow-black/30 transition-all duration-300 hover:bg-teal-400 active:scale-95 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ width: 56, height: 56 }}
    >
      <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );

  if (!mounted || typeof window === "undefined") return null;
  return createPortal(btn, document.body);
}


