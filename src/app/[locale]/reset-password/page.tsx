"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Light_Rays from "../components/ui/Light_Rays";
import { InputWithLabel } from "../components/ui/InputWithLabel";
import Star_Border from "../components/ui/Star_Border";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const t = useTranslations("ResetPassword");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = pathname.split("/")[1];

  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  const { register, handleSubmit, formState, setError, watch } = useForm<ResetPasswordForm>({
    mode: "onChange"
  });

  const password = watch("password");

  useEffect(() => {
    if (!token) {
      setIsInvalidToken(true);
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "TOKEN_EXPIRED") {
          setError("root", {
            type: "manual",
            message: t("error-expired"),
          });
        } else if (result.error === "TOKEN_INVALID") {
          setError("root", {
            type: "manual",
            message: t("error-invalid"),
          });
        } else {
          setError("root", {
            type: "manual",
            message: t("error-generic"),
          });
        }
        return;
      }

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("root", {
        type: "manual",
        message: t("error-generic"),
      });
    }
  };

  const renderContent = () => {
    if (isInvalidToken) {
      return (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-10 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">{t("error-invalid-title")}</h2>
          <p className="text-white/80 text-sm">{t("error-invalid-message")}</p>
          <Link
            href={`/${locale}/forgot-password`}
            className="mt-4 text-white font-bold hover:text-white/80"
          >
            {t("request-new-link")}
          </Link>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-10 text-center">
          <h2 className="text-xl font-semibold text-white">{t("success-title")}</h2>
          <p className="text-white/80 text-sm">{t("success-message")}</p>
          <p className="text-white/60 text-xs">{t("redirecting")}</p>
        </div>
      );
    }

    return (
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
          id="password"
          type="password"
          {...register("password", {
            required: t("password-required"),
            minLength: {
              value: 8,
              message: t("password-min-length")
            }
          })}
          label={t("password-field")}
          error={formState.errors.password?.message}
        />

        <InputWithLabel
          variant="large"
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: t("confirm-required"),
            validate: (value) => value === password || t("passwords-no-match")
          })}
          label={t("confirm-field")}
          error={formState.errors.confirmPassword?.message}
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
    );
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
            {renderContent()}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ResetPassword;
