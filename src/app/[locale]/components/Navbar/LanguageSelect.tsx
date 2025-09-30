"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface LanguageSelectProps {
  className?: string;
}

const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "");
  const currentLocale = pathname.split("/")[1] || "en";

  const handleChangeLang = (lang: string) => {
    console.log('🔄 Changing language to:', lang);
    console.log('📍 Current pathname:', pathname);
    console.log('📍 Path without locale:', pathWithoutLocale);
    
    const newUrl = `/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    console.log('📍 New URL:', newUrl);
    
    setIsOpen(false);
    window.location.href = `${newUrl}?t=${Date.now()}`;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative flex flex-row items-center ${className || ""}`} ref={dropdownRef}>
      <button 
        className="text-sm font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
        onClick={toggleDropdown}
      >
        <span className={currentLocale === 'en' ? 'text-white' : 'text-white/60'}>EN</span>
        <span className="text-white/40 mx-1">|</span>
        <span className={currentLocale === 'es' ? 'text-white' : 'text-white/60'}>ES</span>
      </button>
      {isOpen && (
        <div className="absolute top-8 left-0 bg-teal-dark/95 backdrop-blur rounded-md p-2 z-10 shadow-lg border border-white/10">
          <button 
            className={`block w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
              currentLocale === 'es' ? 'text-white font-medium' : 'text-white/70'
            }`}
            onClick={() => handleChangeLang('es')}
          >
            ES
          </button>
          <button 
            className={`block w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
              currentLocale === 'en' ? 'text-white font-medium' : 'text-white/70'
            }`}
            onClick={() => handleChangeLang('en')}
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelect; 