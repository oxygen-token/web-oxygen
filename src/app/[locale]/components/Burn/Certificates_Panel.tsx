"use client";
import { PiCaretUpDown } from "react-icons/pi";

const mockCertificates = [
  { fecha: '31/10/2023', nombre: 'Cert.2023', proyecto: 'Proyecto', token: 'Token OM', cantidad: '00.0' },
  { fecha: '11/08/2022', nombre: 'Cert.2022', proyecto: 'Proyecto', token: 'Token OM', cantidad: '00.0' },
  { fecha: '21/04/2021', nombre: 'Cert.2021', proyecto: 'Proyecto', token: 'Token OC', cantidad: '00.0' },
  { fecha: '04/06/2019', nombre: 'Cert.2019', proyecto: 'Proyecto', token: 'Token OC', cantidad: '00.0' },
];

export default function Certificates_Panel() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold text-sm sm:text-base mb-1">Mis certificados</h2>
      
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-shrink-0">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#539390] border-b border-white/20">
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[12%]">
                  <div className="flex items-center gap-1">
                    <span>Fecha</span>
                    <PiCaretUpDown className="w-3 h-3 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[15%]">
                  <div className="flex items-center gap-1">
                    <span>Nombre</span>
                    <PiCaretUpDown className="w-3 h-3 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[15%]">
                  <div className="flex items-center gap-1">
                    <span>Proyecto</span>
                    <PiCaretUpDown className="w-3 h-3 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[18%]">
                  <div className="flex items-center gap-1">
                    <span>Token quemados</span>
                    <PiCaretUpDown className="w-3 h-3 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[15%]">
                  <div className="flex items-center gap-1">
                    <span>Cantidad</span>
                    <PiCaretUpDown className="w-3 h-3 text-white/70" />
                  </div>
                </th>
                <th className="text-left py-1 px-2 text-white font-medium text-xs w-[25%]">
                  <span>Acción</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full table-fixed">
            <tbody>
              {mockCertificates.map((cert, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="text-left py-1 px-2 text-white text-xs w-[12%]">{cert.fecha}</td>
                  <td className="text-left py-1 px-2 text-white text-xs w-[15%]">{cert.nombre}</td>
                  <td className="text-left py-1 px-2 text-white text-xs w-[15%]">{cert.proyecto}</td>
                  <td className="text-left py-1 px-2 text-white text-xs w-[18%]">{cert.token}</td>
                  <td className="text-left py-1 px-2 text-white text-xs w-[15%]">{cert.cantidad}</td>
                  <td className="text-left py-1 px-2 w-[25%]">
                    <button className="flex items-center gap-1 px-2 py-1 rounded border border-white/30 text-white text-xs hover:bg-white/10 transition-all">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Descargar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

