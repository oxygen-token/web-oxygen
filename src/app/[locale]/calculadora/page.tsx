"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { QUESTIONS, calculateTotalEmissions, type EmissionOption } from "../../../utils/emissionsConstants";
import { apiRequest } from "../../../utils/request";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { useDev } from "../context/Dev_Context";

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
  
  @keyframes modalSlideDown {
    from {
      opacity: 0;
      transform: translateY(-100px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes modalSlideUp {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-100px) scale(0.95);
    }
  }
  
  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes backdropFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes resultModalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-fadeInCenter {
    animation: fadeInCenter 0.4s ease-out forwards;
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
  }
  
  .animate-slideInCenter {
    animation: slideInCenter 0.4s ease-out forwards;
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
  
  .animate-modalSlideDown {
    animation: modalSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  .animate-modalSlideUp {
    animation: modalSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  .animate-backdropFadeIn {
    animation: backdropFadeIn 0.4s ease-out forwards;
  }
  
  .animate-backdropFadeOut {
    animation: backdropFadeOut 0.5s ease-out forwards;
  }
  
  .animate-resultModalFadeIn {
    animation: resultModalFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  .prelanding-bg {
    background: radial-gradient(#3be23b, #074907);
    background-size: 200% 200%;
    background-position: center center;
  }

  .prelanding-spinner {
    animation: spin 1500ms linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .modal-animate-in { animation: modalSlideDown 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
  .modal-animate-out { animation: modalSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }
  .fade-animate-in { animation: backdropFadeIn 0.15s ease-out forwards; }
  .fade-animate-out { animation: backdropFadeOut 0.3s ease-out forwards; opacity: 0; }

`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function isValidEmail(email: string) {
  // Validación simple de email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Componente del Modal de Progreso fuera de la función principal
function ProgressModal({
  show, modalState, modalAnimation, userInfo, handleNameChange, handleEmailChange, handleModalSubmit, handleClose, t
}: {
  show: boolean,
  modalState: 'form' | 'thanks' | 'hidden',
  modalAnimation: 'in' | 'out',
  userInfo: { name: string; email: string },
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleModalSubmit: () => void,
  handleClose: () => void,
  t: any
}) {
  if (!show) return null;
  const emailOk = isValidEmail(userInfo.email);
  const nameOk = userInfo.name.trim().length > 0;
  const isFormReady = nameOk && emailOk;
  const canSubmit = isFormReady;
  // Clases para animación
  let modalClass = '';
  if (modalState === 'form') {
    modalClass = modalAnimation === 'in' ? 'modal-animate-in' : 'modal-animate-out';
  } else if (modalState === 'thanks') {
    modalClass = modalAnimation === 'in' ? 'fade-animate-in' : 'fade-animate-out';
  }
  let overlayClass = modalAnimation === 'in' ? 'fade-animate-in' : 'fade-animate-out';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop oscuro */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${overlayClass}`}
        onClick={() => {}} // Prevenir cerrar clickeando afuera
      />
      {/* Modal */}
      <div className={`relative bg-white rounded-[2rem] shadow-2xl border border-teal-medium/20 p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${modalClass}`}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Botón de cierre */}
        {modalState === 'form' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-teal-accent text-2xl font-bold focus:outline-none"
            aria-label="Cerrar"
            type="button"
          >
            ×
          </button>
        )}
        <div className="text-center">
          {/* Logo de Oxygen */}
          <div className="w-full max-w-[200px] sm:max-w-[240px] h-auto mx-auto mb-6 flex items-center justify-center">
            <img 
              src="/assets/images/logo.png" 
              alt="Oxygen Logo" 
              className="w-full h-auto object-contain"
            />
          </div>
          {modalState === 'form' && <>
            {/* Título */}
            <h3 className="text-2xl font-bold text-teal-dark mb-4">
              {t("progressModal.title")}
            </h3>
            {/* Descripción */}
            <p className="text-teal-medium mb-6">
              {t("progressModal.description")}
            </p>
            {/* Formulario */}
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-teal-dark mb-2">
                  {t("progressModal.nameLabel")}
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 border border-teal-medium/30 rounded-xl focus:ring-2 focus:ring-teal-accent focus:border-teal-accent transition-all duration-100 bg-white placeholder:text-teal-medium/80 text-teal-dark"
                  placeholder={t("progressModal.namePlaceholder")}
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-dark mb-2">
                  {t("progressModal.emailLabel")}
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-3 border border-teal-medium/30 rounded-xl focus:ring-2 focus:ring-teal-accent focus:border-teal-accent transition-all duration-100 bg-white text-teal-dark placeholder:text-teal-medium/80"
                  placeholder={t("progressModal.emailPlaceholder")}
                  autoComplete="email"
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                />
                <p className="mt-2 text-xs text-teal-medium">
                  {t("progressModal.emailBenefit")}
                </p>
              </div>
            </div>
            {/* Botones centrados */}
            <div className="flex flex-col items-center gap-3 mt-6">
              {/* Botón principal - Continuar */}
              <button
                onClick={handleModalSubmit}
                disabled={!canSubmit}
                className={`w-full max-w-xs py-3 px-8 rounded-xl font-semibold transition-all duration-100 transform ${
                  isFormReady
                    ? 'bg-teal-accent text-white hover:bg-teal-accent/90 hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
                type="button"
              >
                {t("progressModal.continueButton")}
              </button>
              
              {/* Botón secundario - Saltar */}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-teal-medium text-sm font-medium transition-all duration-100"
                type="button"
              >
                {t('progressModal.skipButton', { defaultValue: 'Saltar' })}
              </button>
            </div>
            {/* Nota de privacidad */}
            <p className="text-xs text-gray-500 mt-4">
              {t("progressModal.privacyNote")}
            </p>
          </>}
          {modalState === 'thanks' && <>
            <h3 className="text-2xl font-bold text-teal-dark mb-4 mt-4">¡Gracias por completar tus datos!</h3>
            <p className="text-teal-medium mb-6">Tu progreso ha sido guardado. Continúa con la calculadora.</p>
          </>}
        </div>
      </div>
    </div>
  );
}

export default function CalculadoraPage() {
  const t = useTranslations("Calculator");
  const { isDevMode } = useDev();
  const [showCalculator, setShowCalculator] = useState(true); // Ir directo al menú
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calculatorType, setCalculatorType] = useState<'individual' | 'company' | null>(null);
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Estados para el modal
  const [modalState, setModalState] = useState<'form' | 'thanks' | 'hidden'>('hidden');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [modalCompleted, setModalCompleted] = useState(false);
  const [devPreview, setDevPreview] = useState<"progress" | "results" | null>(null);

  // Estados para optimización de imágenes
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [showLoadingBanner, setShowLoadingBanner] = useState(true);

  // Estados para animación del modal y transiciones
  const [modalAnimation, setModalAnimation] = useState<'in' | 'out'>('in');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Estados para el modal de Instagram
  const [showInstaModal, setShowInstaModal] = useState(false);
  const [instaImage, setInstaImage] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const totalQuestions = QUESTIONS.length;
  const hasSubmittedResults = useRef(false);

  // Fecha actual para mostrar en el resultado
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const fecha = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear().toString().slice(-2)}`;

  // Estados para el contador animado
  const [animatedEmissions, setAnimatedEmissions] = useState(0);

    // Estados para el modal de fuentes
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [sourcesModalClosing, setSourcesModalClosing] = useState(false);

  // Función para cerrar el modal con animación
  const closeSourcesModal = () => {
    setSourcesModalClosing(true);
    setTimeout(() => {
      setShowSourcesModal(false);
      setSourcesModalClosing(false);
    }, 300);
  };  

  // Efecto para animar el contador cuando se muestran los resultados
  useEffect(() => {
    if (showResults) {
      setAnimatedEmissions(0);
      
      // Usar el valor real calculado de emisiones
      const finalValue = currentEmissions;
      const duration = 2000; // 2 segundos
      const steps = 80; // 80 pasos para suavidad
      const increment = finalValue / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.min(increment * currentStep, finalValue);
        setAnimatedEmissions(currentValue);
        
        if (currentValue >= finalValue) {
          clearInterval(interval);
          setAnimatedEmissions(finalValue);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    } else {
      setAnimatedEmissions(0);
    }
  }, [showResults, currentEmissions]);

  // Cuando se muestra el modal, animación 'in'. Cuando se va a ocultar, animación 'out' y luego desmonta.
  useEffect(() => {
    if (modalState !== 'hidden') setModalAnimation('in');
  }, [modalState]);

  // Función para precargar imágenes con prioridad
  const preloadImages = () => {
    const images = [
      '/assets/images/op22.jpg',  // Q1
      '/assets/images/op11.jpg', // Q2-Q3
      '/assets/images/op99.jpg',  // Q4
      '/assets/images/op77.jpg',  // Q5
      '/assets/images/op55.jpg',  // Q6
      '/assets/images/op88.jpg',  // Q7
      '/assets/images/op33.jpg',  // Q8-Q10
      '/assets/images/op66.jpg',  // Q11-Q13
      '/assets/images/op44.jpg',  // Q14-Q15
    ];

    // Cargar primeras 3 imágenes con prioridad alta
    const priorityImages = images.slice(0, 3);
    const remainingImages = images.slice(3);

    const loadImage = (src: string, priority: 'high' | 'low' = 'low') => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        // Configurar prioridad de carga
        if (priority === 'high') {
          img.loading = 'eager';
        }
        
        img.onload = () => {
          setImagesLoaded(prev => new Set([...Array.from(prev), src]));
          resolve(src);
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          reject(src);
        };
        img.src = src;
      });
    };

    // Cargar imágenes prioritarias primero
    const priorityPromises = priorityImages.map(src => loadImage(src, 'high'));
    
    Promise.allSettled(priorityPromises).then(() => {
      // Luego cargar el resto
      const remainingPromises = remainingImages.map(src => loadImage(src, 'low'));
      
      Promise.allSettled(remainingPromises).then(() => {
        setIsLoadingImages(false);
        sessionStorage.setItem('oxy_calc_images_loaded', '1');
      });
    });

    // Timeout de seguridad para evitar loading infinito
    setTimeout(() => {
      if (imagesLoaded.size >= 1.5) {
        setIsLoadingImages(false);
      }
    }, 5000);
  };

  // Precargar imágenes al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('oxy_calc_images_loaded') === '1') {
      setIsLoadingImages(false);
      setShowLoadingBanner(false);
      return;
    }
    preloadImages();
    // Mostrar el banner por un tiempo mínimo de 3 segundos
    const minLoadingTime = setTimeout(() => {
      setShowLoadingBanner(false);
    }, 3000);
    return () => {
      clearTimeout(minLoadingTime);
    };
  }, []);

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

  const handleNext = () => {
    if (isTransitioning) return; // Prevenir doble click
    
    // Mostrar modal en la pregunta 7 (índice 6) si aún no se completó
    if (currentQuestion === 6 && !modalCompleted) {
      setModalState('form');
      return;
    }
    
    const nextQuestionIndex = currentQuestion < QUESTIONS.length - 1 ? currentQuestion + 1 : currentQuestion;
    const nextBgImage = getBackgroundImage(nextQuestionIndex);
    
    // Verificar si la imagen está precargada
    const isImageReady = imagesLoaded.has(nextBgImage);
    
    // Transición unificada y suave
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 150);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (isTransitioning) return; // Prevenir doble click
    
    const prevQuestionIndex = currentQuestion > 0 ? currentQuestion - 1 : currentQuestion;
    const prevBgImage = getBackgroundImage(prevQuestionIndex);
    
    // Verificar si la imagen está precargada
    const isImageReady = imagesLoaded.has(prevBgImage);
    
    // Transición unificada y suave
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      }
    }, 150);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const resetToLanding = () => {
    setShowCalculator(true);
    setShowQuestions(false);
    setShowResults(false);
    setModalState('hidden');
    setModalCompleted(false);
    setModalAnimation('in');
    setDevPreview(null);
    setCurrentQuestion(0);
  };

  const openDevProgressPreview = () => {
    if (!isDevMode) return;
    const previewQuestion = Math.min(6, QUESTIONS.length - 1);
    setDevPreview('progress');
    setShowCalculator(false);
    setShowResults(false);
    setShowQuestions(true);
    setCurrentQuestion(previewQuestion);
    setModalCompleted(false);
    setModalState('form');
    setModalAnimation('in');
  };

  const openDevResultsPreview = () => {
    if (!isDevMode) return;
    setDevPreview('results');
    setShowCalculator(false);
    setShowQuestions(false);
    setShowResults(true);
  };

  const proceedAfterLeadSaved = () => {
    setModalCompleted(true);
    setModalState('thanks');
    setTimeout(() => {
      setModalAnimation('out');
      setTimeout(() => {
        setModalState('hidden');
        setTimeout(() => {
          if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
          } else {
            setShowResults(true);
          }
        }, 100);
      }, 400);
    }, 2000);
  };

  // 3. handleModalSubmit ahora solo valida y continúa sin llamar al backend
  const handleModalSubmit = () => {
    if (!userInfo.name.trim() || !isValidEmail(userInfo.email)) {
      return;
    }
    if (devPreview === 'progress') {
      setModalState('thanks');
      setTimeout(() => {
        setModalAnimation('out');
        setTimeout(() => {
          setModalState('hidden');
          resetToLanding();
        }, 400);
      }, 2000);
      return;
    }
    proceedAfterLeadSaved();
  };

  const handleCloseModal = () => {
    if (devPreview === 'progress') {
      setModalAnimation('out');
      setTimeout(() => {
        setModalState('hidden');
        resetToLanding();
      }, 400);
      return;
    }
    setModalCompleted(true);
    setModalAnimation('out');
    setTimeout(() => setModalState('hidden'), 400);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo(prev => ({
      ...prev,
      email: e.target.value
    }));
  };

  const progress = (currentQuestion / (QUESTIONS.length - 1)) * 100;

  useEffect(() => {
    if (!showResults) return;
    if (devPreview === 'results') return;
    if (hasSubmittedResults.current) return;
    const emailValue = userInfo.email.trim();
    const nameValue = userInfo.name.trim();
    if (!emailValue || !nameValue) return;
    const calculatorData = {
      answers,
      partialResult: currentEmissions,
      step: totalQuestions,
      totalQuestions,
    };
    const payload = {
      email: emailValue,
      name: nameValue,
      finalResult: currentEmissions,
      calculatorData,
    };
    const syncResults = async () => {
      try {
        await apiRequest("/pre-users-calc", "PUT", payload);
      } catch (error) {
        console.error("Failed to submit calculator results", error);
      } finally {
        hasSubmittedResults.current = true;
      }
    };
    syncResults();
  }, [showResults, currentEmissions, answers, userInfo.email, userInfo.name, totalQuestions, devPreview]);

  // Función para obtener imagen de fondo según la pregunta (usando las nuevas imágenes op11-op99)
  const getBackgroundImage = (questionIndex: number) => {
    const images = [
      '/assets/images/op22.jpg',  // Q1: con op22
      '/assets/images/op11.jpg', // Q2: con op11
      '/assets/images/op11.jpg', // Q3: con op11
      '/assets/images/op99.jpg',  // Q4: con op99
      '/assets/images/op77.jpg',  // Q5: con op77
      '/assets/images/op55.jpg',  // Q6: con op55
      '/assets/images/op88.jpg',  // Q7: con op88
      '/assets/images/op33.jpg',  // Q8: con op33
      '/assets/images/op33.jpg',  // Q9: con op33
      '/assets/images/op33.jpg',  // Q10: con op33
      '/assets/images/op66.jpg',  // Q11: con op66
      '/assets/images/op66.jpg',  // Q12: con op66
      '/assets/images/op66.jpg',  // Q13: con op66
      '/assets/images/op44.jpg',  // Q14: con op44
      '/assets/images/op44.jpg',  // Q15: con op44
    ];
    
    // Una imagen específica para cada pregunta
    return images[questionIndex] || images[0];
  };

  // Componente para preguntas de radio con efectos de iluminación gradual
  const RadioQuestion = ({ question }: { question: any }) => (
    <div className="space-y-2 lg:space-y-3">
      {question.options.map((option: EmissionOption) => (
        <label 
          key={option.value} 
          className={`flex items-center space-x-3 lg:space-x-3 p-3 lg:p-4 rounded-xl lg:rounded-xl cursor-pointer transition-all duration-500 hover:shadow-lg group relative ${
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
          <span className={`text-sm sm:text-base font-medium transition-all duration-500 text-left ${
            answers[question.id] === option.value ? 'text-white font-bold' : 'text-white/95 group-hover:text-white'
          }`}>
            {t(option.label)}
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
        className={`w-full p-3 lg:p-4 rounded-xl lg:rounded-xl text-left focus:outline-none transition-all duration-300 ${
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
            <span className={`text-sm sm:text-base text-left ${
              selectedOption ? 'text-white font-bold' : 'text-white/95 font-medium'
            }`}>
              {selectedOption ? t(selectedOption.label) : t("selectOption")}
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
            className="absolute top-full left-0 right-0 mt-2 z-30 animate-slideDown rounded-xl lg:rounded-xl overflow-hidden"
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
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-left transition-all duration-300 text-sm sm:text-base ${
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
                  {t(option.label)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };



  // Loading state mientras se precargan las imágenes
  if (isLoadingImages || showLoadingBanner) {
    console.log('Mostrando banner de carga...', { isLoadingImages, showLoadingBanner, imagesLoaded: imagesLoaded.size });
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center">
        <div className="absolute inset-0 prelanding-bg" />
        <div className="w-[100px] h-[100px] grid place-items-center relative">
          <TreesIcon />
          <div className="absolute inset-0 rounded-full border-[6px] border-white border-t-green-dark prelanding-spinner" />
        </div>
      </div>
    );
  }


  // Generar un ID tipo ticket
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `OXY-${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}-${randomId}`;

  if (showResults) {
    return (
      <div className="min-h-screen overflow-hidden">
        <Navbar />
        <div className="relative min-h-screen pt-8 lg:pt-12 pb-4 flex items-center justify-center">
          {/* Fondo y gradientes */}
          <div className="absolute inset-0 bg-teal-lighter" />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #006A6A 0%, rgba(0, 106, 106, 0.8) 40%, transparent 70%)"
            }}
          />
          <div className="relative z-10 container mx-auto px-2 lg:px-8 py-2 flex items-center justify-center min-h-[75vh]">
            <div className="flex items-center justify-center w-full">
              <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-teal-medium/20 p-5 sm:p-6 animate-resultModalFadeIn">
                <div className="text-center">
                  {/* Título principal */}
                  <h1 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-4">
                    {t("results.title")}
                  </h1>
                  
                  {/* Bloque de huella de carbono */}
                  <div className="bg-teal-lighter/30 rounded-xl p-5 mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-teal-dark mb-2">
                      {t("results.footprint")}
                    </h2>
                    <div className="text-4xl sm:text-5xl font-bold text-teal-medium mb-1">
                      {animatedEmissions.toFixed(1)}
                    </div>
                    <div className="text-base sm:text-lg text-teal-dark">
                      toneladas CO₂e/año
                    </div>
                  </div>
                  
                  {/* Bloque de créditos */}
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-1">
                      {t("results.credits")}
                    </h3>
                    <div className="text-2xl sm:text-3xl font-bold text-green-700">
                      {Math.ceil(animatedEmissions)} créditos de carbono
                    </div>
                  </div>
                  
                  {/* Sección de compartir */}
                  <div className="mb-4">
                    <div className="text-teal-dark font-semibold mb-2 text-base sm:text-lg">
                      ¡Sacale captura y compartí en las redes!<br/>
                      <span className="text-teal-medium font-bold text-base">Recordá seguirnos</span>
                    </div>
                    
                    {/* Íconos de redes sociales */}
                    <div className="flex justify-center gap-6 mb-3">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={32} color="#00CAA6" style={{cursor: 'pointer'}} />
                      </a>
                      <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter size={32} color="#00CAA6" style={{cursor: 'pointer'}} />
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF size={32} color="#00CAA6" style={{cursor: 'pointer'}} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Botón para ver proyectos */}
                  <button className="w-full border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white py-2 px-6 rounded-xl font-semibold transition-colors mb-4">
                    Ver proyectos de compensación
                    </button>
                  
                  {/* Footer con fecha y web */}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <button 
                        onClick={() => setShowSourcesModal(true)}
                        className="text-teal-medium px-2 py-1 rounded transition-all duration-300 cursor-pointer font-medium"
                        style={{
                          backdropFilter: 'blur(0px)',
                          background: 'rgba(0, 202, 166, 0)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.setProperty('backdrop-filter', 'blur(8px)');
                          e.currentTarget.style.background = 'rgba(0, 202, 166, 0.1)';
                          e.currentTarget.style.color = '#006A6A';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.setProperty('backdrop-filter', 'blur(0px)');
                          e.currentTarget.style.background = 'rgba(0, 202, 166, 0)';
                          e.currentTarget.style.color = '#00CAA6';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {t("sources.button")}
                    </button>
                      <span className="font-bold text-teal-medium">www.oxygentoken.org</span>
                      <span>{fecha}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Modal de fuentes */}
        {showSourcesModal && (
          <div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{
              backgroundColor: sourcesModalClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.6)',
              transition: 'background-color 0.3s ease-out'
            }}
            onClick={closeSourcesModal}
          >
            <div 
              className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl flex flex-col"
              style={{
                animation: sourcesModalClosing 
                  ? 'modalFadeOut 0.3s ease-in forwards' 
                  : 'modalFadeIn 0.4s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-teal-dark to-teal-medium border-b border-gray-200 p-6 rounded-t-2xl flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">{t("sources.modalTitle")}</h2>
                  <button 
                    onClick={closeSourcesModal}
                    className="text-white/80 hover:text-white text-2xl font-bold transition-all duration-200 hover:scale-110 hover:rotate-90"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div 
                className="flex-1 p-6 bg-gray-50"
                style={{
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                  @keyframes modalFadeIn {
                    from {
                      opacity: 0;
                      transform: scale(0.9) translateY(-20px);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1) translateY(0);
                    }
                  }
                  @keyframes modalFadeOut {
                    from {
                      opacity: 1;
                      transform: scale(1) translateY(0);
                    }
                    to {
                      opacity: 0;
                      transform: scale(0.95) translateY(-10px);
                    }
                  }
                `}</style>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Transporte */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.transport.title")}</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong className="text-teal-dark">{t("sources.transport.personalVehicles")}</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• <a href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal1")}</a></li>
                        <li>• <a href="https://evse.com.au/blog/how-much-carbon-dioxide-does-an-internal-combustion-hybrid-and-electric-car-emit/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal2")}</a></li>
                        <li>• <a href="https://ourworldindata.org/travel-carbon-footprint" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal3")}</a></li>
                      </ul>
                      <p><strong className="text-teal-dark">{t("sources.transport.publicTransport")}</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• <a href="https://www.carbonindependent.org/20.html" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.public1")}</a></li>
                        <li>• {t("sources.transport.public2")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Vuelos */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.flights.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• {t("sources.flights.item1")}</li>
                        <li>• <a href="https://flygrn.com/blog/carbon-emission-factors-used-by-flygrn" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.flights.item2")}</a></li>
                        <li>• <a href="https://ourworldindata.org/travel-carbon-footprint" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.flights.item3")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Dieta */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.diet.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• {t("sources.diet.item1")}</li>
                        <li>• <a href="https://www.ethicalconsumer.org/food-drink/climate-impact-meat-vegetarian-vegan-diets" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.diet.item2")}</a></li>
                        <li>• <a href="https://css.umich.edu/publications/factsheets/sustainability-indicators/carbon-footprint-factsheet" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.diet.item3")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Energía */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.energy.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.iea.org/reports/global-energy-co2-status-report-2019/emissions" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.energy.item1")}</a></li>
                        <li>• {t("sources.energy.item2")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bienes y servicios */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.goods.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.greenfi.com/resources/carbon-footprint-calculation-methodology" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.goods.item1")}</a></li>
                        <li>• <a href="https://news.climate.columbia.edu/2020/12/16/buying-stuff-drives-climate-change/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.goods.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Basura */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.waste.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.epa.gov/lmop/frequent-questions-about-landfill-gas" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.waste.item1")}</a></li>
                        <li>• <a href="https://www.changeit.app/blog/recycle-matters/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.waste.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Energías renovables */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.renewable.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.carbonindependent.org/15.html" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.renewable.item1")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Cruceros */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.cruises.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://foe.org/news/cruise-passengers-carbon/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.cruises.item1")}</a></li>
                        <li>• <a href="https://theicct.org/marine-cruising-flying-may22/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.cruises.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Créditos */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.credits.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.causeartist.com/what-is-a-carbon-credit/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.credits.item1")}</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
        <div className="pt-16 pb-4 px-4 sm:px-5 lg:px-8 min-h-screen flex items-center justify-center relative">
          {/* Fondo verde original restaurado */}
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
          <div className="relative z-10 w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl flex flex-col border border-teal-medium/20 h-[85vh] lg:h-[80vh] overflow-hidden">
            
            {/* Main Question Panel - Top */}
            <div className="flex-1 relative overflow-hidden flex lg:flex-row">
              {/* Desktop: Split layout, Mobile: Single column */}
              <div className="hidden lg:block lg:w-[300px] xl:w-[320px] flex-shrink-0 bg-white p-4 lg:p-5 flex flex-col justify-between">
                <div className="text-center mb-4 lg:mb-5">
                  <h3 className="text-teal-dark font-bold text-base lg:text-lg xl:text-xl mb-2 lg:mb-3">
                    {t(`sections.${currentSection}`)}
                  </h3>
                  <div className="text-sm lg:text-base xl:text-lg text-teal-medium mb-4 lg:mb-5">
                    {t("progress", { current: currentQuestion + 1, total: QUESTIONS.length })}
                  </div>
                  
                  {/* Current Emissions Display - Con efecto solo en el valor */}
                  <div className="bg-teal-lighter/30 rounded-2xl lg:rounded-2xl p-4 lg:p-5 xl:p-5 mb-4 lg:mb-5"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0, 202, 166, 0.2), rgba(0, 106, 106, 0.1))',
                         backdropFilter: 'blur(10px)',
                         border: '1px solid rgba(0, 202, 166, 0.3)'
                       }}>
                    <div className="text-xs lg:text-sm xl:text-sm text-teal-dark mb-2 font-medium">
                      {t("currentFootprint")}
                    </div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-teal-medium">
                                                                <span className="transition-all duration-300 transform hover:scale-105 inline-block"
                            key={currentEmissions.toFixed(1)}
                            style={{
                              animation: 'fadeInScale 0.4s ease-out'
                            }}>
                        {currentEmissions.toFixed(1)}
                      </span>
                      <span className="text-sm lg:text-base xl:text-lg ml-2">tCO₂e</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="w-full py-2 lg:py-3 xl:py-3 px-3 lg:px-4 rounded-xl text-sm lg:text-sm xl:text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {t("previous")}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className={`w-full py-2 lg:py-3 xl:py-3 px-3 lg:px-4 rounded-xl text-sm lg:text-sm xl:text-base font-semibold transition-all duration-300 transform ${
                      !answers[question.id]
                        ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                        : 'bg-teal-accent text-white shadow-lg hover:bg-teal-accent/90 hover:shadow-xl hover:scale-105 border-2 border-teal-accent'
                    }`}
                  >
                    {currentQuestion === QUESTIONS.length - 1 ? t("finish") : t("next")}
                  </button>
                </div>
              </div>

              {/* Question Panel */}
              <div className="flex-1 relative overflow-hidden">
                {/* Imagen actual */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
                    isTransitioning ? 'opacity-70 scale-102' : 'opacity-100 scale-100'
                  }`}
                  style={{ 
                    backgroundImage: `url('${backgroundImage}')`,
                    willChange: 'transform, opacity'
                  }}
                />
                
                {/* Gradient overlay with project colors - Más suave */}
                <div 
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 106, 106, 0.75) 0%, rgba(0, 202, 166, 0.65) 30%, rgba(1, 33, 56, 0.7) 70%, rgba(11, 136, 153, 0.8) 100%)'
                  }}
                />
                
                {/* Overlay dinámico para transiciones */}
                                  <div className={`absolute inset-0 transition-all duration-400 ease-out ${
                  isTransitioning ? 'bg-black/20' : 'bg-transparent'
                }`} />
                
                <div className="relative h-full flex flex-col items-center text-white text-center px-6 sm:px-8 lg:px-8 py-4 lg:py-6">
                  {/* Mobile: Emissions counter in header */}
                  <div className="lg:hidden w-full mb-3 flex justify-center">
                    <div className="inline-flex items-center">
                                              <div className="text-2xl font-bold text-white">
                                                                  <span className="transition-all duration-300 transform hover:scale-110 inline-block"
                                  key={currentEmissions.toFixed(1)}
                                  style={{
                                    animation: 'fadeInScale 0.4s ease-out'
                                  }}>
                              {currentEmissions.toFixed(1)}
                            </span>
                            <span className="text-xl ml-1 text-white/80">tCO₂e</span>
                          </div>
                    </div>
                  </div>
                    
                  <div className={`flex-1 flex flex-col items-center w-full max-w-2xl transition-all duration-400 ease-out transform ${
                    isTransitioning ? 'opacity-0 translate-y-2 scale-98' : 'opacity-100 translate-y-0 scale-100'
                  } justify-start pt-2 lg:pt-8`}>
                    <h1 className={`text-lg sm:text-xl lg:text-xl xl:text-2xl font-bold mb-3 lg:mb-4 leading-tight transition-all duration-400 ease-out transform break-words text-balance text-center whitespace-pre-line ${
                      isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0 animate-smoothSlide'
                    }`}>
                      {t(question.titleKey)}
                    </h1>
                    
                    <div className={`w-full max-w-lg transition-all duration-400 ease-out transform ${
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
                  
                  {/* Mobile: Navigation buttons at bottom */}
                  <div className="lg:hidden w-full mt-2 space-y-2">
                    <button
                      onClick={handleNext}
                      disabled={!answers[question.id]}
                      className={`w-full py-2 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform ${
                        !answers[question.id]
                          ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                          : 'bg-teal-accent text-white shadow-lg hover:bg-teal-accent/90 hover:shadow-xl hover:scale-105 border-2 border-teal-accent'
                      }`}
                    >
                      {currentQuestion === QUESTIONS.length - 1 ? t("finish") : t("next")}
                    </button>
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="w-full py-2 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/50 text-white hover:bg-white/20 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {t("previous")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Progress Panel - Mobile and Desktop */}
            <div className="bg-white border-t border-teal-medium/20 p-3 lg:p-2">
              {/* Mobile: Simple progress */}
              <div className="lg:hidden">
                <div className="text-center mb-2">
                  <div className="text-xs text-teal-medium">
                    {t("progress", { current: currentQuestion + 1, total: QUESTIONS.length })}
                  </div>
                </div>
                
                {/* Mobile Progress Bar */}
                <div className="relative h-2 mb-2">
                  <div className="bg-teal-lighter/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-accent to-teal-medium shadow-inner relative"
                      style={{ 
                        width: `${progress}%`,
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-xs font-bold text-white bg-teal-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-10"
                    style={{ 
                      left: `${progress}%`,
                      transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {currentQuestion + 1}
                  </div>
                </div>
                
                {/* Mobile Section indicators */}
                <div className="flex justify-between text-xs text-teal-medium px-2">
                  <div className="text-center leading-tight">
                    <div className={currentQuestion <= 3 ? 'font-bold text-teal-dark' : ''}>
                      Transporte
                    </div>
                  </div>
                  <div className="text-center leading-tight">
                    <div className={currentQuestion >= 4 && currentQuestion <= 6 ? 'font-bold text-teal-dark' : ''}>
                      Vuelos y
                    </div>
                    <div className={currentQuestion >= 4 && currentQuestion <= 6 ? 'font-bold text-teal-dark' : ''}>
                      Alimentación
                    </div>
                  </div>
                  <div className="text-center leading-tight">
                    <div className={currentQuestion >= 7 ? 'font-bold text-teal-dark' : ''}>
                      Energía y
                    </div>
                    <div className={currentQuestion >= 7 ? 'font-bold text-teal-dark' : ''}>
                      Estilo de Vida
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Full progress bar outside */}
              <div className="hidden lg:block">
                <div className="relative h-4 my-3">
                  <div className="bg-gradient-to-r from-teal-lighter/30 via-teal-lighter/40 to-teal-lighter/30 rounded-full h-4 backdrop-blur border border-teal-medium/30 shadow-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-accent via-teal-light to-teal-accent shadow-inner relative"
                      style={{ 
                        width: `${progress}%`,
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                  
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-xs font-bold text-teal-dark bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-xl border-3 border-teal-accent z-10"
                    style={{ 
                      left: `${progress}%`,
                      transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {currentQuestion + 1}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-teal-medium font-medium px-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full transition-all duration-100 ${
                      currentQuestion <= 3 
                        ? 'bg-teal-accent shadow-lg border-2 border-teal-dark' 
                        : 'bg-teal-lighter/40 border border-teal-medium/50'
                    }`} />
                    <div className="text-center leading-tight">
                      <div className={currentQuestion <= 3 ? 'text-teal-dark font-bold' : ''}>
                        Transporte
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full transition-all duration-100 ${
                      currentQuestion >= 4 && currentQuestion <= 6 
                        ? 'bg-teal-accent shadow-lg border-2 border-teal-dark' 
                        : 'bg-teal-lighter/40 border border-teal-medium/50'
                    }`} />
                    <div className="text-center leading-tight">
                      <div className={currentQuestion >= 4 && currentQuestion <= 6 ? 'text-teal-dark font-bold' : ''}>
                        Vuelos y
                      </div>
                      <div className={currentQuestion >= 4 && currentQuestion <= 6 ? 'text-teal-dark font-bold' : ''}>
                        Alimentación
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full transition-all duration-100 ${
                      currentQuestion >= 7 
                        ? 'bg-teal-accent shadow-lg border-2 border-teal-dark' 
                        : 'bg-teal-lighter/40 border border-teal-medium/50'
                    }`} />
                    <div className="text-center leading-tight">
                      <div className={currentQuestion >= 7 ? 'text-teal-dark font-bold' : ''}>
                        Energía y
                      </div>
                      <div className={currentQuestion >= 7 ? 'text-teal-dark font-bold' : ''}>
                        Estilo de Vida
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal de progreso */}
        {(modalState === 'form' || modalState === 'thanks') && (
          <div className="fixed inset-0 z-[150] pointer-events-none opacity-60 bg-black"></div>
        )}
        {(modalState === 'form' || modalState === 'thanks') && (
          <ProgressModal
            show={modalState === 'form' || modalState === 'thanks'}
            modalState={modalState}
            modalAnimation={modalAnimation}
            userInfo={userInfo}
            handleNameChange={handleNameChange}
            handleEmailChange={handleEmailChange}
            handleModalSubmit={handleModalSubmit}
            handleClose={handleCloseModal}
            t={t}
          />
        )}
      </div>
    );
  }

  // Pantalla de selección Individual/Empresa
  if (showCalculator && !showQuestions && !showResults) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 pb-4 px-4 sm:px-5 lg:px-8 min-h-screen flex items-center justify-center relative">
          {/* Fondo verde original restaurado */}
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
          <div className="relative z-10 w-full max-w-7xl h-auto min-h-[500px] lg:h-[600px] bg-white rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-teal-medium/20 transition-all duration-150 ease-in-out">
            {/* Left White Panel */}
            <div className="w-full lg:w-[380px] flex-shrink-0 bg-white p-6 lg:p-8 flex flex-col justify-center rounded-t-[2rem] lg:rounded-t-none lg:rounded-l-[2rem]">
              <h3 className="text-teal-dark font-bold text-lg mb-8 text-center transition-all duration-100">
                {t("howToCompensate")}
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setCalculatorType('individual');
                    setShowQuestions(true);
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg ${
                    calculatorType === 'individual'
                      ? 'bg-teal-medium text-white hover:bg-teal-dark'
                      : 'border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white'
                  }`}
                >
                  {t("individual")}
                </button>
                <button 
                  onClick={() => {
                    setCalculatorType('company');
                    setShowQuestions(true);
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg ${
                    calculatorType === 'company'
                      ? 'bg-teal-medium text-white hover:bg-teal-dark'
                      : 'border-2 border-teal-medium text-teal-medium hover:bg-teal-medium hover:text-white'
                  }`}
                >
                  {t("company")}
                </button>
              </div>
            </div>
            {/* Right Image Panel */}
            <div className="flex-1 relative rounded-b-[2rem] lg:rounded-b-none lg:rounded-r-[2rem] overflow-hidden min-h-[300px] lg:min-h-auto">
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
              <div className="absolute inset-0 bg-teal-dark/20 transition-all duration-100" />
              <div className="relative h-full flex flex-col items-center text-white text-center px-6 lg:px-8 py-8 lg:py-16">
                <div className="flex-1 flex flex-col justify-center items-center max-w-2xl">
                  <h1 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 leading-tight transition-all duration-100">
                    {t("calculateTitle")}<sub className="text-lg lg:text-2xl align-super">2</sub>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed mb-6 lg:mb-10 max-w-xl transition-all duration-100">
                    {t("calculateDescription")}
                  </p>
                </div>
                
                {/* Botón Fuentes */}
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => setShowSourcesModal(true)}
                    className="text-white/80 px-3 py-2 rounded transition-all duration-300 cursor-pointer font-medium text-sm"
                    style={{
                      backdropFilter: 'blur(0px)',
                      background: 'rgba(255, 255, 255, 0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.setProperty('backdrop-filter', 'blur(8px)');
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('backdrop-filter', 'blur(0px)');
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {t("sources.button")}
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        
        {/* Modal de fuentes */}
        {showSourcesModal && (
          <div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{
              backgroundColor: sourcesModalClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.6)',
              transition: 'background-color 0.3s ease-out'
            }}
            onClick={closeSourcesModal}
          >
            <div 
              className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl flex flex-col"
              style={{
                animation: sourcesModalClosing 
                  ? 'modalFadeOut 0.3s ease-in forwards' 
                  : 'modalFadeIn 0.4s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-teal-dark to-teal-medium border-b border-gray-200 p-6 rounded-t-2xl flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">{t("sources.modalTitle")}</h2>
                  <button 
                    onClick={closeSourcesModal}
                    className="text-white/80 hover:text-white text-2xl font-bold transition-all duration-200 hover:scale-110 hover:rotate-90"
                  >
                    ×
                  </button>
        </div>
              </div>
              
              <div 
                className="flex-1 p-6 bg-gray-50"
                style={{
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                  @keyframes modalFadeIn {
                    from {
                      opacity: 0;
                      transform: scale(0.9) translateY(-20px);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1) translateY(0);
                    }
                  }
                  @keyframes modalFadeOut {
                    from {
                      opacity: 1;
                      transform: scale(1) translateY(0);
                    }
                    to {
                      opacity: 0;
                      transform: scale(0.95) translateY(-10px);
                    }
                  }
                `}</style>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Transporte */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.transport.title")}</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong className="text-teal-dark">{t("sources.transport.personalVehicles")}</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• <a href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal1")}</a></li>
                        <li>• <a href="https://evse.com.au/blog/how-much-carbon-dioxide-does-an-internal-combustion-hybrid-and-electric-car-emit/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal2")}</a></li>
                        <li>• <a href="https://ourworldindata.org/travel-carbon-footprint" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.personal3")}</a></li>
                      </ul>
                      <p><strong className="text-teal-dark">{t("sources.transport.publicTransport")}</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• <a href="https://www.carbonindependent.org/20.html" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.transport.public1")}</a></li>
                        <li>• {t("sources.transport.public2")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Vuelos */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.flights.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• {t("sources.flights.item1")}</li>
                        <li>• <a href="https://flygrn.com/blog/carbon-emission-factors-used-by-flygrn" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.flights.item2")}</a></li>
                        <li>• <a href="https://ourworldindata.org/travel-carbon-footprint" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.flights.item3")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Dieta */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.diet.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• {t("sources.diet.item1")}</li>
                        <li>• <a href="https://www.ethicalconsumer.org/food-drink/climate-impact-meat-vegetarian-vegan-diets" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.diet.item2")}</a></li>
                        <li>• <a href="https://css.umich.edu/publications/factsheets/sustainability-indicators/carbon-footprint-factsheet" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.diet.item3")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Energía */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.energy.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.iea.org/reports/global-energy-co2-status-report-2019/emissions" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.energy.item1")}</a></li>
                        <li>• {t("sources.energy.item2")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bienes y servicios */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.goods.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.greenfi.com/resources/carbon-footprint-calculation-methodology" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.goods.item1")}</a></li>
                        <li>• <a href="https://news.climate.columbia.edu/2020/12/16/buying-stuff-drives-climate-change/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.goods.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Basura */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.waste.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.epa.gov/lmop/frequent-questions-about-landfill-gas" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.waste.item1")}</a></li>
                        <li>• <a href="https://www.changeit.app/blog/recycle-matters/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.waste.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Energías renovables */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.renewable.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.carbonindependent.org/15.html" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.renewable.item1")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Cruceros */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.cruises.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://foe.org/news/cruise-passengers-carbon/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.cruises.item1")}</a></li>
                        <li>• <a href="https://theicct.org/marine-cruising-flying-may22/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.cruises.item2")}</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Créditos */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-dark mb-3 border-b border-teal-medium/30 pb-2">{t("sources.credits.title")}</h3>
                    <div className="text-sm text-gray-700">
                      <ul className="space-y-1">
                        <li>• <a href="https://www.causeartist.com/what-is-a-carbon-credit/" target="_blank" rel="noopener noreferrer" className="text-teal-medium hover:text-teal-dark font-medium hover:underline transition-colors">{t("sources.credits.item1")}</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

function TreesIcon() {
  return (
    <svg
      viewBox="0 0 81 87"
      width={60}
      height={60}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49.84 64.443V86h8.098V64.747c0-.168.136-.304.304-.304h21.683c.059 0 .095-.061.063-.108l-10.915-16.44c-.03-.047.005-.108.064-.108h7.779c.058 0 .094-.06.063-.108l-10.78-16.26c-.03-.048.005-.109.064-.109h7.45c.059 0 .095-.06.064-.108L53.95 1.033a.077.077 0 0 0-.127 0L40.5 21.31M23.066 86V64.747a.303.303 0 0 0-.303-.304H1.075c-.059 0-.095-.061-.063-.108l10.919-16.44c.031-.047-.005-.108-.063-.108h-7.78c-.058 0-.094-.06-.063-.108l10.78-16.26c.03-.048-.005-.109-.064-.109h-7.45c-.059 0-.094-.06-.063-.108L27.049 1.033a.077.077 0 0 1 .127 0l19.826 30.169c.031.047-.005.108-.063.108h-7.45c-.06 0-.095.061-.064.108l10.78 16.261c.03.047-.005.108-.064.108h-7.779c-.059 0-.095.062-.063.108l10.92 16.44c.03.047-.005.108-.064.108H31.467a.303.303 0 0 0-.303.304V86h-8.098Z"
        className="stroke-white"
        strokeWidth="1.733"
        strokeMiterlimit="10"
      />
    </svg>
  );
}