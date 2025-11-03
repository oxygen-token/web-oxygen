"use client";
import { useTranslations } from "next-intl";
import { useWallet } from "../../context/Wallet_Context";
import { PiWallet, PiWarningCircle } from "react-icons/pi";
import { useState, useEffect } from "react";

const Wallet_Connect_Banner = () => {
  const t = useTranslations("Wallet");
  const { wallet, connect, switchNetwork } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkAndSwitchNetwork = async () => {
      if (wallet.isConnected && wallet.chainId && wallet.chainId !== 137 && wallet.chainId !== 80001) {
        try {
          await switchNetwork(false);
        } catch (error) {
          console.error("Error switching network:", error);
        }
      }
    };

    if (wallet.isConnected) {
      checkAndSwitchNetwork();
    }
  }, [wallet.isConnected, wallet.chainId, switchNetwork]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect('metamask');
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (wallet.isConnected && wallet.account) {
    return null;
  }

  if (wallet.error && wallet.error.includes('not installed')) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg backdrop-blur-sm">
        <PiWarningCircle className="text-amber-400 text-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-200 font-medium">
            {t("metamaskNotInstalled")}
          </p>
        </div>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors whitespace-nowrap"
        >
          {t("installMetaMask")}
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || wallet.isConnecting}
      className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <PiWallet className="text-white text-lg flex-shrink-0 group-hover:text-white transition-colors" />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-xs text-white font-medium">
          {isConnecting || wallet.isConnecting ? t("connecting") : t("connectWallet")}
        </p>
      </div>
      {(isConnecting || wallet.isConnecting) && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
    </button>
  );
};

export default Wallet_Connect_Banner;

