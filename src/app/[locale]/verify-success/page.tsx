"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Light_Rays from "../components/ui/Light_Rays";
import Rotating_Text from "../components/ui/Rotating_Text";
import { useAuth } from "../context/Auth_Context";

const VerifySuccess = () => {
  const t = useTranslations("VerifySuccess");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const sessionToken = searchParams.get("session_token");

      console.log("📧 Starting email verification...");
      console.log("Token:", token);
      console.log("Session token:", sessionToken);

      // Caso 1: Tenemos session_token (el backend ya verificó el email)
      if (sessionToken) {
        console.log("📡 Session token found, establishing session...");
        try {
          const response = await fetch("/api/auth/set-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: sessionToken }),
            credentials: "include",
          });

          const data = await response.json();

          if (response.ok && data.success) {
            console.log("✅ Session established successfully");

            // Esperar un momento para que las cookies se propaguen
            await new Promise(resolve => setTimeout(resolve, 500));

            setVerificationStatus("success");

            // Obtener datos del usuario desde /session con retry
            let sessionData = null;
            let retries = 3;

            while (retries > 0 && (!sessionData || !sessionData.loggedIn)) {
              const sessionResponse = await fetch("/api/auth/session", {
                credentials: "include",
              });
              sessionData = await sessionResponse.json();

              if (sessionData.loggedIn) {
                console.log("✅ Session data retrieved successfully");
                break;
              }

              retries--;
              if (retries > 0) {
                console.log(`⏳ Session not ready, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 300));
              }
            }

            if (sessionData && sessionData.loggedIn) {
              setUser({
                username: sessionData.fullName || sessionData.username || '',
                email: sessionData.email || '',
                isFirstLogin: sessionData.isFirstLogin ?? true,
                welcomeModalShown: sessionData.welcomeModalShown ?? false,
                onboardingStep: sessionData.onboardingStep || "pending",
                affiliateCode: sessionData.affiliateCode || null,
                affiliateCodeUsedAt: sessionData.affiliateCodeUsedAt || null,
                carbonCredits: sessionData.carbonCredits ?? 0,
                omBalance: sessionData.omBalance ?? 0,
                bonusOMsReceived: sessionData.bonusOMsReceived ?? 0,
              });
            }
          } else {
            console.error("❌ Set session failed:", data);
            setVerificationStatus("error");
            setErrorMessage(data.error || "Failed to establish session");
          }
        } catch (error) {
          console.error("❌ Error setting session:", error);
          setVerificationStatus("error");
          setErrorMessage("Network error occurred");
        }
        return;
      }

      // Caso 2: Tenemos token de verificación
      if (!token) {
        console.log("❌ No token found in URL");
        setVerificationStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("✅ Email verification successful");

          // Si el backend devuelve session_token, establecer la sesión
          if (data.session_token) {
            const sessionResponse = await fetch("/api/auth/set-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_token: data.session_token }),
              credentials: "include",
            });

            if (sessionResponse.ok) {
              console.log("✅ Session established");

              // Esperar un momento para que las cookies se propaguen
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          setVerificationStatus("success");

          // Obtener datos del usuario con retry
          let sessionData = null;
          let retries = 3;

          while (retries > 0 && (!sessionData || !sessionData.loggedIn)) {
            const sessionResponse = await fetch("/api/auth/session", {
              credentials: "include",
            });
            sessionData = await sessionResponse.json();

            if (sessionData.loggedIn) {
              console.log("✅ Session data retrieved successfully");
              break;
            }

            retries--;
            if (retries > 0) {
              console.log(`⏳ Session not ready, retrying... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }

          if (sessionData && sessionData.loggedIn) {
            setUser({
              username: sessionData.fullName || sessionData.username || '',
              email: sessionData.email || '',
              isFirstLogin: sessionData.isFirstLogin ?? true,
              welcomeModalShown: sessionData.welcomeModalShown ?? false,
              onboardingStep: sessionData.onboardingStep || "pending",
              affiliateCode: sessionData.affiliateCode || null,
              affiliateCodeUsedAt: sessionData.affiliateCodeUsedAt || null,
              carbonCredits: sessionData.carbonCredits ?? 0,
              omBalance: sessionData.omBalance ?? 0,
              bonusOMsReceived: sessionData.bonusOMsReceived ?? 0,
            });
          }
        } else {
          console.error("❌ Verification failed:", data);
          setVerificationStatus("error");
          setErrorMessage(data.error || data.message || "Verification failed");
        }
      } catch (error) {
        console.error("❌ Email verification error:", error);
        setVerificationStatus("error");
        setErrorMessage("Network error occurred");
      }
    };

    verifyEmail();
  }, [searchParams, setUser]);

  // Auto-redirect countdown cuando la verificación es exitosa
  useEffect(() => {
    if (verificationStatus === "success") {
      const locale = window.location.pathname.split("/")[1] || "es";
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Usar window.location.href para forzar recarga completa de cookies
            window.location.href = `/${locale}/dashboard`;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [verificationStatus]);

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

                <p className="text-base text-white/80 mb-6 leading-relaxed">
                  {t("description")}
                </p>

                <p className="text-sm text-white/60 mb-4">
                  {t("redirecting") || "Redirigiendo al dashboard en"} {redirectCountdown}...
                </p>

                <button
                  onClick={() => {
                    const locale = window.location.pathname.split("/")[1] || "es";
                    // Usar window.location.href para forzar recarga completa de cookies
                    window.location.href = `/${locale}/dashboard`;
                  }}
                  className="w-full max-w-xs py-3 px-6 text-base font-medium bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 transition-colors text-center"
                >
                  {t("goToDashboard") || "Ir al Dashboard"}
                </button>
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
