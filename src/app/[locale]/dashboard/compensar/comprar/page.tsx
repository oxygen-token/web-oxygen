"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../../components/ui/Animated_Page";
import { PiArrowLeft } from "react-icons/pi";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Carbon_Footprint_Card from "../../../components/Dashboard/Bottom_Row/Carbon_Footprint_Card";

export default function ComprarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const projectName = searchParams.get("project") || "Proyecto";
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("Project");

  const handleBack = () => {
    router.push(`/${locale}/dashboard/compensar`);
  };

  const getProjectData = () => {
    const name = decodeURIComponent(projectName);
    if (name === "Las Araucarias") {
      return {
        image: "/assets/images/Proyecto_1.png",
        location: "Misiones",
        price: "USD 00,00"
      };
    } else if (name === "Proyecto Salta") {
      return {
        image: "/assets/images/proyectoSalta.png",
        location: "Salta",
        price: "USD 00,00"
      };
    }
    return {
      image: "/assets/images/Proyecto_1.png",
      location: "Misiones",
      price: "USD 00,00"
    };
  };

  const projectData = getProjectData();

  const [quantity, setQuantity] = useState("");
  const pricePerTon = 0.00;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setQuantity(value);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    return (qty * pricePerTon).toFixed(2);
  };

  const handleComprar = () => {
    const qty = parseFloat(quantity) || 0;
    if (qty > 0) {
      console.log("Comprar", qty, "tn CO2");
    }
  };

  const stats = [
    {
      title: "Hectáreas",
      value: "150",
      unit: "ha"
    },
    {
      title: "CO₂ Compensado",
      value: "2.500",
      unit: "tn"
    },
    {
      title: "Árboles Protegidos",
      value: "45.000",
      unit: ""
    }
  ];

  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <PiArrowLeft className="w-5 h-5" />
              <span className="underline text-base sm:text-lg">Atrás</span>
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-semibold">
              {decodeURIComponent(projectName)}
            </h1>
            <div className="w-[120px]"></div>
          </div>

          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
            <div className="flex-[0.4] flex-shrink-0 bg-white/10 rounded-lg border border-white/20 p-4 overflow-auto flex flex-col gap-4 h-[85%] md:h-[80%] max-w-[600px]">
              <div className="relative w-full h-52 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={projectData.image}
                  alt={decodeURIComponent(projectName)}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
              
              <h2 className="text-white text-xl font-bold">
                {decodeURIComponent(projectName)}
              </h2>
              
              <p className="text-white/80 text-base leading-7">
                Este proyecto de conservación forestal se enfoca en proteger y preservar los ecosistemas nativos, contribuyendo directamente a la captura de carbono y la preservación de la biodiversidad. A través de esta iniciativa, estamos garantizando la protección permanente de áreas forestales críticas.
              </p>
              
              <div className="flex flex-row gap-2 flex-shrink-0">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white/10 rounded-lg border border-white/20 p-3 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-white text-lg font-bold mb-1">
                      {stat.value} {stat.unit && <span className="text-white/70 text-sm">{stat.unit}</span>}
                    </span>
                    <span className="text-white/80 text-xs mt-1">{stat.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-[0.6] flex-shrink-0 flex flex-col gap-4 min-h-0 overflow-hidden max-w-[800px]">
              <div className="flex-[0.5] flex-shrink-0 min-h-0 p-4 overflow-auto flex items-start justify-center">
                <div className="w-full max-w-md">
                  <Carbon_Footprint_Card
                    data={{
                      value: "0,00",
                      unit: "tn CO₂",
                      period: "año"
                    }}
                  />
                </div>
              </div>
              <div className="flex-[0.5] flex-shrink-0 min-h-0 p-4 overflow-auto flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-teal-dark font-bold text-lg mb-6 text-center">
                    ¿Cuántas tn de CO2 desea comprar?
                  </h3>
                  
                  <div className="mb-6">
                    <input
                      type="text"
                      value={quantity}
                      onChange={handleQuantityChange}
                      placeholder="Ingresa la cantidad"
                      className="compra-input w-full px-4 py-3 border border-teal-medium/30 rounded-lg focus:ring-2 focus:ring-teal-accent focus:border-teal-accent transition-all duration-100"
                      style={{ 
                        backgroundColor: 'white',
                        color: '#012138',
                      }}
                    />
                    <style jsx global>{`
                      .compra-input {
                        background-color: white !important;
                        color: #012138 !important;
                        border: 1px solid rgba(0, 106, 106, 0.3) !important;
                      }
                      .compra-input::placeholder {
                        color: #6B7280 !important;
                        opacity: 1 !important;
                      }
                      .compra-input:focus {
                        border: 1px solid rgba(0, 202, 166, 0.7) !important;
                        outline: none !important;
                      }
                    `}</style>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-teal-dark">
                      <span>{parseFloat(quantity) || 0} tn CO2</span>
                      <span>USD {calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center text-teal-dark font-bold">
                      <span>Total</span>
                      <span>USD {calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleComprar}
                    className="w-full py-3 px-6 bg-teal-medium hover:bg-teal-dark text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
}

