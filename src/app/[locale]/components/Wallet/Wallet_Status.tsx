"use client";
import { useTranslations } from "next-intl";
import { useWallet } from "../../context/Wallet_Context";
import { PiWallet, PiCheckCircle, PiWarningCircle, PiCopy } from "react-icons/pi";
import { useState } from "react";
import { formatAddress } from "../../utils/wallet";
import { POLYGON_CHAIN_ID, POLYGON_TESTNET_CHAIN_ID } from "../../utils/wallet";

const Wallet_Status = () => {
  const t = useTranslations("Wallet");
  const { wallet, switchNetwork } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!wallet.isConnected || !wallet.account) {
    return null;
  }

  const isCorrectNetwork = wallet.chainId === POLYGON_CHAIN_ID || wallet.chainId === POLYGON_TESTNET_CHAIN_ID;
  const isTestnet = wallet.chainId === POLYGON_TESTNET_CHAIN_ID;

  const handleCopyAddress = () => {
    if (!wallet.account) return;
    navigator.clipboard.writeText(wallet.account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(false);
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white/50 rounded-lg">
      <PiCheckCircle className="text-white text-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <PiWallet className="text-white text-sm" />
          <p className="text-xs text-white font-medium truncate">
            {formatAddress(wallet.account.address)}
          </p>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={t("copyAddress")}
          >
            <PiCopy className={`text-xs ${copied ? 'text-white' : 'text-white/80'}`} />
          </button>
        </div>
        {!isCorrectNetwork && (
          <button
            onClick={handleSwitchNetwork}
            className="mt-1 flex items-center gap-1 text-xs text-white hover:text-white/80"
          >
            <PiWarningCircle className="text-xs" />
            <span>{t("switchToPolygon")}</span>
          </button>
        )}
        {isCorrectNetwork && isTestnet && (
          <p className="mt-1 text-xs text-white/80">{t("testnet")}</p>
        )}
      </div>
    </div>
  );
};

export default Wallet_Status;

