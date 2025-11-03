"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { PiFlag } from "react-icons/pi";

interface Project_CardProps {
  image: string;
  name: string;
  location: string;
  price: string;
  onClick?: () => void;
}

export default function Project_Card({ image, name, location, price, onClick }: Project_CardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const handleComprarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const projectName = encodeURIComponent(name);
    router.push(`/${locale}/dashboard/compensar/comprar?project=${projectName}`);
  };
  return (
    <div 
      className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        quality={100}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
              <PiFlag className="w-4 h-4 flex-shrink-0" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <div className="text-white font-bold text-base sm:text-lg">
                {price}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">
                / tn CO2
              </div>
            </div>
            
            <button 
              onClick={handleComprarClick}
              className="px-4 sm:px-6 py-2 sm:py-2.5 border border-white rounded-lg text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

