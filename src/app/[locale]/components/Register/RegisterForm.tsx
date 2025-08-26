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
  const [userCountry, setUserCountry] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    switch (currentStep) {
      case 1:
        return watch("fullName") && watch("email") && watch("password");
      case 2:
        return true;
      case 3:
        return watch("terms");
      default:
        return false;
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
        label="Password"
        placeholder="Choose your password"
        error={error("password")}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
      />

      <div className="flex-1 flex items-end">
        <Star_Border
          as="button"
          type="button"
          onClick={nextStep}
          disabled={!canProceedToNext() || isTransitioning}
          color="cyan"
          speed="4s"
          thickness={3}
          className="w-full py-3 px-4 text-base font-semibold"
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
        placeholder="Enter your company name (optional)"
        error={error("companyName")}
        {...register("companyName")}
      />

      <div className="flex-1 flex items-end">
        <div className="flex gap-3 w-full">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="flex-1 py-3 px-4 text-base font-semibold"
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
            className="flex-1 py-3 px-4 text-base font-semibold"
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
        placeholder="Enter affiliate code (optional)"
        error={error("affiliateCode")}
        {...register("affiliateCode")}
      />
      
      {verificationStatus === "success" && (
        <div className="p-3 bg-teal-accent/20 border border-teal-accent/30 text-white text-sm rounded-lg">
          <div>+5 OM guaranteed</div>
          <div>with this sign up</div>
        </div>
      )}

      <CheckboxWithLabel
        id="terms"
        label={t("terms-and-conditions")}
        {...register("terms", { required: "You must accept the terms and conditions" })}
      />
      <div className="text-red-500 text-xs/3 min-h-3">
        {error("terms")}
      </div>

      <div className="flex-1 flex items-end">
        <div className="flex gap-3 w-full">
          <Star_Border
            as="button"
            type="button"
            onClick={prevStep}
            disabled={isTransitioning}
            color="cyan"
            speed="4s"
            thickness={3}
            className="flex-1 py-3 px-4 text-base font-semibold"
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
            className="flex-1 py-3 px-4 text-base font-semibold"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Star_Border>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center relative">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-2 mb-2">
        <div className="h-[500px] flex flex-col">
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

          <div className="h-16 flex items-center justify-center">
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
