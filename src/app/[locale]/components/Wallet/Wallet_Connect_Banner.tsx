"use client";
import { useTranslations } from "next-intl";
import { useWallet } from "../../context/Wallet_Context";
import { useAuth } from "../../context/Auth_Context";
import { PiWallet, PiWarningCircle, PiPencilSimple } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import { get, post } from "@/utils/request";
import { createSIWEMessage, signMessage, formatSIWEMessage } from "../../utils/siwe";

const Wallet_Connect_Banner = () => {
  const t = useTranslations("Wallet");
  const { wallet, connect, switchNetwork, disconnect, setIgnoreAutoConnect } = useWallet();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkStatus, setLinkStatus] = useState<"unknown" | "checking" | "linked" | "unlinked">("unknown");
  const [isSigning, setIsSigning] = useState(false);
  const previousUserRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.email || null;
    
    if (previousUserRef.current !== null && previousUserRef.current !== currentUserId) {
      setIgnoreAutoConnect(true);
      if (wallet.isConnected) {
        disconnect();
      }
    }
    
    previousUserRef.current = currentUserId;
  }, [user?.email, wallet.isConnected, disconnect, setIgnoreAutoConnect]);

  useEffect(() => {
    const checkAndSwitchNetwork = async () => {
      if (wallet.isConnected && wallet.chainId && wallet.chainId !== 137 && wallet.chainId !== 80001) {
        try {
          await switchNetwork(false);
        } catch {
          // ignore
        }
      }
    };

    if (wallet.isConnected) {
      checkAndSwitchNetwork();
    }
  }, [wallet.isConnected, wallet.chainId, switchNetwork]);

  useEffect(() => {
    if (!wallet.isConnected || !wallet.account) {
      setLinkStatus("unknown");
      return;
    }

    const currentAddress = wallet.account.address.toLowerCase();
    let cancelled = false;

    const run = async () => {
      setLinkStatus("checking");
      try {
        const data: any = await get(`/api/wallet/check?address=${encodeURIComponent(currentAddress)}`);
        if (cancelled) return;
        const linked = data?.isLinked === true && data?.walletAddress !== null;
        
        if (linked) {
          setLinkStatus("linked");
          setIgnoreAutoConnect(false);
        } else {
          setLinkStatus("unlinked");
          setIgnoreAutoConnect(true);
          if (!cancelled) {
            await disconnect();
          }
        }
      } catch {
        if (cancelled) return;
        setLinkStatus("unlinked");
        setIgnoreAutoConnect(true);
        if (!cancelled) {
          await disconnect();
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [wallet.isConnected, wallet.account?.address, disconnect, setIgnoreAutoConnect]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setIgnoreAutoConnect(false);
    try {
      await connect("metamask");
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("User rejected") || errorMessage.includes("rejected")) {
        return;
      }
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignIn = async () => {
    if (!wallet.isConnected || !wallet.account || isSigning) return;

    setIsSigning(true);
    try {
      const nonceData: any = await get("/wallet/nonce");
      if (!nonceData.nonce) throw new Error("Failed to get nonce");

      const siweMessage = await createSIWEMessage(wallet.account.address, nonceData.nonce);
      const messageToSign = formatSIWEMessage(siweMessage);
      const signature = await signMessage(messageToSign, wallet.account.address);

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

      await post("/wallet/link", {
        message: messageObject,
        signature,
      });

      setLinkStatus("linked");
    } catch (error) {
      console.error("SIWE signing error:", error);
    } finally {
      setIsSigning(false);
    }
  };

  if (wallet.error && wallet.error.includes("not installed")) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg backdrop-blur-sm">
        <PiWarningCircle className="text-amber-400 text-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-200 font-medium">{t("metamaskNotInstalled")}</p>
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

  if (!wallet.isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <PiWallet className="text-white text-lg flex-shrink-0 group-hover:text-white transition-colors" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs text-white font-medium">
            {isConnecting ? t("connecting") : t("connectWallet")}
          </p>
        </div>
        {isConnecting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </button>
    );
  }

  if (wallet.isConnected && wallet.account) {
    if (linkStatus === "checking") {
      return (
        <button
          disabled
          className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white/50 rounded-lg backdrop-blur-sm opacity-50 cursor-not-allowed"
        >
          <PiWallet className="text-white text-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-white font-medium">Checking...</p>
          </div>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </button>
      );
    }

    if (linkStatus === "unlinked") {
      return (
        <button
          onClick={handleSignIn}
          disabled={isSigning}
          className="flex items-center gap-3 px-4 py-2 bg-transparent border border-white/50 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <PiPencilSimple className="text-white text-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-white font-medium">
              {isSigning ? "Signing..." : "Sign in with Ethereum"}
            </p>
          </div>
          {isSigning && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      );
    }

    if (linkStatus === "linked") {
      return null;
    }
  }

  return null;
};

export default Wallet_Connect_Banner;
