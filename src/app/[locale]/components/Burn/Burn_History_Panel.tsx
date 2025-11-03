"use client";
import { PiCaretUpDown } from "react-icons/pi";

const mockBurnHistory = [
  { fecha: '15/09/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '24/08/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '10/08/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '06/07/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '13/05/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '02/05/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '27/04/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
  { fecha: '18/01/2023', cantidad: '0.00000', creditos: '0.00000', impacto: '+0.00%' },
];

export default function Burn_History_Panel() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4">Historial</h2>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-shrink-0">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#539390] border-b border-white/20">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm w-[25%]">
                  <div className="flex items-center gap-1">
                    <span>Fecha</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm w-[25%]">
                  <div className="flex items-center gap-1">
                    <span>Cantidad</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm w-[25%]">
                  <div className="flex items-center gap-1">
                    <span>Créditos</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm w-[25%]">
                  <div className="flex items-center gap-1">
                    <span>Impacto</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full table-fixed">
            <tbody>
              {mockBurnHistory.map((burn, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm w-[25%]">{burn.fecha}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm w-[25%]">{burn.cantidad}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm w-[25%]">{burn.creditos}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[#5EEAD4] text-xs sm:text-sm w-[25%]">{burn.impacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

