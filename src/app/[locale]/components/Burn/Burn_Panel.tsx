"use client";
import { useState, useEffect, useRef } from "react";
import { PiQuestion, PiArrowDown } from "react-icons/pi";
import Image from "next/image";

export default function Burn_Panel() {
  const [burnAmount, setBurnAmount] = useState("0000");
  const [tokenType, setTokenType] = useState("OM");
  const [confirmed, setConfirmed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-white text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6">
        Quemar Token
      </h2>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="space-y-2 relative">
            <label className="text-white/70 text-sm">Cantidad a quemar</label>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center">
              <input
                type="text"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg px-4 py-3 outline-none"
                placeholder="0000"
              />
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/10 border-l border-white/20"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    tokenType === "OM" ? "bg-white" : "bg-white"
                  }`}>
                    {tokenType === "OM" ? (
                      <Image 
                        src="/assets/images/icons/OM_icon.svg" 
                        alt="OM" 
                        width={20} 
                        height={20} 
                        className="w-4 h-4"
                      />
                    ) : (
                      <Image 
                        src="/assets/images/icons/OC_icon.svg" 
                        alt="OC" 
                        width={20} 
                        height={20} 
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                  <span className="text-white font-medium">{tokenType}</span>
                  <svg className={`w-4 h-4 text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {dropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg z-[100] min-w-full whitespace-nowrap overflow-hidden"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTokenType("OM");
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors rounded-t-xl cursor-pointer select-none ${
                        tokenType === "OM" ? "bg-white/20" : ""
                      }`}
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Image 
                          src="/assets/images/icons/OM_icon.svg" 
                          alt="OM" 
                          width={20} 
                          height={20} 
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-white font-medium">OM</span>
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTokenType("OC");
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors rounded-b-xl cursor-pointer select-none ${
                        tokenType === "OC" ? "bg-white/20" : ""
                      }`}
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Image 
                          src="/assets/images/icons/OC_icon.svg" 
                          alt="OC" 
                          width={20} 
                          height={20} 
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-white font-medium">OC</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center relative z-10 my-2 sm:my-3">
            <button
              className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 shadow-lg pointer-events-none opacity-70"
            >
              <PiArrowDown className="w-7 h-7 text-white" />
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4 space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Token</span>
              <span className="text-white text-sm">Token {tokenType} (0)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-sm">Tarifa de transacción</span>
                <button className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <PiQuestion className="w-3 h-3 text-white/70" />
                </button>
              </div>
              <span className="text-white text-sm">0000 USDT</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-sm">Tarifa de servicio</span>
                <button className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <PiQuestion className="w-3 h-3 text-white/70" />
                </button>
              </div>
              <span className="text-white text-sm">0000 USDT</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirm-burn"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-teal-600 focus:ring-teal-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="confirm-burn" className="text-white text-sm cursor-pointer">
              Entiendo que esta operación no se puede deshacer
            </label>
          </div>
        </div>

        <button 
          disabled={!confirmed}
          className={`w-full mx-auto px-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-teal-500/50 hover:scale-105 active:scale-95 border-2 border-white/20 ${
            !confirmed ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

