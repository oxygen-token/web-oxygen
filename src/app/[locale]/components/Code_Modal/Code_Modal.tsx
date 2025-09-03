"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface Code_Modal_Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<boolean>;
}

export default function Code_Modal({ show, onClose, onSubmit }: Code_Modal_Props) {
  const t = useTranslations("Calculator.verificationModal");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setCode(['', '', '', '', '', '']);
      setActiveIndex(0);
      setIsLoading(false);
      setHasError(false);
      
      const modalTimer = setTimeout(() => {
        setIsModalVisible(true);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }, 50);
      
      return () => clearTimeout(modalTimer);
    }
  }, [show]);

  const handleClose = () => {
    return;
  };

  const handleCodeChange = async (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        setIsLoading(true);
        setHasError(false);
        
        try {
          const success = await onSubmit(fullCode);
          if (!success) {
            setHasError(true);
            setIsLoading(false);
            setCode(['', '', '', '', '', '']);
            setActiveIndex(0);
            setTimeout(() => {
              inputRefs.current[0]?.focus();
            }, 100);
          }
        } catch (error) {
          setHasError(true);
          setIsLoading(false);
          setCode(['', '', '', '', '', '']);
          setActiveIndex(0);
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      setIsLoading(true);
      setHasError(false);
      
              try {
          const success = await onSubmit(fullCode);
          if (!success) {
            setHasError(true);
            setIsLoading(false);
            setCode(['', '', '', '', '', '']);
            setActiveIndex(0);
            setTimeout(() => {
              inputRefs.current[0]?.focus();
            }, 100);
          }
        } catch (error) {
          setHasError(true);
          setIsLoading(false);
          setCode(['', '', '', '', '', '']);
          setActiveIndex(0);
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        }
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {}}
      />
      <div 
        className={`relative bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent rounded-[2rem] shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4 transform transition-all duration-500 ease-out ${
          isModalVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-90 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
            <p className="text-white/80 mb-3">{t("description")}</p>
            <p className="text-white/60 text-sm">{t("emailDetails")}</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6 backdrop-blur-sm">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-white rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-white ml-3">{t("verifying")}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={() => setActiveIndex(index)}
                      disabled={isLoading}
                      className={`w-12 h-12 text-center text-2xl font-bold bg-gray-800/60 border-2 rounded-lg text-white transition-all duration-200 focus:outline-none ${
                        hasError 
                          ? 'border-red-400/70 focus:border-red-300/70' 
                          : activeIndex === index 
                            ? 'border-gray-500/70 focus:border-gray-400/70' 
                            : 'border-gray-600/50 focus:border-gray-500/70'
                      }`}
                      style={{ caretColor: 'transparent' }}
                    />
                  ))}
                </div>
                {hasError && (
                  <div className="text-red-300 text-sm mt-3 text-center">
                    {t("errorMessage")}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!isCodeComplete || isLoading}
              className={`w-full max-w-xs font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
                isCodeComplete && !isLoading
                  ? 'bg-white text-teal-dark hover:bg-white/90 hover:scale-105'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              {isLoading ? t("verifying") : t("verifyButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
