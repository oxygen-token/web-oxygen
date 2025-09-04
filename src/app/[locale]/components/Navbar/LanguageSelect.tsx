"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface LanguageSelectProps {
  className?: string;
}

const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "");
  const currentLocale = pathname.split("/")[1] || "en";

  const handleChangeLang = (lang: string) => {
    console.log('🔄 Changing language to:', lang);
    console.log('📍 Current pathname:', pathname);
    console.log('📍 Path without locale:', pathWithoutLocale);
    
    const newUrl = `/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    console.log('📍 New URL:', newUrl);
    
    // Force a full page reload with cache busting
    window.location.href = `${newUrl}?t=${Date.now()}`;
  };

  return (
    <div className={`relative flex flex-row items-center group ${className || ""}`}>
      <button className="text-sm font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors">
        <span className={currentLocale === 'en' ? 'text-white' : 'text-white/60'}>EN</span>
        <span className="text-white/40 mx-1">|</span>
        <span className={currentLocale === 'es' ? 'text-white' : 'text-white/60'}>ES</span>
      </button>
      <div className="hidden group-hover:block absolute top-8 left-0 bg-teal-dark/95 backdrop-blur rounded-md p-2 z-10 shadow-lg border border-white/10">
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
    </div>
  );
};

export default LanguageSelect; 