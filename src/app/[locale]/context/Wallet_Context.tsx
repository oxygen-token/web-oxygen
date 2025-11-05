"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import type { WalletProvider as WalletProviderType } from "../types/wallet";
import { WalletState, WalletAccount, ChainId } from "../types/wallet";
import {
  isMetaMaskInstalled,
  requestAccount,
  getAccounts,
  getChainId,
  switchToPolygon,
  getBalance,
  POLYGON_CHAIN_ID,
  formatBalance,
} from "../utils/wallet";
import { EthereumProvider } from "../types/wallet";

interface WalletContextType {
  wallet: WalletState;
  connect: (provider?: WalletProviderType) => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (useTestnet?: boolean) => Promise<void>;
  refreshAccount: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    account: null,
    provider: null,
    chainId: null,
    error: null,
    isConnecting: false,
    isDisconnecting: false,
  });

  const handleAccountsChangedRef = useRef<(accounts: string[]) => Promise<void>>();
  const handleChainChangedRef = useRef<() => Promise<void>>();

  const updateAccount = useCallback(async (address: string): Promise<WalletAccount> => {
    try {
      const [balance, chainId] = await Promise.all([
        getBalance(address),
        getChainId(),
      ]);

      const formattedBalance = formatBalance(balance);

      return {
        address,
        balance: formattedBalance,
        chainId: chainId,
      };
    } catch (error) {
      return {
        address,
      };
    }
  }, []);

  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length === 0) {
      setWallet((prev) => ({
        ...prev,
        isConnected: false,
        account: null,
        error: null,
      }));
    } else {
      try {
        const account = await updateAccount(accounts[0]);
        setWallet((prev) => {
          if (prev.account?.address === account.address) {
            return prev;
          }
          return {
            ...prev,
            account,
            error: null,
          };
        });
      } catch (error) {
        setWallet((prev) => ({
          ...prev,
          error: (error as Error).message,
        }));
      }
    }
  }, [updateAccount]);

  handleAccountsChangedRef.current = handleAccountsChanged;

  const handleChainChanged = useCallback(async () => {
    setWallet((prev) => {
      if (!prev.account) return prev;
      
      const currentAddress = prev.account.address;
      updateAccount(currentAddress).then((updatedAccount) => {
        setWallet((current) => {
          if (current.account?.address === currentAddress) {
            return {
              ...current,
              account: updatedAccount,
              error: null,
            };
          }
          return current;
        });
      }).catch((error) => {
        setWallet((current) => ({
          ...current,
          error: (error as Error).message,
        }));
      });
      
      return prev;
    });
  }, [updateAccount]);

  handleChainChangedRef.current = handleChainChanged;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const provider = (window as EthereumProvider).ethereum;
    if (!provider) return;

    let mounted = true;

    const checkConnection = async () => {
      try {
        const accounts = await getAccounts();
        if (accounts.length > 0 && mounted) {
          const account = await updateAccount(accounts[0]);
          const chainId = await getChainId();
          
          if (mounted) {
            setWallet((prev) => {
              if (prev.isConnected && prev.account?.address === account.address) {
                return prev;
              }
              return {
                ...prev,
                isConnected: true,
                account,
                provider: 'metamask',
                chainId,
              };
            });
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    const accountsChangedWrapper = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (mounted && handleAccountsChangedRef.current) {
        handleAccountsChangedRef.current(accounts).catch(console.error);
      }
    };

    const chainChangedWrapper = () => {
      if (mounted && handleChainChangedRef.current) {
        handleChainChangedRef.current().catch(console.error);
      }
    };

    provider.on('accountsChanged', accountsChangedWrapper);
    provider.on('chainChanged', chainChangedWrapper);

    return () => {
      mounted = false;
      provider.removeListener('accountsChanged', accountsChangedWrapper);
      provider.removeListener('chainChanged', chainChangedWrapper);
    };
  }, []);

  const connect = useCallback(async (provider: WalletProviderType = 'metamask') => {
    if (provider !== 'metamask') {
      throw new Error('Only MetaMask is currently supported');
    }

    if (!isMetaMaskInstalled()) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      throw new Error('MetaMask is not installed');
    }

    setWallet((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const address = await requestAccount();
      const account = await updateAccount(address);
      const chainId = await getChainId();

      setWallet({
        isConnected: true,
        account,
        provider: 'metamask',
        chainId,
        error: null,
        isConnecting: false,
        isDisconnecting: false,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
        isConnecting: false,
      }));
      throw error;
    }
  }, [updateAccount]);

  const disconnect = useCallback(async () => {
    setWallet((prev) => ({
      ...prev,
      isDisconnecting: true,
    }));

    try {
      setWallet({
        isConnected: false,
        account: null,
        provider: null,
        chainId: null,
        error: null,
        isConnecting: false,
        isDisconnecting: false,
      });
    } catch (error) {
      setWallet((prev) => ({
        ...prev,
        error: (error as Error).message,
        isDisconnecting: false,
      }));
    }
  }, []);

  const switchNetwork = useCallback(async (useTestnet: boolean = false) => {
    try {
      await switchToPolygon(useTestnet);
      if (wallet.account) {
        const updatedAccount = await updateAccount(wallet.account.address);
        const chainId = await getChainId();
        
        setWallet((prev) => ({
          ...prev,
          account: updatedAccount,
          chainId,
        }));
      }
    } catch (error) {
      setWallet((prev) => ({
        ...prev,
        error: (error as Error).message,
      }));
      throw error;
    }
  }, [wallet.account, updateAccount]);

  const refreshAccount = useCallback(async () => {
    if (!wallet.account) return;

    try {
      const updatedAccount = await updateAccount(wallet.account.address);
      setWallet((prev) => ({
        ...prev,
        account: updatedAccount,
        error: null,
      }));
    } catch (error) {
      setWallet((prev) => ({
        ...prev,
        error: (error as Error).message,
      }));
    }
  }, [wallet.account, updateAccount]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connect,
        disconnect,
        switchNetwork,
        refreshAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

