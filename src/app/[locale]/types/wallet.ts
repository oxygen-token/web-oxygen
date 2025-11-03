export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase';

export type ChainId = number;

export interface WalletAccount {
  address: string;
  balance?: string;
  chainId?: ChainId;
}

export interface WalletConnection {
  isConnected: boolean;
  account: WalletAccount | null;
  provider: WalletProvider | null;
  chainId: ChainId | null;
  error: string | null;
}

export interface WalletState extends WalletConnection {
  isConnecting: boolean;
  isDisconnecting: boolean;
}

export interface EthereumProvider extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
    networkVersion?: string;
  };
}

