"use client";
import { useState } from "react";
import { PiArrowsDownUp, PiQuestion } from "react-icons/pi";

export default function Exchange_Panel() {
  const [payAmount, setPayAmount] = useState("0000");
  const [receiveAmount, setReceiveAmount] = useState("0000");
  const [payCurrency, setPayCurrency] = useState("OM");
  const [receiveCurrency, setReceiveCurrency] = useState("USDT");
  const [rotation, setRotation] = useState(0);

  const handleSwap = () => {
    setRotation(rotation + 180);
    
    const tempAmount = payAmount;
    const tempCurrency = payCurrency;
    
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
    setPayCurrency(receiveCurrency);
    setReceiveCurrency(tempCurrency);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-white text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6">
        Intercambiar Token
      </h2>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="space-y-2">
          <label className="text-white/70 text-sm">Pagá</label>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center overflow-hidden">
            <input
              type="text"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="flex-1 bg-transparent text-white text-lg px-4 py-3 outline-none"
              placeholder="0000"
            />
            <div className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/10">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">O</span>
              </div>
              <span className="text-white font-medium">{payCurrency}</span>
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-center relative z-10 my-2 sm:my-3">
          <button
            onClick={handleSwap}
            className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full border-2 border-white/30 flex items-center justify-center active:scale-95 transition-all duration-300 shadow-lg"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <PiArrowsDownUp className="w-7 h-7 text-white transition-transform duration-300" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-white/70 text-sm">Recibí</label>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center overflow-hidden">
            <input
              type="text"
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              className="flex-1 bg-transparent text-white text-lg px-4 py-3 outline-none"
              placeholder="0000"
            />
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-white font-medium">{receiveCurrency}</span>
            </div>
          </div>
        </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4 space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Tasa de cambio</span>
              <span className="text-white text-sm">1 USDT=0000 OM</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Precio</span>
              <span className="text-white text-sm">0000 USDT / OM</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-sm">Mínimo recibido</span>
                <button className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <PiQuestion className="w-3 h-3 text-white/70" />
                </button>
              </div>
              <span className="text-white text-sm">0000 USDT</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-sm">Impacto sobre los precios</span>
                <button className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <PiQuestion className="w-3 h-3 text-white/70" />
                </button>
              </div>
              <span className="text-white text-sm">0.00%</span>
            </div>
          </div>
        </div>

        <button className="w-auto mx-auto px-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-teal-500/50 hover:scale-105 active:scale-95 border-2 border-white/20">
          Intercambiar
        </button>
      </div>
    </div>
  );
}

