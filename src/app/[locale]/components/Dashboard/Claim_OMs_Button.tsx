"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../context/Auth_Context";
import { PiGift, PiX } from "react-icons/pi";

const Claim_OMs_Button = () => {
  const t = useTranslations("ClaimOMs");
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCode("");
    setError("");
    setSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCode("");
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError(t("error-empty"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/claim-oms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "CODE_NOT_FOUND") {
          setError(t("error-not-found"));
        } else if (result.error === "CODE_ALREADY_USED") {
          setError(t("error-already-used"));
        } else if (result.error === "CODE_EXPIRED") {
          setError(t("error-expired"));
        } else {
          setError(t("error-generic"));
        }
        return;
      }

      // Update user OMs
      if (result.newOmBalance !== undefined && user) {
        setUser({
          ...user,
          omBalance: result.newOmBalance,
        });
      }

      setClaimedAmount(result.amount || 0);
      setSuccess(true);

      // Close modal after 3 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 3000);

    } catch (err) {
      console.error("Claim OMs error:", err);
      setError(t("error-generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-3 px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-all"
      >
        <span className="text-sm text-white font-medium">
          {t("button")}
        </span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-teal-dark via-teal-medium to-teal-accent rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/20">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <PiX className="text-xl" />
            </button>

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <PiGift className="text-3xl text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t("success-title")}</h2>
                <p className="text-white/80 text-center">
                  {t("success-message", { amount: claimedAmount })}
                </p>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <PiGift className="text-xl text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
                    <p className="text-sm text-white/60">{t("subtitle")}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {t("code-label")}
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder={t("code-placeholder")}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all uppercase tracking-wider"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !code.trim()}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("submitting")}
                      </>
                    ) : (
                      t("submit")
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Claim_OMs_Button;
