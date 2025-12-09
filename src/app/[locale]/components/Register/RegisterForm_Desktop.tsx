"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { PiArrowLeftBold } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

import { InputWithLabel } from "../ui/InputWithLabel";
import { CheckboxWithLabel } from "../ui/CheckboxWithLabel";
import Loading_Spinner from "../ui/Loading_Spinner";
import { post } from "../../../../utils/request";


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
  const [verificationMessage, setVerificationMessage] = useState<string>("");
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
      setVerificationMessage("");
    }
  }, [watch("affiliateCode"), verificationStatus, lastVerifiedCode]);

  const onSubmit = async (data: FormData) => {
    console.log("Desktop form submitted with data:", data);
    console.log("Email:", data.email);

    try {
      // post() returns parsed JSON on success, throws Response on error
      const response = await post("/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        country: data.country,
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.affiliateCode && { affiliateCode: data.affiliateCode }),
      });

      // If we reach here, the request was successful (post() throws on error)
      // response is already parsed JSON
      if (!response.success) {
        if (response.message === "Email already exists") {
          setError("email", { message: t("email-exists") });
        } else {
          setError("root", { message: t("server-error") });
        }
        return;
      }

      try {
        const affiliateCodeType = response.affiliateCodeType || 'code_standard';

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
            affiliateCodeType: affiliateCodeType,
          }),
        });
      } catch (sheetsError) {
        console.error('Error adding user to Google Sheets:', sheetsError);
      }

      window.location.href = "/post-register";
    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle thrown Response from post() on HTTP errors
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          if (errorData.message === "Email already exists") {
            setError("email", { message: t("email-exists") });
            return;
          }
        } catch {
          // JSON parsing failed, fall through to generic error
        }
      }
      setError("root", { message: t("server-error") });
    }
  };

  const handleVerifyAffiliate = async () => {
    const affiliateCode = watch("affiliateCode");
    if (!affiliateCode) return;

    setIsVerifying(true);
    setVerificationMessage("");
    try {
      // post() returns parsed JSON on success, throws Response on error
      const response = await post("/verify-affiliate-code", {
        code: affiliateCode,
      });

      if (response.success) {
        setVerificationStatus("success");
        // Mostrar los bonusOMs si están disponibles
        const bonusOMs = response.data?.bonusOMs;
        setVerificationMessage(bonusOMs ? `+${bonusOMs} OM` : "");
        setLastVerifiedCode(affiliateCode);
        localStorage.setItem('affiliateCode', affiliateCode);
        localStorage.setItem('affiliateVerified', 'true');
      } else {
        setVerificationStatus("failed");
        setVerificationMessage(response.message || "Invalid code");
        setLastVerifiedCode(affiliateCode);
      }
    } catch (error: any) {
      console.error("Error verifying affiliate code:", error);
      setVerificationStatus("failed");
      setVerificationMessage("Error verifying code");
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

            <div className={`text-white text-sm rounded-lg p-3 flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${
              verificationStatus === "success"
                ? "bg-teal-accent/20 border border-teal-accent/30 opacity-100 scale-100"
                : verificationStatus === "failed"
                ? "bg-red-500/20 border border-red-500/30 opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}>
              {verificationStatus === "success" ? (
                <>
                  <div className="font-semibold">{verificationMessage || t("om-guaranteed")}</div>
                  <div className="text-xs opacity-90">{t("with-sign-up")}</div>
                </>
              ) : verificationStatus === "failed" ? (
                <div className="font-semibold text-white">{verificationMessage || t("invalid-code")}</div>
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
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loading_Spinner size="sm" color="white" />
                <span>{t("creating-account")}</span>
              </div>
            ) : (
              t("create-account")
            )}
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
