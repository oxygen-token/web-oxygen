"use client";
import { useAuth } from "../../context/Auth_Context";
import { useWallet } from "../../context/Wallet_Context";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PiPencilSimple, PiWallet, PiEye, PiEyeSlash, PiSignOut, PiCopy, PiCheckCircle } from "react-icons/pi";
import { useState } from "react";
import { formatAddress } from "../../utils/wallet";

export default function Profile_Card() {
  const { user } = useAuth();
  const { wallet, disconnect } = useWallet();
  const t = useTranslations("Wallet");
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const stats = [
    { label: "000 hectáreas compradas", value: "000" },
    { label: "000 tokens quemados", value: "000" },
    { label: "00 certificados de carbono neutralidad", value: "00" }
  ];

  const joinDate = "12 de mayo del 2019";
  const profileImage = "/assets/images/Photo_perfil.png";

  const handleCopyAddress = () => {
    if (!wallet.account) return;
    navigator.clipboard.writeText(wallet.account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = async () => {
    if (isDisconnecting || wallet.isDisconnecting) return;
    
    setIsDisconnecting(true);
    try {
      await disconnect();
      setShowAddress(false);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 border border-blue-200/50 flex flex-col items-center justify-center max-w-md max-h-[90vh] w-full mx-auto overflow-y-auto">
      <div className="relative mb-4">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-800/30">
          <Image
            src={profileImage}
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-[#539390] rounded-full flex items-center justify-center border-[3px] border-white shadow-lg hover:bg-[#4a8380] transition-colors z-10 cursor-pointer">
          <PiPencilSimple className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </button>
      </div>

      <h2 className="text-[#539390] text-lg sm:text-xl font-bold mb-1 text-center">
        {user?.username || "Example User"}
      </h2>

      <p className="text-gray-400 text-xs sm:text-sm mb-6 text-center">
        Te uniste el {joinDate}
      </p>

      <div className="w-full flex flex-col gap-2 items-center mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-[#539390] text-xs sm:text-sm font-normal text-center">
            <span className="font-semibold">{stat.value} </span>
            {stat.label}
          </div>
        ))}
      </div>

      {wallet.isConnected && wallet.account && (
        <div className="w-full border-t border-gray-200 pt-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <PiWallet className="text-[#539390] text-lg" />
            <h3 className="text-[#539390] text-sm font-semibold">Wallet</h3>
            {wallet.chainId === 137 || wallet.chainId === 80001 ? (
              <PiCheckCircle className="text-green-500 text-sm" />
            ) : null}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs font-medium">Dirección</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title={showAddress ? "Ocultar dirección" : "Mostrar dirección"}
                >
                  {showAddress ? (
                    <PiEyeSlash className="text-gray-600 text-sm" />
                  ) : (
                    <PiEye className="text-gray-600 text-sm" />
                  )}
                </button>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title={copied ? "Copiado!" : t("copyAddress")}
                >
                  {copied ? (
                    <PiCheckCircle className="text-green-500 text-sm" />
                  ) : (
                    <PiCopy className="text-gray-600 text-sm" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-gray-800 text-xs font-mono break-all">
              {showAddress ? wallet.account.address : formatAddress(wallet.account.address)}
            </p>
          </div>

          {wallet.account.balance && (
            <div className="mb-3">
              <span className="text-gray-600 text-xs font-medium">Balance</span>
              <p className="text-gray-800 text-sm font-semibold mt-1">
                {wallet.account.balance} MATIC
              </p>
            </div>
          )}

          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting || wallet.isDisconnecting}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            {(isDisconnecting || wallet.isDisconnecting) ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>{t("disconnecting")}</span>
              </>
            ) : (
              <>
                <PiSignOut className="text-sm" />
                <span>{t("disconnectWallet")}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

