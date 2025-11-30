"use client";
import { useTranslations } from "next-intl";
import { useWallet } from "../../context/Wallet_Context";
import { PiWallet, PiCheckCircle, PiWarningCircle, PiCopy } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import { formatAddress } from "../../utils/wallet";
import { POLYGON_CHAIN_ID, POLYGON_TESTNET_CHAIN_ID } from "../../utils/wallet";
import { get } from "@/utils/request";

const Wallet_Status = () => {
  const t = useTranslations("Wallet");
  const { wallet, switchNetwork } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [linkedWalletAddress, setLinkedWalletAddress] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!wallet.isConnected || !wallet.account) {
      setIsLinked(false);
      setLinkedWalletAddress(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const currentAddress = wallet.account.address.toLowerCase();
    let cancelled = false;

    const checkLinked = async () => {
      if (cancelled) return;
      
      try {
        const data: any = await get(`/api/wallet/check?address=${encodeURIComponent(currentAddress)}`);
        if (cancelled) return;
        
        const linked = data?.isLinked === true && data?.walletAddress !== null;
        const linkedAddress = data?.walletAddress || null;
        
        setIsLinked(linked);
        setLinkedWalletAddress(linkedAddress);
        
        if (linked && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch {
        if (cancelled) return;
        setIsLinked(false);
        setLinkedWalletAddress(null);
      }
    };

    checkLinked();
    
    intervalRef.current = setInterval(() => {
      checkLinked();
    }, 2000);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [wallet.isConnected, wallet.account?.address]);

  if (!wallet.isConnected || !wallet.account) {
    return null;
  }

  const isCorrectNetwork = wallet.chainId === POLYGON_CHAIN_ID || wallet.chainId === POLYGON_TESTNET_CHAIN_ID;
  const isTestnet = wallet.chainId === POLYGON_TESTNET_CHAIN_ID;

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(false);
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  if (!isLinked || !linkedWalletAddress) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white/50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <PiCheckCircle className="flex-shrink-0" style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }} />
          <span className="text-xs text-white/70">Signed</span>
          <PiWallet className="text-white text-sm" />
          <p className="text-xs text-white font-medium truncate">
            {formatAddress(linkedWalletAddress)}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(linkedWalletAddress);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
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

