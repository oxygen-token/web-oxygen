"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "../../context/Wallet_Context";
import { createSIWEMessage, signMessage, formatSIWEMessage } from "../../utils/siwe";
import { get, post } from "../../../../utils/request";

interface SIWE_Link_Modal_Props {
  show: boolean;
  onClose: () => void;
  onSuccess: (walletAddress: string) => void;
}

type SIWEState = "idle" | "requesting-nonce" | "signing" | "verifying" | "success" | "error";

export default function SIWE_Link_Modal({ show, onClose, onSuccess }: SIWE_Link_Modal_Props) {
  const { wallet } = useWallet();
  const [state, setState] = useState<SIWEState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show) {
      if (!successRef.current) {
        setState("idle");
        setError(null);
      }
      successRef.current = false;
      return;
    }
    
    if (show && wallet.isConnected && wallet.account && state === "idle" && !error) {
      return;
    }
    
    if (show && wallet.isConnected && wallet.account && state !== "success" && state !== "error" && state !== "requesting-nonce" && state !== "signing" && state !== "verifying") {
      setState("idle");
      setError(null);
    }
  }, [show, wallet.isConnected, wallet.account]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleSignIn = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError("Wallet not connected");
      setState("error");
      return;
    }

    try {
      setState("requesting-nonce");
      setError(null);

      const nonceResponse = await get("/wallet/nonce");
      
      const nonceData = await nonceResponse.json();

      if (!nonceData.nonce) {
        console.error("❌ No nonce in response:", nonceData);
        throw new Error("Failed to generate nonce");
      }

      const { nonce } = nonceData;

      setState("signing");

      const siweMessage = await createSIWEMessage(wallet.account.address, nonce);
      const messageToSign = formatSIWEMessage(siweMessage);

      const signature = await signMessage(messageToSign, wallet.account.address);

      setState("verifying");

      // Enviar el mensaje SIWE como objeto para que el backend pueda crear una instancia de SiweMessage
      const messageObject = {
        domain: siweMessage.domain,
        address: siweMessage.address,
        statement: siweMessage.statement,
        uri: siweMessage.uri,
        version: siweMessage.version,
        chainId: siweMessage.chainId,
        nonce: siweMessage.nonce,
        issuedAt: siweMessage.issuedAt,
      };
      
      const verifyResponse = await post("/wallet/link", {
        message: messageObject,
        signature,
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.error("❌ Backend error:", errorData);
        throw new Error(errorData.error || `Failed to verify signature: ${verifyResponse.status}`);
      }

      const verifyData = await verifyResponse.json();

      const walletAddress = verifyData.walletAddress || verifyData.wallet_address || wallet.account?.address || "";
      
      setState("success");
      successRef.current = true;
      
      setTimeout(() => {
        onSuccess(walletAddress);
        onClose();
        successRef.current = false;
      }, 1500);
    } catch (err) {
      console.error("❌ Error in SIWE flow:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error("❌ Error message:", errorMessage);
      setError(errorMessage);
      setState("error");

      if (errorMessage.includes("User rejected")) {
        setTimeout(() => {
          setState("idle");
          setError(null);
        }, 2000);
      }
    }
  };

  if (!mounted || !show) {
    return null;
  }

  const isLoading = state === "requesting-nonce" || state === "signing" || state === "verifying";
  const buttonText =
    state === "requesting-nonce"
      ? "Connecting..."
      : state === "signing"
      ? "Signing..."
      : state === "verifying"
      ? "Verifying..."
      : "Sign in with Ethereum";

  const hasWalletAccount = wallet.account && wallet.account.address;

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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
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
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 8px rgba(255, 255, 255, 0.3)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {state === "success" ? (
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
            <div style={{ marginBottom: "1.5rem", fontSize: "3rem", color: "rgba(0, 202, 166, 1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "white" }}>
              Wallet Linked Successfully
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "2rem" }}>
              Your wallet has been successfully linked to your account.
            </p>
          </div>
        ) : state === "error" ? (
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
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "white" }}>
              Error Linking Wallet
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "1rem" }}>
              {error || "An error occurred while linking your wallet."}
            </p>
            <button
              onClick={() => {
                setState("idle");
                setError(null);
              }}
              style={{
                background: "linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%)",
                border: "2px solid rgba(0, 202, 166, 0.8)",
                borderRadius: "0.75rem",
                padding: "0.875rem 2rem",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                width: "100%",
                maxWidth: "16rem",
                marginTop: "1rem",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
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
              Link Your Wallet
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "1rem", lineHeight: 1.6 }}>
              To complete the wallet connection, please sign a message with your wallet to verify ownership.
            </p>
            {hasWalletAccount && wallet.account && (
              <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "2rem", fontSize: "0.875rem" }}>
                Wallet: {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
              </p>
            )}
            {!hasWalletAccount && (
              <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "2rem", fontSize: "0.875rem" }}>
                Waiting for wallet connection...
              </p>
            )}
            <button
              onClick={handleSignIn}
              disabled={isLoading || !hasWalletAccount}
              style={{
                background: "linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%)",
                border: "2px solid rgba(0, 202, 166, 0.8)",
                borderRadius: "0.75rem",
                padding: "0.875rem 2rem",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: isLoading || !hasWalletAccount ? "not-allowed" : "pointer",
                opacity: isLoading || !hasWalletAccount ? 0.6 : 1,
                boxShadow: "0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                width: "100%",
                maxWidth: "16rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                margin: "0 auto",
              }}
            >
              {isLoading && (
                <div
                  style={{
                    width: "1rem",
                    height: "1rem",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              )}
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
