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

import Star_Border from "../ui/Star_Border";
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

const RegisterForm_Mobile = () => {
  const t = useTranslations("Register");
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed">("idle");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [userCountry, setUserCountry] = useState("Argentina");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);
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
    console.log("Mobile form submitted with data:", data);
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
    if (isVerifying) return t("verifying");
    if (verificationStatus === "success") return t("success");
    return t("verify");
  };

  const getVerifyButtonClass = () => {
    if (isVerifying) return "text-sm text-teal-accent cursor-not-allowed";
    if (verificationStatus === "success") return "text-sm text-teal-accent font-medium";
    return "text-sm text-teal-accent hover:text-teal-light";
  };


  const renderStepIndicator = () => (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-4">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              step === currentStep
                ? "bg-teal-accent"
                : step < currentStep
                ? "bg-teal-accent/60"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const nextStep = () => {
    if (currentStep < 3 && !isTransitioning) {
      if (!canProceedToNext()) {
        setShowStepErrors(true);
        setTimeout(() => setShowStepErrors(false), 3000);
        return;
      }
      
      setShowStepErrors(false);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !isTransitioning) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const canProceedToNext = () => {
    const fullName = watch("fullName");
    const email = watch("email");
    const password = watch("password");
    const terms = watch("terms");

    switch (currentStep) {
      case 1:
        const isValid = fullName && fullName.trim().length > 0 && 
                       email && email.trim().length > 0 && 
                       password && password.trim().length >= 8;
        return isValid;
      case 2:
        return true;
      case 3:
        return terms === true;
      default:
        return false;
    }
  };

  const getMissingFieldsMessage = () => {
    const fullName = watch("fullName");
    const email = watch("email");
    const password = watch("password");
    const terms = watch("terms");

    switch (currentStep) {
      case 1:
        const missing = [];
        if (!fullName || !fullName.trim()) missing.push(t("firstname-field"));
        if (!email || !email.trim()) missing.push(t("email-field"));
        if (!password || password.length < 8) missing.push(`${t("password-field")} (min 8 characters)`);
        return missing.length > 0 ? `${t("please-complete")} ${missing.join(", ")}` : "";
      case 3:
        return !terms ? t("must-accept-tc") : "";
      default:
        return "";
    }
  };

  const renderStep1 = () => (
    <div className="flex flex-col gap-6 w-full max-w-[320px] h-full">
      <InputWithLabel
        variant="large"
        id="fullName"
        label={t("firstname-field")}
        placeholder={t("firstname-placeholder")}
        error={errors.fullName?.message}
        {...register("fullName", { required: t("required-field") })}
      />

      <InputWithLabel
        variant="large"
        id="email"
        label={t("email-field")}
        placeholder={t("email-placeholder")}
        error={errors.email?.message}
        {...register("email", {
          required: t("required-field"),
          pattern: { value: /.+@.+\.[a-zA-Z]+/, message: t("email-invalid") },
        })}
      />

      <InputWithLabel
        variant="large"
        type="password"
        id="password"
        label={
          <div className="flex items-center justify-between">
            <span>{t("password-field")}</span>
            {watch("password") && (
              <span className={`text-xs ${
                watch("password").length >= 8 
                  ? "text-green-400" 
                  : "text-orange-400"
              }`}>
                {watch("password").length}/8
                {watch("password").length < 8 && (
                  <span className="ml-1">({8 - watch("password").length})</span>
                )}
              </span>
            )}
          </div>
        }
        placeholder="Choose your password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
      />

      <div className="flex items-end">
        <div className="w-full min-h-[48px] flex items-center justify-center">
          <Star_Border
            as="button"
            type="button"
            onClick={nextStep}
            disabled={!canProceedToNext() || isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-auto min-w-[120px] py-1.5 px-4 text-xs font-medium"
            style={{ transform: 'scale(1)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t("next")}
          </Star_Border>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col gap-6 w-full max-w-[320px] h-full">
      <InputWithLabel
        variant="large"
        id="country"
        label={t("country-field")}
        {...register("country")}
        value={userCountry}
        disabled
      />

      <InputWithLabel
        variant="large"
        id="companyName"
        label={t("company-field")}
        placeholder={t("optional")}
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <div className="flex items-end">
        <div className="flex flex-row gap-4 w-full min-h-[48px] justify-center items-center">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-auto min-w-[120px] py-1.5 px-4 text-xs font-medium opacity-70"
            style={{ transform: 'scale(1)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t("previous")}
          </Star_Border>
          <Star_Border
            as="button"
            type="button"
            onClick={nextStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-auto min-w-[120px] py-1.5 px-4 text-xs font-medium"
            style={{ transform: 'scale(1)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t("next")}
          </Star_Border>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col gap-6 w-full max-w-[320px] h-full">
      <InputWithLabel
        variant="large"
        id="affiliateCode"
        label={
          <div className="flex items-center gap-2">
            <span>{t("affiliate-code")}</span>
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
        placeholder={t("optional")}
        error={errors.affiliateCode?.message}
        {...register("affiliateCode")}
      />

      <div className={`text-white text-sm rounded-lg p-3 flex flex-col justify-center items-center transition-all duration-300 ease-in-out min-h-[48px] ${
        verificationStatus === "success"
          ? "bg-teal-accent/20 border border-teal-accent/30 opacity-100 scale-100"
          : verificationStatus === "failed"
          ? "bg-red-500/20 border border-red-500/30 opacity-100 scale-100"
          : "opacity-0 scale-95"
      }`}>
        {verificationStatus === "success" ? (
          <>
            <div className="font-semibold text-center">{verificationMessage || t("om-guaranteed")}</div>
            <div className="text-xs opacity-90">{t("with-sign-up")}</div>
          </>
        ) : verificationStatus === "failed" ? (
          <div className="font-semibold text-white text-center">{verificationMessage || t("invalid-code")}</div>
        ) : null}
      </div>

      <div className="flex items-end">
        <div className="flex flex-row gap-4 w-full min-h-[48px] justify-center items-center">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-auto min-w-[120px] py-1.5 px-4 text-xs font-medium opacity-70"
            style={{ transform: 'scale(1)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t("previous")}
          </Star_Border>
          <Star_Border
            as="button"
            type="submit"
            disabled={!watch("terms") || isSubmitting}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-auto min-w-[120px] py-1.5 px-4 text-xs font-medium"
            style={{ 
              transform: isSubmitting ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-1">
                <Loading_Spinner size="sm" color="white" />
                <span>{t("creating-account")}</span>
              </div>
            ) : (
              t("create-account")
            )}
          </Star_Border>
        </div>
      </div>

      <div className="mt-4">
        <CheckboxWithLabel
          id="terms"
          label={t("terms-and-conditions")}
          className="text-white/60 text-xs"
          {...register("terms", { required: t("must-accept-tc") })}
        />
        <div className="text-red-500 text-xs/3 min-h-3 mt-1">
          {errors.terms?.message}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center relative">
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-2 mb-2">
        <div className="h-[400px] flex flex-col">
          {showStepErrors && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-3 animate-pulse">
              {getMissingFieldsMessage()}
            </div>
          )}
          <div className="flex-1 flex items-start justify-center overflow-hidden">
            <div 
              className={`w-full transition-all duration-400 ease-out ${
                isTransitioning 
                  ? "opacity-0 scale-95 translate-y-2" 
                  : "opacity-100 scale-100 translate-y-0"
              }`}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          </div>

          <div className="h-4 flex items-center justify-center">
            {renderStepIndicator()}
          </div>
        </div>

        <div className="w-full text-red-500 text-xs/4 min-h-4 text-center mt-4">
          {errors.root?.message}
        </div>
      </form>

      <div className="mt-2 text-center">
        <Link
          href="/login?panel=login"
          className="text-sm hover:underline flex flex-row items-center gap-1 text-white/80 hover:text-white transition-colors duration-200"
        >
          <PiArrowLeftBold />
          {t("register-back")}
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm_Mobile;
