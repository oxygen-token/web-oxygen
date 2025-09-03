"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Light_Rays from "../components/ui/Light_Rays";
import Rotating_Text from "../components/ui/Rotating_Text";

const VerifySuccess = () => {
  const t = useTranslations("VerifySuccess");
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      console.log("Token from URL:", token);
      console.log("Full URL:", window.location.href);
      console.log("Search params:", searchParams.toString());
      
      if (!token) {
        console.log("No token found in URL");
        setVerificationStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      console.log("Starting email verification...");
      try {
        const response = await fetch("http://localhost:10001/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
          console.log("Verification successful");
          setVerificationStatus("success");
        } else {
          const errorData = await response.json();
          console.log("Verification failed:", errorData);
          setVerificationStatus("error");
          setErrorMessage(errorData.message || "Verification failed");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
        setErrorMessage("Network error occurred");
      }
    };

    verifyEmail();
  }, [searchParams]);

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
        
        <div className="relative z-10 flex flex-col items-center lg:items-start">
          <Rotating_Text
            staticText="Take action"
            rotatingTexts={["and preserve", "environment", "our future", "the planet"]}
            mainClassName="text-4xl font-medium text-white text-center lg:text-start"
            boxClassName="bg-green-600 text-white px-4 py-2 rounded-lg"
            rotationInterval={3000}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 w-full bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent backdrop-blur-md flex flex-col py-8 px-8 lg:px-12 max-w-xl mx-auto rounded-[2rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center text-center">
            {verificationStatus === "loading" && (
              <>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {t("loadingTitle")}
                </h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-6"></div>
                <p className="text-base text-white/80 mb-8">
                  {t("loadingDescription")}
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
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
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {t("errorTitle")}
                </h1>
                
                <p className="text-lg text-white/90 mb-6">
                  {t("errorSubtitle")}
                </p>
                
                <p className="text-base text-white/80 mb-8 leading-relaxed">
                  {errorMessage}. {t("errorDescription")}
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setVerificationStatus("loading");
                      setErrorMessage("");
                      const token = searchParams.get("token");
                      if (token) {
                        window.location.reload();
                      }
                    }}
                    className="w-full py-3 px-6 text-base font-medium bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 transition-colors text-center"
                  >
                    {t("tryAgainButton")}
                  </button>
                  
                  <Link
                    href="/login"
                    className="w-full py-3 px-6 text-base font-medium bg-transparent border border-teal-accent text-teal-accent rounded-lg hover:bg-teal-accent/10 transition-colors text-center"
                  >
                    {t("loginButton")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default VerifySuccess;
