"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Light_Rays from "../components/ui/Light_Rays";
import Rotating_Text from "../components/ui/Rotating_Text";

const PostRegister = () => {
  const t = useTranslations("PostRegister");

  return (
    <>
      <Navbar />
      <section className="relative grid lg:grid-cols-2 items-center min-h-screen px-12 py-32 gap-12 overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-[url('/assets/images/forestHD.jpg')] bg-cover bg-no-repeat bg-fixed opacity-30"
          style={{ zIndex: 1 }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-l from-black via-black/90 to-transparent"
          style={{ zIndex: 2 }}
        />
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 3, pointerEvents: 'none' }}>
          <Light_Rays
            raysOrigin="right"
            raysColor="#00CAA6"
            raysSpeed={1.5}
            lightSpread={0.15}
            rayLength={6}
            fadeDistance={0.2}
            saturation={8.0}
            followMouse={true}
            mouseInfluence={0.9}
            noiseAmount={0.1}
            distortion={0.3}
            pulsating={true}
            className="custom-rays"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center lg:items-start -mt-16 lg:mt-0">
          <Rotating_Text
            staticText="Take action"
            rotatingTexts={["and preserve", "environment", "our future", "the planet"]}
            mainClassName="text-[1.75rem] lg:text-4xl font-medium text-white text-center lg:text-start"
            boxClassName="bg-green-600 text-white px-4 py-2 rounded-lg"
            rotationInterval={3000}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 w-full bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent backdrop-blur-md flex flex-col py-8 px-8 lg:px-12 max-w-xl mx-auto rounded-[2rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
              {t("title")}
            </h1>
            
            <p className="text-lg text-white/90 mb-6">
              {t("subtitle")}
            </p>
            
            <p className="text-base text-white/80 mb-8 leading-relaxed">
              {t("description")}
            </p>

            <Link
              href="/login"
              className="w-full max-w-xs py-3 px-6 text-base font-medium bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 transition-colors text-center"
            >
              {t("loginButton")}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PostRegister;