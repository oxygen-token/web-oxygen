"use client";
import { PiCaretUpDown } from "react-icons/pi";

const mockExchangeHistory = [
  { fecha: '15/09/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '24/08/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '10/08/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '06/07/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '13/05/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '02/05/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '27/04/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
  { fecha: '18/01/2023', precioToken: '0.00000', precioUSDT: '$0.00000', cantidad: '00.0', totalToken: '0.00000' },
];

export default function Exchange_History_Panel() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4">Mis intercambios</h2>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-shrink-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#539390] border-b border-white/20">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span>Fecha</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span>Precio (Token)</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span>Precio (USDT)</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span>Cantidad</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span>Total Token</span>
                    <PiCaretUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full">
            <tbody>
              {mockExchangeHistory.map((exchange, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm">{exchange.fecha}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm">{exchange.precioToken}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm">{exchange.precioUSDT}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm">{exchange.cantidad}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4 text-white text-xs sm:text-sm">{exchange.totalToken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

