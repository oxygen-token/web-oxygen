"use client";
import { useState } from "react";
import { PiCaretDown } from "react-icons/pi";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "¿Qué es un Bono de Carbono?",
    answer: "Un Bono de Carbono es un certificado que representa la reducción o eliminación de una tonelada de dióxido de carbono equivalente (CO2e) de la atmósfera. Estos bonos se generan a través de proyectos ambientales que reducen emisiones o capturan carbono."
  },
  {
    question: "¿Cómo se venden los Bonos de Carbono?",
    answer: "Los Bonos de Carbono se venden a través de plataformas especializadas como la nuestra. Puedes comprarlos directamente desde el dashboard, seleccionando el proyecto que prefieras y la cantidad de bonos que deseas adquirir. El proceso es simple y transparente."
  },
  {
    question: "¿Cuánto dinero puedo ganar?",
    answer: "El retorno de inversión depende de varios factores como el tipo de proyecto, la cantidad de bonos adquiridos y las condiciones del mercado. Cada proyecto tiene su propia proyección de ganancias que puedes consultar en los detalles del mismo."
  },
  {
    question: "¿Cuánta validez tienen los certificados de carbono neutralidad?",
    answer: "Los certificados de carbono neutralidad tienen validez permanente una vez emitidos. Representan una reducción verificada de emisiones que ha sido auditada y certificada por organismos reconocidos internacionalmente."
  },
  {
    question: "¿Cuántas tn de CO2 debo comprar?",
    answer: "La cantidad de toneladas de CO2 que debes comprar depende de tus objetivos personales o corporativos. Puedes calcular tu huella de carbono usando nuestra calculadora y luego compensar esa cantidad, o simplemente adquirir la cantidad que desees para apoyar proyectos ambientales."
  }
];

export default function FAQ_Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-white text-sm sm:text-base font-medium flex-1 pr-4">
              {item.question}
            </span>
            <PiCaretDown
              className={`w-5 h-5 text-white/70 flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

