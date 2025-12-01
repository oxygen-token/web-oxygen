"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsApp_Button.css";

const WHATSAPP_NUMBER = "15872881789";
const WHATSAPP_MESSAGE = "Hola, me gustaría obtener más información sobre Oxygen.";

export default function WhatsApp_Button() {
  const t = useTranslations("WhatsApp");
  const [hasEnteredBefore, setHasEnteredBefore] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasEntered = sessionStorage.getItem("hasEnteredBefore") !== null;
    setHasEnteredBefore(hasEntered);
    
    if (hasEntered) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  if (!hasEnteredBefore || !isVisible) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={t("buttonLabel")}
    >
      <div className="flex items-center bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden breath-animation group-hover:animate-none">
        <FaWhatsapp className="w-6 h-6 flex-shrink-0" />
        <span className="inline-block max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 whitespace-nowrap font-medium pl-0 group-hover:pl-3 transition-all duration-300">
          {t("buttonText")}
        </span>
      </div>
    </a>
  );
}

