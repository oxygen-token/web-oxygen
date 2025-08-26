"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { PiGlobe } from "react-icons/pi";

import logoArg from "../../../../../public/assets/logos/logoArg.png";
import logoUs from "../../../../../public/assets/logos/logoUs.png";

interface LanguageSelectProps {
  className?: string;
}

const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "");

  const handleChangeLang = (lang: string) => {
    router.replace(`/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`);
  };

  return (
    <div className={`relative p-4 flex flex-row items-center group ${className || ""}`}>
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
};

export default LanguageSelect; 