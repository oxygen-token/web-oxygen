"use client";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";
import Image from "next/image";
import { PiChatCircle } from "react-icons/pi";
import FAQ_Accordion from "../../components/Help/FAQ_Accordion";

export default function AyudaPage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <h1 className="text-white font-bold text-lg sm:text-xl flex-shrink-0">
            ¿Cómo te podemos ayudar?
          </h1>
          
          <div className="flex flex-col gap-6 flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div id="help-card-1" className="rounded-xl overflow-hidden">
                <div className="relative w-full aspect-video">
                  <Image
                    src="/assets/images/Video_1.png"
                    alt="Recorrido de la página"
                    fill
                    className="object-contain rounded-xl"
                    quality={100}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              
              <div id="help-card-2" className="rounded-xl overflow-hidden">
                <div className="relative w-full aspect-video">
                  <Image
                    src="/assets/images/Video_1.png"
                    alt="Cómo intercambiar tokens"
                    fill
                    className="object-contain rounded-xl"
                    quality={100}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              
              <div id="help-card-3" className="rounded-xl overflow-hidden">
                <div className="relative w-full aspect-video">
                  <Image
                    src="/assets/images/Video_1.png"
                    alt="Cómo quemar tokens"
                    fill
                    className="object-contain rounded-xl"
                    quality={100}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 flex-1 min-h-0 overflow-hidden">
              <div id="help-contact" className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 flex flex-col items-center justify-center gap-3 sm:gap-4 md:col-span-1 w-fit max-w-xs mx-auto self-center">
                <div className="relative">
                  <PiChatCircle className="w-16 h-16 sm:w-20 sm:h-20 text-[#539390] flex-shrink-0" />
                  <div className="absolute inset-0 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#539390] rounded-full"></span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#539390] rounded-full"></span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#539390] rounded-full"></span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-gray-600 text-sm sm:text-base">¿Necesitas ayuda?</p>
                  <p className="text-gray-600 text-sm sm:text-base">¡Hablanos!</p>
                </div>
                <button className="px-4 sm:px-6 py-1.5 sm:py-2 border-2 border-[#539390] rounded-lg text-[#539390] font-semibold text-xs sm:text-sm hover:bg-[#539390] hover:text-white transition-colors whitespace-nowrap">
                  Preguntanos
                </button>
              </div>
              
              <div id="help-faq" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 md:col-span-4 flex flex-col min-h-0 h-full overflow-hidden">
                <h2 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 flex-shrink-0">Preguntas frecuentes</h2>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <FAQ_Accordion />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
} 