"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { post } from "../../../../utils/request";

interface Two_Factor_Auth_Modal_Props {
  show: boolean;
  onClose: () => void;
  onSuccess: (code: string) => Promise<void>;
  userEmail?: string;
}

export default function Two_Factor_Auth_Modal({
  show,
  onClose,
  onSuccess,
  userEmail,
}: Two_Factor_Auth_Modal_Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      setCode(["", "", "", "", "", ""]);
      setIsVerifying(false);
      setIsSuccess(false);
      setError(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleCodeChange = async (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      const fullCode = newCode.join("");
      setIsVerifying(true);
      setIsSuccess(false);
      setError(null);
      
      try {
        await onSuccess(fullCode);
        setIsVerifying(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      } catch (err) {
        setIsVerifying(false);
        setIsSuccess(false);
        const errorMessage = err instanceof Error ? err.message : "Error verifying code";
        setError(errorMessage);
        
        setTimeout(() => {
          setError(null);
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 3000);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setCode(newCode.slice(0, 6));
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      if (pastedData.length === 6) {
        setIsVerifying(true);
        setIsSuccess(false);
        setError(null);
        
        try {
          await onSuccess(pastedData);
          setIsVerifying(false);
          setIsSuccess(true);
          
          setTimeout(() => {
            setIsSuccess(false);
          }, 2000);
        } catch (err) {
          setIsVerifying(false);
          setIsSuccess(false);
          const errorMessage = err instanceof Error ? err.message : "Error verifying code";
          setError(errorMessage);
          
          setTimeout(() => {
            setError(null);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
          }, 3000);
        }
      }
    }
  };

  if (!mounted || !show) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }
        @keyframes slideIn {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.3s ease-out",
        }}
      />

      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, rgba(0, 106, 106, 0.75) 0%, rgba(0, 202, 166, 0.65) 30%, rgba(1, 33, 56, 0.7) 70%, rgba(11, 136, 153, 0.8) 100%)",
          backdropFilter: "blur(30px)",
          border: "2px solid rgba(0, 202, 166, 0.8)",
          borderRadius: "1rem",
          padding: "2rem 2.5rem",
          maxWidth: "32rem",
          width: "100%",
          minHeight: "300px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 8px rgba(255, 255, 255, 0.3)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", color: "white", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "-0.5rem",
              right: "-0.5rem",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              fontSize: "1.5rem",
              lineHeight: 1,
            }}
          >
            ×
          </button>
          
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "white", marginTop: "0.5rem" }}>
            2FA Auth.
          </h2>
          
          <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Enter the 6-digit code sent to your email
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying || isSuccess}
                style={{
                  width: "3rem",
                  height: "3rem",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "white",
                  background: isSuccess ? "rgba(0, 202, 166, 0.3)" : "rgba(0, 0, 0, 0.6)",
                  border: isSuccess ? "2px solid rgba(0, 202, 166, 1)" : "2px solid rgb(0, 202, 166)",
                  borderRadius: "0.5rem",
                  outline: "none",
                  transition: "0.2s",
                  boxShadow: "rgb(5 30 30 / 90%) 0px 4px 12px",
                  transform: "scale(1)",
                  opacity: isVerifying || isSuccess ? 0.7 : 1,
                  cursor: isVerifying || isSuccess ? "not-allowed" : "text",
                }}
                onFocus={(e) => {
                  if (!isVerifying && !isSuccess) {
                    e.target.style.background = "rgba(0, 202, 166, 0.3)";
                    e.target.style.borderColor = "rgb(0, 202, 166)";
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "rgb(5 30 30 / 90%) 0px 6px 16px";
                  }
                }}
                onBlur={(e) => {
                  if (!isVerifying && !isSuccess) {
                    e.target.style.background = "rgba(0, 0, 0, 0.6)";
                    e.target.style.borderColor = "rgb(0, 202, 166)";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "rgb(5 30 30 / 90%) 0px 4px 12px";
                  }
                }}
              />
            ))}
          </div>

          {isVerifying && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  border: "3px solid rgba(0, 202, 166, 0.3)",
                  borderTopColor: "rgba(0, 202, 166, 1)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.875rem" }}>
                Verifying code...
              </p>
            </div>
          )}

          {isSuccess && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
                animation: "fadeInUp 0.4s ease-out",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  animation: "checkmark 0.6s ease-out",
                }}
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="rgba(0, 202, 166, 1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset="0"
                  style={{
                    animation: "checkmark 0.6s ease-out",
                  }}
                />
              </svg>
              <p
                style={{
                  color: "rgba(0, 202, 166, 1)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  animation: "fadeInUp 0.4s ease-out 0.2s both",
                  opacity: 0,
                }}
              >
                Verified
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              <p style={{ color: "rgba(239, 68, 68, 1)", fontSize: "0.875rem", fontWeight: 600 }}>
                {error}
              </p>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Didn't receive the code?
            </p>
            <button
              onClick={async () => {
                console.log("Resend code clicked");
                setIsResending(true);
                setResendSuccess(false);
                setError(null);
                
                try {
                  const response = await post("/2fa/generate", {
                    email: userEmail || "",
                  });
                  
                  const responseData = await response.json();
                  
                  if (response.ok && responseData.success) {
                    console.log("✅ 2FA code resent successfully:", responseData);
                    setResendSuccess(true);
                    setError(null);
                    setCode(["", "", "", "", "", ""]);
                    inputRefs.current[0]?.focus();
                    
                    setTimeout(() => {
                      setResendSuccess(false);
                    }, 3000);
                  } else {
                    const errorMessage = responseData.error || "Failed to resend code";
                    console.error("❌ Error resending 2FA code:", errorMessage);
                    setError(errorMessage);
                    setResendSuccess(false);
                  }
                } catch (error) {
                  let errorMessage = "Failed to resend code";
                  
                  if (error instanceof Response) {
                    try {
                      const errorData = await error.json();
                      errorMessage = errorData.error || "Failed to resend code";
                    } catch {
                      errorMessage = "Failed to resend code";
                    }
                  } else if (error instanceof Error) {
                    errorMessage = error.message || "Failed to resend code";
                  }
                  
                  console.error("❌ Error resending 2FA code:", errorMessage);
                  setError(errorMessage);
                  setResendSuccess(false);
                } finally {
                  setIsResending(false);
                }
              }}
              disabled={isResending || isVerifying || isSuccess}
              style={{
                background: resendSuccess ? "rgba(0, 202, 166, 0.1)" : "transparent",
                border: resendSuccess ? "1px solid rgba(0, 202, 166, 1)" : "1px solid rgba(0, 202, 166, 0.5)",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.5rem",
                color: "rgba(0, 202, 166, 1)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: (isResending || isVerifying || isSuccess) ? "not-allowed" : "pointer",
                opacity: (isResending || isVerifying || isSuccess) ? 0.6 : 1,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                if (!isResending && !isVerifying && !isSuccess) {
                  e.currentTarget.style.background = "rgba(0, 202, 166, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(0, 202, 166, 1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!resendSuccess) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(0, 202, 166, 0.5)";
                }
              }}
            >
              {isResending ? (
                <>
                  <div
                    style={{
                      width: "0.875rem",
                      height: "0.875rem",
                      border: "2px solid rgba(0, 202, 166, 0.3)",
                      borderTopColor: "rgba(0, 202, 166, 1)",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Sending...
                </>
              ) : resendSuccess ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="rgba(0, 202, 166, 1)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Code sent!
                </>
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

