"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";

import { InputWithLabel } from "../ui/InputWithLabel";
import Star_Border from "../ui/Star_Border";
import { useAuth } from "../../context/Auth_Context";
import Two_Factor_Auth_Modal from "../Auth/Two_Factor_Auth_Modal";
import { useState } from "react";
import { post } from "../../../../utils/request";

const LoginForm = () => {
  const t = useTranslations("Login");
  const { register, handleSubmit, formState, setError, watch } = useForm();
  const router = useRouter();
  const pathname = usePathname();
  const { login, checkAuth } = useAuth();
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const locale = pathname.split("/")[1];

  const onSubmit = async (data: Record<string, string>) => {
    console.log("Form data received:", data);
    console.log("Email:", data.email);
    console.log("Password:", data.password);
    
    try {
      console.log("Calling login function...");
      const loginResponse = await login(data.email, data.password);
      
      console.log("Login response:", loginResponse);
      
      if (loginResponse?.requires2FA || loginResponse?.twoFactorRequired) {
        console.log("2FA required, showing modal...");
        setUserEmail(data.email);
        setShowTwoFactorModal(true);
      } else {
        console.log("Login successful, redirecting to dashboard...");
        console.log("Redirect URL:", `/${locale}/dashboard`);
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      console.error("Login error in form:", err);
      console.error("Error JSON:", JSON.stringify(err));
      if ((err as Response).status === 401) {
        setError("root", {
          type: "400",
          message: t("login-failed"),
        });
      } else {
        setError("root", {
          type: "500",
          message: t("server-error"),
        });
      }
    }
  };

  const handleTwoFactorSuccess = async (code: string): Promise<void> => {
    console.log("📤 2FA code to verify:", code);
    try {
      const response = await post("/2fa/verify", {
        email: userEmail,
        code: code,
      });

      const responseData = await response.json();
      console.log("📥 2FA verification response:", responseData);

      if (response.ok && responseData.success) {
        console.log("✅ 2FA verified successfully:", responseData);
        console.log("✅ Session established, updating auth state...");
        
        setShowTwoFactorModal(false);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
          console.log("🔄 Verificando sesión después de 2FA...");
          console.log("🍪 Cookies antes de checkAuth:", document.cookie);
          await checkAuth();
          console.log("✅ Sesión verificada, redirigiendo al dashboard...");
          
          setTimeout(() => {
            router.push(`/${locale}/dashboard`);
          }, 300);
        } catch (error) {
          console.error("❌ Error verificando sesión después de 2FA:", error);
          setTimeout(() => {
            router.push(`/${locale}/dashboard`);
          }, 300);
        }
      } else {
        const errorMessage = responseData.error || "Invalid 2FA code";
        console.error("❌ 2FA verification failed:", errorMessage);
        setError("root", {
          type: response.status === 401 ? "401" : "400",
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const response = error as Response;
      const responseData = await response.json().catch(() => ({ error: "Failed to verify 2FA code" }));
      const errorMessage = responseData.error || "Invalid 2FA code";
      console.error("❌ 2FA verification failed:", errorMessage);
      setError("root", {
        type: response.status === 401 ? "401" : "400",
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const handleTwoFactorClose = () => {
    setShowTwoFactorModal(false);
  };

  return (
    <>
      <Two_Factor_Auth_Modal
        show={showTwoFactorModal}
        onClose={handleTwoFactorClose}
        onSuccess={handleTwoFactorSuccess}
        userEmail={userEmail}
        onError={(error) => {
          setError("root", {
            type: "400",
            message: error,
          });
          setShowTwoFactorModal(false);
        }}
        onSuccessState={(isVerifying, isSuccess) => {
          console.log("2FA modal state:", { isVerifying, isSuccess });
        }}
      />
      <div className="flex flex-col items-center w-full">
        <Image 
        src="/assets/images/logo.png" 
        alt="logo" 
        width={200}
        height={80}
        className="w-full max-w-[200px]" 
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-sm mt-10"
      >
        <InputWithLabel
          variant="large"
          id="email"
          {...register("email", { required: true })}
          label={t("email-field")}
        />

        <div>
          <InputWithLabel
            variant="large"
            type="password"
            id="password"
            {...register("password", { required: true })}
            label={t("password-field")}
          />
        </div>

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
            {t("login-btn")}
          </Star_Border>
        </div>

        <p className="text-sm/5 text-center text-white">
          {t("login-no-account")}{" "}
          <Link
            href="/login?panel=register"
            className="font-bold hover:underline decoration-2 text-white"
          >
            {t("login-cta")}
          </Link>
        </p>
      </form>
    </div>
    </>
  );
};

export default LoginForm;
