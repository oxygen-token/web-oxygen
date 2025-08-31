"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { PiArrowLeftBold } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

import { InputWithLabel } from "../ui/InputWithLabel";
import { CheckboxWithLabel } from "../ui/CheckboxWithLabel";
import Star_Border from "../ui/Star_Border";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  companyName?: string;
  affiliateCode?: string;
  terms: boolean;
}

const RegisterForm = () => {
  const t = useTranslations("Register");
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed">("idle");
  const [showToast, setShowToast] = useState(false);
  const [desktopMessageShown, setDesktopMessageShown] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formStateErrors, isSubmitting },
    setError,
    watch,
    setValue,
  } = useForm<FormData>();

  const formState = { errors: formStateErrors, isSubmitting };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_name || "Unknown");
        setValue("country", data.country_name || "Unknown");
      } catch (error) {
        setUserCountry("Unknown");
        setValue("country", "Unknown");
      }
    };
    detectCountry();
  }, [setValue]);

  useEffect(() => {
    if (verificationStatus === "success") {
      setShowToast(true);
      setDesktopMessageShown(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setTimeout(() => {
          setVerificationStatus("idle");
        }, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus]);

  const error = (field: keyof FormData) => {
    return formState.errors[field]?.message as string;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

      window.location.href = "/post-register";
    } catch (error) {
      setError("root", { message: t("server-error") });
    }
  };

  const handleVerifyAffiliate = async () => {
    const affiliateCode = watch("affiliateCode");
    if (!affiliateCode) return;

    setIsVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (affiliateCode === "1234") {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("failed");
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
    if (verificationStatus === "failed") return "Invalid code";
    return "verify";
  };

  const getVerifyButtonClass = () => {
    if (isVerifying) return "text-sm text-teal-accent cursor-not-allowed";
    if (verificationStatus === "success") return "text-sm text-teal-accent font-medium";
    if (verificationStatus === "failed") return "text-sm text-red-400 font-medium";
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
        console.log("Step 1 validation:", { fullName, email, password, isValid });
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
        if (!fullName || !fullName.trim()) missing.push("Full name");
        if (!email || !email.trim()) missing.push("Email");
        if (!password || password.length < 8) missing.push("Password (min 8 characters)");
        return missing.length > 0 ? `Please complete: ${missing.join(", ")}` : "";
      case 3:
        return !terms ? "Please accept the terms and conditions" : "";
      default:
        return "";
    }
  };



  const renderStep1 = () => (
    <div className="flex flex-col gap-6 w-full max-w-sm h-full">
      <InputWithLabel
        variant="large"
        id="fullName"
        label="Full name"
        placeholder="Enter your full name"
        error={error("fullName")}
        {...register("fullName", { required: "Full name is required" })}
      />

      <InputWithLabel
        variant="large"
        id="email"
        label="Email"
        placeholder="Enter your email"
        error={error("email")}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /.+@.+\.[a-zA-Z]+/, message: "Invalid email format" },
        })}
      />

      <InputWithLabel
        variant="large"
        type="password"
        id="password"
        label={
          <div className="flex items-center justify-between">
            <span>Password</span>
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
        error={error("password")}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
      />

      <div className="flex items-end">
        <Star_Border
          as="button"
          type="button"
          onClick={nextStep}
          disabled={!canProceedToNext() || isTransitioning}
          color="cyan"
          speed="4s"
          thickness={3}
          className="w-full py-1.5 px-2 text-xs font-medium"
        >
          Next
        </Star_Border>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col gap-6 w-full max-w-sm h-full">
      <InputWithLabel
        variant="large"
        id="country"
        label="Country"
        value={userCountry}
        disabled
        className="opacity-70"
      />

      <InputWithLabel
        variant="large"
        id="companyName"
        label="Company"
        placeholder="optional"
        error={error("companyName")}
        {...register("companyName")}
      />

      <div className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-full py-1.5 px-2 text-xs font-medium opacity-70"
          >
            Previous
          </Star_Border>
          <Star_Border
            as="button"
            type="button"
            onClick={nextStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-full py-1.5 px-2 text-xs font-medium"
          >
            Next
          </Star_Border>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col gap-6 w-full max-w-sm h-full">
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
        error={error("affiliateCode")}
        {...register("affiliateCode")}
      />
      


      <div className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-full py-1.5 px-2 text-xs font-medium opacity-70"
          >
            Previous
          </Star_Border>
          <Star_Border
            as="button"
            type="submit"
            disabled={!watch("terms") || isSubmitting}
            color="cyan"
            speed="4s"
            thickness={3}
            className="w-full py-1.5 px-2 text-xs font-medium"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Star_Border>
        </div>
      </div>

      <div className="mt-4">
        <CheckboxWithLabel
          id="terms"
          label={t("terms-and-conditions")}
          className="text-white/60 text-xs"
          {...register("terms", { required: "You must accept the terms and conditions" })}
        />
        <div className="text-red-500 text-xs/3 min-h-3 mt-1">
          {error("terms")}
        </div>
      </div>
    </div>
  );

  const renderDesktopForm = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <InputWithLabel
          variant="large"
          id="fullName"
          label="Full name"
          placeholder="Enter your full name"
          error={error("fullName")}
          {...register("fullName", { required: "Full name is required" })}
        />

        <InputWithLabel
          variant="large"
          id="email"
          label="Email"
          placeholder="Enter your email"
          error={error("email")}
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
          error={error("password")}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />

        <InputWithLabel
          variant="large"
          id="country"
          label="Country"
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
        error={error("companyName")}
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
          error={error("affiliateCode")}
          {...register("affiliateCode")}
        />

        <div className={`bg-teal-accent/20 border border-teal-accent/30 text-white text-sm rounded-lg p-3 flex flex-col justify-center transition-all duration-300 ease-in-out ${
          desktopMessageShown 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        }`}>
          <div className="font-semibold">+5 OM guaranteed</div>
          <div className="text-xs opacity-90">with this sign up</div>
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
        {error("terms")}
      </div>

      <Star_Border
        as="button"
        type="submit"
        disabled={!watch("terms") || isSubmitting}
        color="cyan"
        speed="4s"
        thickness={3}
        className="w-full py-3 px-6 text-base font-medium mt-4"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Star_Border>
    </div>
  );

  return (
    <div className="flex flex-col items-center relative">
      {showToast && (
        <div className={`fixed -bottom-20 left-1/2 transform -translate-x-1/4 z-50 lg:hidden ${showToast ? 'animate-toast-in' : 'animate-toast-out'}`}>
          <div className="bg-teal-accent/95 backdrop-blur-sm border border-teal-accent/30 text-white text-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold">+5 OM guaranteed</div>
                <div className="text-xs opacity-90">with this sign up</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-2 mb-2">
        <div className="hidden lg:block">
          {renderDesktopForm()}
        </div>
        
        <div className="lg:hidden h-[400px] flex flex-col">
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
          {formState.errors.root?.message}
        </div>
      </form>

      <div className="mt-2 text-center">
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

export default RegisterForm;
