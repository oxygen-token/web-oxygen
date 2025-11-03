import { EthereumProvider, WalletAccount, ChainId } from '../types/wallet';

export const POLYGON_CHAIN_ID: ChainId = 137;
export const POLYGON_TESTNET_CHAIN_ID: ChainId = 80001;

export const POLYGON_MAINNET = {
  chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

export const POLYGON_TESTNET = {
  chainId: `0x${POLYGON_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: 'Polygon Mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

export function getEthereumProvider(): EthereumProvider {
  if (typeof window === 'undefined') {
    throw new Error('Window is not defined');
  }
  return window as EthereumProvider;
}

export function isMetaMaskInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const provider = getEthereumProvider();
  return !!provider.ethereum?.isMetaMask;
}

export async function requestAccount(): Promise<string> {
  const provider = getEthereumProvider();
  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await provider.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  } catch (error) {
    if ((error as Error).message.includes('User rejected')) {
      throw new Error('User rejected the connection');
    }
    throw error;
  }
}

export async function getAccounts(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await provider.ethereum.request({
      method: 'eth_accounts',
    }) as string[];
    
    return accounts || [];
  } catch (error) {
    throw error;
  }
}

export async function getChainId(): Promise<ChainId> {
  const provider = getEthereumProvider();
  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await provider.ethereum.request({
      method: 'eth_chainId',
    }) as string;
    
    return parseInt(chainId, 16);
  } catch (error) {
    throw error;
  }
}

export async function switchToPolygon(useTestnet: boolean = false): Promise<void> {
  const provider = getEthereumProvider();
  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = useTestnet ? POLYGON_TESTNET : POLYGON_MAINNET;

  try {
    await provider.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (switchError: unknown) {
    if ((switchError as { code: number }).code === 4902) {
      try {
        await provider.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
      } catch (addError) {
        throw new Error('Failed to add Polygon network');
      }
    } else {
      throw switchError;
    }
  }
}

export async function getBalance(address: string): Promise<string> {
  const provider = getEthereumProvider();
  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const balance = await provider.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }) as string;
    
    return balance;
  } catch (error) {
    throw error;
  }
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string, decimals: number = 18): string {
  if (!balance) return '0';
  const balanceBigInt = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const whole = balanceBigInt / divisor;
  const remainder = balanceBigInt % divisor;
  
  if (remainder === BigInt(0)) {
    return whole.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmed = remainderStr.replace(/0+$/, '');
  
  return `${whole}.${trimmed}`;
}

