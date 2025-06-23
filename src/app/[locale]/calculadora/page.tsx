"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { QUESTIONS, calculateTotalEmissions, type EmissionOption } from "../../../utils/emissionsConstants";

// Agregar estilos CSS para animaciones optimizadas y centralizadas
const styles = `
  @keyframes fadeInCenter {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  @keyframes slideInCenter {
    from { opacity: 0; transform: scale(0.94) translateY(6px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 5px rgba(0, 202, 166, 0.3); }
    50% { box-shadow: 0 0 20px rgba(0, 202, 166, 0.6), 0 0 30px rgba(0, 202, 166, 0.4); }
  }
  
  @keyframes optionGlow {
    from { 
      background: linear-gradient(135deg, rgba(0, 106, 106, 0.4), rgba(1, 33, 56, 0.3));
      box-shadow: 0 4px 16px rgba(0, 106, 106, 0.3); 
    }
    to { 
      background: linear-gradient(135deg, rgba(0, 202, 166, 0.8), rgba(0, 106, 106, 0.7));
      box-shadow: 0 12px 40px rgba(0, 202, 166, 0.6); 
    }
  }
  
  @keyframes fadeInScale {
    0% { 
      opacity: 0; 
      transform: scale(0.85) translateY(-3px); 
    }
    50% { 
      opacity: 0.8; 
      transform: scale(1.02) translateY(0); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  @keyframes smoothSlide {
    from { 
      opacity: 0; 
      transform: translateX(20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  
  .animate-fadeInCenter {
    animation: fadeInCenter 0.4s ease-out forwards;
  }
  
  .animate-slideDown {
    animation: slideDown 0.25s ease-out forwards;
  }
  
  .animate-slideInCenter {
    animation: slideInCenter 0.5s ease-out forwards;
  }
  
  .animate-glowPulse {
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .animate-optionGlow {
    animation: optionGlow 0.3s ease-out forwards;
  }
  
  .animate-smoothSlide {
    animation: smoothSlide 0.4s ease-out forwards;
  }
  

`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default function CalculadoraPage() {
  const t = useTranslations("Calculator");
  const [showCalculator, setShowCalculator] = useState(true); // Ir directo al menú
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calculatorType, setCalculatorType] = useState<'individual' | 'company'>('individual');
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Calcular emisiones en tiempo real
  useEffect(() => {
    const emissions = calculateTotalEmissions(answers);
    setCurrentEmissions(emissions);
  }, [answers]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextImage, setNextImage] = useState<string>("");

  const handleNext = () => {
    if (isTransitioning) return; // Prevenir doble click
    
    setIsTransitioning(true);
    
    // Pre-cargar la siguiente imagen después de iniciar transición
    const nextQuestionIndex = currentQuestion < QUESTIONS.length - 1 ? currentQuestion + 1 : currentQuestion;
    const nextBgImage = getBackgroundImage(nextQuestionIndex);
    
    // Pequeño delay para asegurar que el estado de transición se aplique primero
    setTimeout(() => {
      setNextImage(nextBgImage);
    }, 50);
    
    // Cambiar pregunta cuando la transición visual esté en curso
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 250);
    
    // Limpiar estados cuando termine la transición
    setTimeout(() => {
      setIsTransitioning(false);
      setNextImage("");
    }, 500);
  };

  const handlePrevious = () => {
    if (isTransitioning) return; // Prevenir doble click
    
    setIsTransitioning(true);
    
    // Pre-cargar la imagen anterior después de iniciar transición
    const prevQuestionIndex = currentQuestion > 0 ? currentQuestion - 1 : currentQuestion;
    const prevBgImage = getBackgroundImage(prevQuestionIndex);
    
    setTimeout(() => {
      setNextImage(prevBgImage);
    }, 50);
    
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      }
    }, 250);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setNextImage("");
    }, 500);
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  // Función para obtener imagen de fondo según la pregunta (usando las nuevas imágenes op1-op9)
  const getBackgroundImage = (questionIndex: number) => {
    const images = [
      '/assets/images/op2.jpg',  // Q1: con op2
      '/assets/images/op1.webp', // Q2: con op1
      '/assets/images/op1.webp', // Q3: con op1
      '/assets/images/op9.jpg',  // Q4: con op9
      '/assets/images/op7.jpg',  // Q5: con op7
      '/assets/images/op5.jpg',  // Q6: con op5
      '/assets/images/op8.jpg',  // Q7: con op8
      '/assets/images/op3.jpg',  // Q8: con op3
      '/assets/images/op3.jpg',  // Q9: con op3
      '/assets/images/op3.jpg',  // Q10: con op3
      '/assets/images/op6.jpg',  // Q11: con op6
      '/assets/images/op6.jpg',  // Q12: con op6
      '/assets/images/op6.jpg',  // Q13: con op6
      '/assets/images/op4.jpg',  // Q14: con op4
      '/assets/images/op4.jpg',  // Q15: con op4
    ];
    
    // Una imagen específica para cada pregunta
    return images[questionIndex] || images[0];
  };

  // Componente para preguntas de radio con efectos de iluminación gradual
  const RadioQuestion = ({ question }: { question: any }) => (
    <div className="space-y-3">
      {question.options.map((option: EmissionOption) => (
        <label 
          key={option.value} 
          className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-500 hover:shadow-lg group relative ${
            answers[question.id] === option.value 
              ? 'bg-teal-accent/60 border-2 border-teal-accent shadow-2xl animate-optionGlow' 
              : 'bg-teal-dark/50 border border-teal-accent/60 hover:bg-teal-dark/60 hover:border-teal-accent/80'
          }`}
          style={{ 
            backdropFilter: 'blur(30px)',
            background: answers[question.id] === option.value 
              ? 'linear-gradient(135deg, rgba(0, 202, 166, 0.8), rgba(0, 106, 106, 0.7))'
              : 'linear-gradient(135deg, rgba(0, 106, 106, 0.6), rgba(1, 15, 24, 0.767))',
            boxShadow: answers[question.id] === option.value 
              ? '0 12px 40px rgba(0, 202, 166, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
              : '0 8px 24px rgba(0, 106, 106, 0.5), inset 0 1px 4px rgba(255, 255, 255, 0.2)'
          }}
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={answers[question.id] === option.value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-5 h-5 text-teal-accent focus:ring-teal-accent focus:ring-2 transition-all duration-300"
          />
          <span className={`text-sm font-medium transition-all duration-500 ${
            answers[question.id] === option.value ? 'text-white font-bold' : 'text-white/95 group-hover:text-white'
          }`}>
            {option.label}
          </span>
          {/* Efecto de brillo gradual en hover */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none ${
            answers[question.id] === option.value 
              ? 'bg-gradient-to-r from-teal-accent/20 via-transparent to-teal-accent/20 animate-pulse' 
              : 'group-hover:bg-gradient-to-r group-hover:from-teal-accent/15 group-hover:via-transparent group-hover:to-teal-accent/15'
          }`} />
        </label>
      ))}
    </div>
  );

  // Estado para manejar dropdowns abiertos
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Componente para preguntas de dropdown con diseño cristal mejorado
  const DropdownQuestion = ({ question }: { question: any }) => {
    const isOpen = openDropdown === question.id;
    const selectedOption = question.options.find((opt: EmissionOption) => opt.value === answers[question.id]);
    
    return (
      <div className="relative">
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : question.id)}
          className={`w-full p-4 rounded-xl text-left focus:outline-none ${
            selectedOption 
              ? 'border-2 border-teal-accent shadow-2xl' 
              : 'border border-teal-accent/70'
          }`}
          style={{
            backdropFilter: 'blur(35px)',
            background: selectedOption
              ? 'linear-gradient(135deg, rgba(0, 106, 106, 0.9), rgba(0, 202, 166, 0.8))'
              : 'linear-gradient(135deg, rgba(0, 106, 106, 0.7), rgba(1, 33, 56, 0.6))',
            boxShadow: selectedOption 
              ? '0 16px 48px rgba(0, 202, 166, 0.7), inset 0 2px 8px rgba(255, 255, 255, 0.3)' 
              : '0 12px 32px rgba(0, 106, 106, 0.6), inset 0 1px 4px rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className={`${
              selectedOption ? 'text-white font-bold' : 'text-white/95 font-medium'
            }`}>
              {selectedOption ? selectedOption.label : 'Seleccionar opción...'}
            </span>
            <svg 
              className={`w-5 h-5 transform transition-transform duration-300 text-white ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 z-30 animate-slideDown rounded-xl overflow-hidden"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'linear-gradient(135deg, rgba(0, 106, 106, 0.95), rgba(1, 33, 56, 0.9))',
              border: '2px solid rgba(0, 202, 166, 0.8)',
              boxShadow: '0 32px 64px rgba(0, 106, 106, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="overflow-hidden">
              {question.options.map((option: EmissionOption, index: number) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleAnswerChange(question.id, option.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full px-4 py-3 text-left transition-all duration-300 ${
                    answers[question.id] === option.value 
                      ? 'text-white font-bold border-l-4 border-teal-accent' 
                      : 'text-white/95 font-medium'
                  }`}
                  style={{
                    background: answers[question.id] === option.value 
                      ? 'linear-gradient(90deg, rgba(0, 202, 166, 0.8), rgba(0, 202, 166, 0.6))'
                      : 'rgba(0, 106, 106, 0.6)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (answers[question.id] !== option.value) {
                      e.currentTarget.style.background = 'rgba(0, 202, 166, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[question.id] !== option.value) {
                      e.currentTarget.style.background = 'rgba(0, 106, 106, 0.6)';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="relative min-h-screen pt-16 lg:pt-[80px]">
          {/* Complex Gradient Background */}
          <div className="absolute inset-0 bg-teal-lighter" />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #006A6A 0%, rgba(0, 106, 106, 0.8) 40%, transparent 70%)"
            }}
          />
          
          <div className="relative z-10 container mx-auto px-5 lg:px-20 py-20">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-teal-medium/20 p-12">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-teal-dark mb-8">
                    {t("results.title")}
                  </h1>
                  
                  <div className="bg-teal-lighter/30 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-teal-dark mb-4">
                      {t("results.footprint")}
                    </h2>
                    <div className="text-6xl font-bold text-teal-medium mb-2">
                      {currentEmissions.toFixed(1)}
                    </div>
                    <div className="text-lg text-teal-dark">
                      toneladas CO₂e/año
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      {t("results.credits")}
                    </h3>
                    <div className="text-3xl font-bold text-green-700">
                      {Math.ceil(currentEmissions)} créditos de carbono
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-teal-medium hover:bg-teal-dark text-white py-4 px-8 rounded-xl font-semibold transition-colors">
                      {t("results.compensate")}
                    </button>
                    <button className="w-full border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white py-4 px-8 rounded-xl font-semibold transition-colors">
                      {t("results.seeProjects")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQuestions && !showResults) {
    const question = QUESTIONS[currentQuestion];
    const currentSection = question.section;
    const backgroundImage = getBackgroundImage(currentQuestion);

    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="relative min-h-screen pt-16 lg:pt-[80px]">
          {/* Complex Gradient Background */}
          <div className="absolute inset-0 bg-teal-lighter" />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #006a6afd 0%, rgba(0, 106, 106, 0.8) 40%, transparent 70%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(225deg, #012138 0%, rgba(1, 33, 56, 0.6) 30%, transparent 60%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(45deg, transparent 0%, rgba(11, 136, 153, 0.4) 50%, #0B8899 100%)"
            }}
          />
          
          <div className="relative z-10 container mx-auto px-5 lg:px-20 py-12">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-7xl h-[600px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden border border-teal-medium/20 transition-all duration-700 ease-in-out">
                
                {/* Left Progress Panel */}
                <div className="w-[380px] flex-shrink-0 bg-white p-8 flex flex-col justify-center rounded-l-[2rem] transition-all duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-teal-dark font-bold text-lg mb-4">
                      {t(`sections.${currentSection}`)}
                    </h3>
                    <div className="text-lg text-teal-medium mb-8">
                      {t("progress", { current: currentQuestion + 1, total: QUESTIONS.length })}
                    </div>
                    
                    {/* Current Emissions Display - Con efecto solo en el valor */}
                    <div className="bg-teal-lighter/30 rounded-xl p-4 mb-6"
                         style={{
                           background: 'linear-gradient(135deg, rgba(0, 202, 166, 0.2), rgba(0, 106, 106, 0.1))',
                           backdropFilter: 'blur(10px)',
                           border: '1px solid rgba(0, 202, 166, 0.3)'
                         }}>
                      <div className="text-xs text-teal-dark mb-1 font-medium">
                        {t("currentFootprint")}
                      </div>
                      <div className="text-2xl font-bold text-teal-medium">
                        <span className="transition-all duration-400 transform hover:scale-105 inline-block"
                              key={currentEmissions.toFixed(1)}
                              style={{
                                animation: 'fadeInScale 0.5s ease-out'
                              }}>
                          {currentEmissions.toFixed(1)}
                        </span>
                        <span className="text-sm ml-1">tCO₂e</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {t("previous")}
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!answers[question.id]}
                      className="w-full bg-teal-medium text-white py-3 px-4 rounded-xl font-semibold hover:bg-teal-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {currentQuestion === QUESTIONS.length - 1 ? t("finish") : t("next")}
                    </button>
                  </div>
                </div>

                {/* Right Question Panel */}
                <div className="flex-1 relative rounded-r-[2rem] overflow-hidden">
                  {/* Imagen actual */}
                  <div 
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ease-out ${
                      isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    }`}
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                  />
                  
                  {/* Imagen siguiente para transición suave */}
                  {nextImage && (
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ease-out ${
                        isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      style={{ 
                        backgroundImage: `url('${nextImage}')`,
                        transitionDelay: '50ms'
                      }}
                    />
                  )}
                  
                  {/* Gradient overlay with project colors - Más suave */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 106, 106, 0.75) 0%, rgba(0, 202, 166, 0.65) 30%, rgba(1, 33, 56, 0.7) 70%, rgba(11, 136, 153, 0.8) 100%)'
                    }}
                  />
                  
                  {/* Overlay dinámico para transiciones */}
                  <div className={`absolute inset-0 transition-all duration-500 ease-out ${
                    isTransitioning ? 'bg-black/20' : 'bg-transparent'
                  }`} />
                  
                  <div className="relative h-full flex flex-col items-center text-white text-center px-8 py-16">
                    <div className={`flex-1 flex flex-col items-center max-w-2xl transition-all duration-400 ease-out transform ${
                      isTransitioning ? 'opacity-0 translate-y-2 scale-98' : 'opacity-100 translate-y-0 scale-100'
                    } ${question.type === 'dropdown' ? 'justify-start pt-12' : 'justify-center'}`}>
                      <h1 className={`text-3xl font-bold mb-8 leading-tight transition-all duration-300 ease-out transform ${
                        isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0 animate-smoothSlide'
                      }`}>
                        {t(question.titleKey)}
                      </h1>
                      
                      <div className={`w-full max-w-lg transition-all duration-350 ease-out transform ${
                        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}>
                        {question.type === 'radio' ? (
                          <div className={isTransitioning ? '' : 'animate-fadeInCenter'}>
                            <RadioQuestion question={question} />
                          </div>
                        ) : (
                          !isTransitioning && (
                            <div className="animate-slideDown">
                              <DropdownQuestion question={question} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                        {/* Simplified Progress Bar Below Container */}
          <div className="relative z-10 container mx-auto px-5 lg:px-20 mt-8 mb-8">
            <div className="max-w-7xl mx-auto">
              {/* Progress Bar with Enhanced Visibility */}
              <div className="relative h-6 my-4">
                {/* Background bar */}
                <div className="bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded-full h-6 backdrop-blur border border-white/30 shadow-lg overflow-hidden">
                  {/* Progress fill */}
                  <div 
                    className="h-full bg-gradient-to-r from-teal-accent via-teal-light to-teal-accent shadow-inner relative"
                    style={{ 
                      width: `${progress}%`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
                
                {/* Question number indicator - Positioned relative to container */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-sm font-bold text-teal-dark bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl border-4 border-teal-accent z-10"
                  style={{ 
                    left: `${progress}%`,
                    transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {currentQuestion + 1}
                </div>
              </div>
              
              {/* Section Labels with Simple Progress Indicators */}
              <div className="flex justify-between mt-6 text-white/90 text-sm font-medium pb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    currentQuestion <= 3 
                      ? 'bg-white shadow-lg border-2 border-teal-accent' 
                      : 'bg-white/40 border border-white/50'
                  }`} />
                  <span className={`transition-all duration-500 ${
                    currentQuestion <= 3 
                      ? 'text-white font-bold text-base' 
                      : 'text-white/70'
                  }`}>
                    {t("sections.transport")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    currentQuestion >= 4 && currentQuestion <= 6 
                      ? 'bg-white shadow-lg border-2 border-teal-accent' 
                      : 'bg-white/40 border border-white/50'
                  }`} />
                  <span className={`transition-all duration-500 ${
                    currentQuestion >= 4 && currentQuestion <= 6 
                      ? 'text-white font-bold text-base' 
                      : 'text-white/70'
                  }`}>
                    {t("sections.flights")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    currentQuestion >= 7 
                      ? 'bg-white shadow-lg border-2 border-teal-accent' 
                      : 'bg-white/40 border border-white/50'
                  }`} />
                  <span className={`transition-all duration-500 ${
                    currentQuestion >= 7 
                      ? 'text-white font-bold text-base' 
                      : 'text-white/70'
                  }`}>
                    {t("sections.energy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de selección Individual/Empresa
  if (showCalculator && !showQuestions && !showResults) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="relative min-h-screen pt-16 lg:pt-[80px]">
          {/* Complex Gradient Background */}
          <div className="absolute inset-0 bg-teal-lighter" />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #006A6A 0%, rgba(0, 106, 106, 0.8) 40%, transparent 70%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(225deg, #012138 0%, rgba(1, 33, 56, 0.6) 30%, transparent 60%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(45deg, transparent 0%, rgba(11, 136, 153, 0.4) 50%, #0B8899 100%)"
            }}
          />
          
          <div className="relative z-10 container mx-auto px-5 lg:px-20 py-20">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-7xl h-[600px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden border border-teal-medium/20 transition-all duration-700 ease-in-out">
                
                {/* Left White Panel */}
                <div className="w-[380px] flex-shrink-0 bg-white p-8 flex flex-col justify-center rounded-l-[2rem]">
                  <h3 className="text-teal-dark font-bold text-lg mb-8 text-center transition-all duration-300">
                    {t("howToCompensate")}
                  </h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        setCalculatorType('individual');
                        setShowQuestions(true);
                      }}
                      className="w-full bg-teal-medium text-white py-3 px-6 rounded-xl font-semibold hover:bg-teal-dark transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                    >
                      {t("individual")}
                    </button>
                    <button 
                      onClick={() => {
                        setCalculatorType('company');
                        setShowQuestions(true);
                      }}
                      className="w-full border-2 border-teal-medium text-teal-medium py-3 px-6 rounded-xl font-semibold hover:bg-teal-medium hover:text-white transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                    >
                      {t("company")}
                    </button>
                  </div>
                </div>

                {/* Right Image Panel */}
                <div className="flex-1 relative rounded-r-[2rem] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: "url('/assets/images/Pexels Photo by Natalie Dmay.png')" }}
                  />
                  {/* Gradient overlay with project colors */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 106, 106, 0.75) 0%, rgba(0, 202, 166, 0.65) 30%, rgba(1, 33, 56, 0.7) 70%, rgba(11, 136, 153, 0.8) 100%)'
                    }}
                  />
                  <div className="absolute inset-0 bg-teal-dark/20 transition-all duration-500" />
                  
                  <div className="relative h-full flex flex-col items-center text-white text-center px-8 py-16">
                    <div className="flex-1 flex flex-col justify-center items-center max-w-2xl">
                      <h1 className="text-4xl font-bold mb-6 leading-tight transition-all duration-500">
                        {t("calculateTitle")}<sub className="text-2xl align-super">2</sub>
                      </h1>
                      <p className="text-lg leading-relaxed mb-10 max-w-xl transition-all duration-500">
                        {t("calculateDescription")}
                      </p>
                      <button 
                        onClick={() => setShowQuestions(true)}
                        className="bg-teal-accent hover:bg-teal-light text-white px-12 py-3 rounded-xl font-semibold transition-all duration-300 text-base transform hover:scale-105 hover:shadow-lg"
                      >
                        {t("start")}
                      </button>
                    </div>

                    <div className="flex justify-center space-x-2 mt-4">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-screen pt-16 lg:pt-[100px]">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(135deg, #006a6a 0%, #00CAA6 50%, transparent 100%)"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-5 lg:px-20 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              {t("title")}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-white/90 mb-8">
              {t("subtitle")}
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              {t("description")}
            </p>
            
            {/* CTA Button */}
            <button 
              className="bg-white text-teal-dark hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => setShowCalculator(true)}
            >
              {t("cta")}
            </button>
          </div>
          
          {/* Calculator Preview Card */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-xl bg-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {t("transport.title")}
                  </h3>
                  <p className="text-white/70 text-sm">
                    4 preguntas sobre tu movilidad
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {t("flights.title")}
                  </h3>
                  <p className="text-white/70 text-sm">
                    3 preguntas sobre vuelos y dieta
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {t("energy.title")}
                  </h3>
                  <p className="text-white/70 text-sm">
                    8 preguntas sobre energía y hábitos
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-white/80 text-sm">
                  ⏱️ Tiempo estimado: 3-5 minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 