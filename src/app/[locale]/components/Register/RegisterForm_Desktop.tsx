"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { PiArrowLeftBold } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

import { InputWithLabel } from "../ui/InputWithLabel";
import { CheckboxWithLabel } from "../ui/CheckboxWithLabel";


interface FormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  companyName?: string;
  affiliateCode?: string;
  terms: boolean;
}

const RegisterForm_Desktop = () => {
  const t = useTranslations("Register");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed">("idle");
  const [userCountry, setUserCountry] = useState("Argentina");
  const [lastVerifiedCode, setLastVerifiedCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    setValue,
  } = useForm<FormData>();

  useEffect(() => {
    const detectCountry = async () => {
      // Siempre usar Argentina como país por defecto
      setUserCountry("Argentina");
      setValue("country", "Argentina");
    };
    detectCountry();
  }, [setValue]);

  useEffect(() => {
    const affiliateCode = watch("affiliateCode");
    if (!affiliateCode) {
      setVerificationStatus("idle");
    }
  }, [watch("affiliateCode")]);

  useEffect(() => {
    const affiliateCode = watch("affiliateCode");
    if (affiliateCode !== lastVerifiedCode && (verificationStatus === "success" || verificationStatus === "failed")) {
      setVerificationStatus("idle");
    }
  }, [watch("affiliateCode"), verificationStatus, lastVerifiedCode]);

  const onSubmit = async (data: FormData) => {
    console.log("Desktop form submitted with data:", data);
    console.log("Email:", data.email);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-main.onrender.com"}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          country: data.country,
          ...(data.companyName && { companyName: data.companyName }),
          ...(data.affiliateCode && { affiliateCode: data.affiliateCode }),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Email already exists") {
          setError("email", { message: t("email-exists") });
        } else {
          setError("root", { message: t("server-error") });
        }
        return;
      }

      try {
        await fetch('/api/google-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            country: data.country,
            companyName: data.companyName,
            affiliateCode: data.affiliateCode,
          }),
        });
      } catch (sheetsError) {
        console.error('Error adding user to Google Sheets:', sheetsError);
      }

      window.location.href = "/post-register";
    } catch (error) {
      console.error("Registration error:", error);
      setError("root", { message: t("server-error") });
    }
  };

  const handleVerifyAffiliate = async () => {
    const affiliateCode = watch("affiliateCode");
    if (!affiliateCode) return;

    setIsVerifying(true);
    try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-main.onrender.com"}/verify-affiliate-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: affiliateCode,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setVerificationStatus("success");
        setLastVerifiedCode(affiliateCode);
        // Save the verified affiliate code to localStorage
        localStorage.setItem('affiliateCode', affiliateCode);
        localStorage.setItem('affiliateVerified', 'true');
      } else {
        setVerificationStatus("failed");
        setLastVerifiedCode(affiliateCode);
      }
    } catch (error) {
      console.error("Error verifying affiliate code:", error);
      setVerificationStatus("failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerifyButtonText = () => {
    if (isVerifying) return "verifying...";
    if (verificationStatus === "success") return "Success";
    return "verify";
  };

  const getVerifyButtonClass = () => {
    if (isVerifying) return "text-sm text-teal-accent cursor-not-allowed";
    if (verificationStatus === "success") return "text-sm text-teal-accent font-medium";
    return "text-sm text-teal-accent hover:text-teal-light";
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="flex flex-col items-center mb-6">
        <Image 
          src="/assets/images/logo.png" 
          alt="logo" 
          width={200}
          height={80}
          className="w-full max-w-[200px]" 
        />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              variant="large"
              id="fullName"
              label="Full name"
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              {...register("fullName", { required: "Full name is required" })}
            />

            <InputWithLabel
              variant="large"
              id="email"
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /.+@.+\.[a-zA-Z]+/, message: "Invalid email format" },
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              variant="large"
              type="password"
              id="password"
              label="Password"
              placeholder="Choose your password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
            />

            <InputWithLabel
              variant="large"
              id="country"
              label="Country"
              {...register("country")}
              value={userCountry}
              disabled
              className="opacity-70"
            />
          </div>

          <InputWithLabel
            variant="large"
            id="companyName"
            label="Company"
            placeholder="Enter your company name (optional)"
            error={errors.companyName?.message}
            {...register("companyName")}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              variant="large"
              id="affiliateCode"
              label={
                <div className="flex items-center gap-2">
                  <span>Affiliate code</span>
                  {watch("affiliateCode") && (
                    <button
                      type="button"
                      onClick={handleVerifyAffiliate}
                      disabled={isVerifying}
                      className={`${getVerifyButtonClass()} transition-all duration-300 ease-in-out`}
                    >
                      {getVerifyButtonText()}
                    </button>
                  )}
                </div>
              }
              placeholder="optional"
              error={errors.affiliateCode?.message}
              {...register("affiliateCode")}
            />

            <div className={`text-white text-sm rounded-lg p-3 flex flex-col justify-center transition-all duration-300 ease-in-out ${
              verificationStatus === "success" 
                ? "bg-teal-accent/20 border border-teal-accent/30 opacity-100 scale-100" 
                : verificationStatus === "failed"
                ? "bg-red-500/20 border border-red-500/30 opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}>
              {verificationStatus === "success" ? (
                <>
                  <div className="font-semibold">+5 OM guaranteed</div>
                  <div className="text-xs opacity-90">with this sign up</div>
                </>
                              ) : verificationStatus === "failed" ? (
                  <div className="font-semibold text-white text-center">Invalid code</div>
                ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <CheckboxWithLabel
              id="terms"
              label={t("terms-and-conditions")}
              className="text-white/60 text-xs"
              {...register("terms", { required: "You must accept the terms and conditions" })}
            />
          </div>
          <div className="text-red-500 text-xs/3 min-h-3">
            {errors.terms?.message}
          </div>

          <button
            type="submit"
            disabled={!watch("terms") || isSubmitting}
            className={`w-full py-3 px-6 text-base font-medium mt-4 bg-teal-accent text-white rounded-lg hover:bg-teal-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
              isSubmitting ? 'scale-105' : 'scale-100'
            }`}
          >
            {t("create-account")}
          </button>
        </div>

        <div className="w-full text-red-500 text-xs/4 min-h-4 text-center mt-4">
          {errors.root?.message}
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login?panel=login"
          className="text-sm hover:underline flex flex-row items-center gap-1 text-white/80 hover:text-white transition-colors duration-200"
        >
          <PiArrowLeftBold />
          Return to login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm_Desktop;
