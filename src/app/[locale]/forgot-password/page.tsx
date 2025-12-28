"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Light_Rays from "../components/ui/Light_Rays";
import { InputWithLabel } from "../components/ui/InputWithLabel";
import Star_Border from "../components/ui/Star_Border";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const t = useTranslations("ForgotPassword");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "EMAIL_NOT_FOUND") {
          setError("email", {
            type: "manual",
            message: t("error-not-found"),
          });
        } else {
          setError("root", {
            type: "manual",
            message: t("error-generic"),
          });
        }
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("root", {
        type: "manual",
        message: t("error-generic"),
      });
    }
  };

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

        <div className="relative z-10 flex flex-col items-center lg:items-start -mt-12 lg:mt-0">
          <h1 className="text-[1.75rem] lg:text-4xl font-medium text-white text-center lg:text-start">
            {t("hero-title")}
          </h1>
        </div>

        <div className="relative z-10 w-full bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent backdrop-blur-md flex flex-col py-8 px-8 lg:px-12 max-w-xl mx-auto rounded-[2rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center w-full">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={200}
              height={80}
              className="w-full max-w-[200px]"
            />

            {isSubmitted ? (
              <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-10 text-center">
                <h2 className="text-xl font-semibold text-white">{t("success-title")}</h2>
                <p className="text-white/80 text-sm">{t("success-message")}</p>
                <Link
                  href={`/${locale}/login`}
                  className="mt-4 text-white font-bold hover:text-white/80"
                >
                  {t("back-to-login")}
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 w-full max-w-sm mt-10"
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-white mb-2">{t("title")}</h2>
                  <p className="text-white/80 text-sm">{t("subtitle")}</p>
                </div>

                <InputWithLabel
                  variant="large"
                  id="email"
                  type="email"
                  {...register("email", {
                    required: t("email-required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("email-invalid")
                    }
                  })}
                  label={t("email-field")}
                  error={formState.errors.email?.message}
                />

                <div className="flex flex-col">
                  <div className="mb-2 text-red-500 text-xs/4 min-h-4">
                    {formState.errors.root?.message}
                  </div>
                  <Star_Border
                    as="button"
                    type="submit"
                    disabled={!formState.isValid || formState.isSubmitting}
                    color="cyan"
                    speed="4s"
                    thickness={3}
                    className="w-full"
                    style={{
                      transform: formState.isSubmitting ? 'scale(0.95)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => !formState.isSubmitting && (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseLeave={(e) => !formState.isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseDown={(e) => !formState.isSubmitting && (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => !formState.isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {formState.isSubmitting ? t("submitting") : t("submit-btn")}
                  </Star_Border>
                </div>

                <p className="text-sm/5 text-center text-white">
                  <Link
                    href={`/${locale}/login`}
                    className="font-bold text-white hover:text-white/80"
                  >
                    {t("back-to-login")}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
