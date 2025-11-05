"use client";
import { useTranslations } from "next-intl";
import { useWallet } from "../../context/Wallet_Context";
import { PiWallet, PiWarningCircle } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import SIWE_Link_Modal from "./SIWE_Link_Modal";

const Wallet_Connect_Banner = () => {
  const t = useTranslations("Wallet");
  const { wallet, connect, switchNetwork } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletLinked, setIsWalletLinked] = useState(false);
  const [showSIWEModal, setShowSIWEModal] = useState(false);
  const [isCheckingLink, setIsCheckingLink] = useState(false);
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);
  const lastCheckedAddressRef = useRef<string | null>(null);
  const showSIWEModalRef = useRef(false);
  const isWalletLinkedRef = useRef(false);

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

  useEffect(() => {
    if (!wallet.isConnected || !wallet.account) {
      setIsWalletLinked(false);
      isWalletLinkedRef.current = false;
      setShowSIWEModal(false);
      showSIWEModalRef.current = false;
      hasCheckedRef.current = false;
      lastCheckedAddressRef.current = null;
      isCheckingRef.current = false;
      return;
    }

    const currentAddress = wallet.account.address.toLowerCase();
    
    if (isCheckingRef.current) {
      return;
    }

    if (isWalletLinkedRef.current && lastCheckedAddressRef.current === currentAddress && hasCheckedRef.current) {
      setShowSIWEModal(false);
      showSIWEModalRef.current = false;
      return;
    }

    if (lastCheckedAddressRef.current === currentAddress && hasCheckedRef.current && !isWalletLinkedRef.current && !showSIWEModalRef.current) {
      showSIWEModalRef.current = true;
      setShowSIWEModal(true);
      return;
    }

    if (lastCheckedAddressRef.current !== currentAddress) {
      hasCheckedRef.current = false;
      setIsWalletLinked(false);
      isWalletLinkedRef.current = false;
      setShowSIWEModal(false);
      showSIWEModalRef.current = false;
    }

    if (hasCheckedRef.current && lastCheckedAddressRef.current === currentAddress) {
      return;
    }

    const checkWalletLink = async () => {
      isCheckingRef.current = true;
      setIsCheckingLink(true);
      
      try {
        const response = await fetch(
          `/api/wallet/check?address=${encodeURIComponent(currentAddress)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const linked = data.isLinked || false;
          setIsWalletLinked(linked);
          isWalletLinkedRef.current = linked;
          hasCheckedRef.current = true;
          lastCheckedAddressRef.current = currentAddress;

          if (linked) {
            setShowSIWEModal(false);
            showSIWEModalRef.current = false;
          } else if (!showSIWEModalRef.current) {
            showSIWEModalRef.current = true;
            setShowSIWEModal(true);
          }
        } else if (response.status === 401) {
          console.warn("Unauthorized - User may not be logged in");
          setIsWalletLinked(false);
          isWalletLinkedRef.current = false;
          hasCheckedRef.current = true;
          lastCheckedAddressRef.current = currentAddress;
          if (!showSIWEModalRef.current) {
            showSIWEModalRef.current = true;
            setShowSIWEModal(true);
          }
        } else {
          console.error("Error checking wallet link:", response.status);
          setIsWalletLinked(false);
          isWalletLinkedRef.current = false;
          hasCheckedRef.current = true;
          lastCheckedAddressRef.current = currentAddress;
          if (!showSIWEModalRef.current) {
            showSIWEModalRef.current = true;
            setShowSIWEModal(true);
          }
        }
      } catch (error) {
        console.error("Error checking wallet link:", error);
        setIsWalletLinked(false);
        isWalletLinkedRef.current = false;
        hasCheckedRef.current = true;
        lastCheckedAddressRef.current = currentAddress;
        if (!showSIWEModalRef.current) {
          setTimeout(() => {
            setShowSIWEModal(true);
            showSIWEModalRef.current = true;
          }, 100);
        }
      } finally {
        setIsCheckingLink(false);
        isCheckingRef.current = false;
      }
    };

    if (!hasCheckedRef.current || lastCheckedAddressRef.current !== currentAddress) {
      checkWalletLink();
    }
  }, [wallet.isConnected, wallet.account?.address]);

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

  const handleSIWESuccess = async (walletAddress: string) => {
    const currentAddress = wallet.account?.address?.toLowerCase();
    
    setIsWalletLinked(true);
    isWalletLinkedRef.current = true;
    setShowSIWEModal(false);
    showSIWEModalRef.current = false;
    hasCheckedRef.current = true;
    lastCheckedAddressRef.current = currentAddress || null;
    
    try {
      if (currentAddress) {
        const response = await fetch(
          `/api/wallet/check?address=${encodeURIComponent(currentAddress)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const linked = data.isLinked || false;
          if (linked) {
            setIsWalletLinked(true);
            isWalletLinkedRef.current = true;
            setShowSIWEModal(false);
            showSIWEModalRef.current = false;
            hasCheckedRef.current = true;
            lastCheckedAddressRef.current = currentAddress;
          }
        }
      }
    } catch (error) {
      console.error("Error verifying wallet link after success:", error);
    }
  };

  const handleCloseModal = () => {
    setShowSIWEModal(false);
    showSIWEModalRef.current = false;
  };

  if (wallet.isConnected && wallet.account && isWalletLinked) {
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
    <>
      <SIWE_Link_Modal
        show={showSIWEModal}
        onClose={handleCloseModal}
        onSuccess={handleSIWESuccess}
      />
      {!wallet.isConnected && (
        <button
          onClick={handleConnect}
          disabled={isConnecting || wallet.isConnecting || isCheckingLink}
          className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <PiWallet className="text-white text-lg flex-shrink-0 group-hover:text-white transition-colors" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-white font-medium">
              {isConnecting || wallet.isConnecting
                ? t("connecting")
                : isCheckingLink
                ? "Checking..."
                : t("connectWallet")}
            </p>
          </div>
          {(isConnecting || wallet.isConnecting || isCheckingLink) && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      )}
    </>
  );
};

export default Wallet_Connect_Banner;
