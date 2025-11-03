"use client";

export default function Burn_Stats_Panel() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4">Estadísticas</h2>
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-white/70 text-sm mb-2">Total quemado</div>
          <div className="text-white text-2xl font-bold">0000.00 OM</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-white/70 text-sm mb-2">Créditos generados</div>
          <div className="text-white text-2xl font-bold">0000.00 tCO₂</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-white/70 text-sm mb-2">Impacto ambiental</div>
          <div className="text-[#5EEAD4] text-2xl font-bold">+0.00%</div>
        </div>
      </div>
    </div>
  );
}

