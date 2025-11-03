"use client";
import Image from "next/image";
import Token_Chip from "./Token_Chip";

export default function Wallet_Tokens_Panel() {
  return (
    <div className="h-full flex flex-col gap-3">
      <h2 className="text-white font-semibold text-sm sm:text-base">Tokens en tú billetera</h2>
      
      <div className="flex items-end gap-3">
        <div className="flex items-center justify-center flex-shrink-0">
          <Image 
            src="/assets/images/icons/Wallet_icon.svg" 
            alt="Wallet" 
            width={64} 
            height={64} 
            className="w-16 h-16"
          />
        </div>
        <div className="text-white text-lg sm:text-xl">
          <span className="font-bold">0.000</span> <span className="font-normal">Tokens</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        <Token_Chip 
          title="Token OM"
          value="0.000"
          subtitle="000 m²"
          icon="/assets/images/icons/OM_icon.svg"
        />
        
        <Token_Chip 
          title="Token OC"
          value="0.000"
          subtitle="000 CO absorbido"
          icon="/assets/images/icons/OC_icon.svg"
        />
        
        <Token_Chip 
          title="Tokens quemados"
          value="00"
          icon="/assets/images/icons/BurnsToken_icon.svg"
        />
      </div>
    </div>
  );
}

