import { SiweMessage } from 'siwe';
import { getAddress } from 'ethers';
import { getEthereumProvider } from './wallet';
import { POLYGON_CHAIN_ID } from './wallet';

export interface SIWEMessageData {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
}

export async function createSIWEMessage(
  address: string,
  nonce: string,
  domain?: string
): Promise<SiweMessage> {
  const currentDomain = domain || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  const currentUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3003';

  const checksumAddress = getAddress(address);

  const message = new SiweMessage({
    domain: currentDomain,
    address: checksumAddress,
    statement: 'Link your Ethereum wallet to your Oxygen account',
    uri: currentUri,
    version: '1',
    chainId: POLYGON_CHAIN_ID,
    nonce: nonce,
    issuedAt: new Date().toISOString(),
  });

  return message;
}

export async function signMessage(message: string, address: string): Promise<string> {
  const provider = getEthereumProvider();

  if (!provider.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const checksumAddress = getAddress(address);
    const signature = await provider.ethereum.request({
      method: 'personal_sign',
      params: [message, checksumAddress],
    }) as string;

    return signature;
  } catch (error) {
    if ((error as Error).message.includes('User rejected') || (error as Error).message.includes('User denied')) {
      throw new Error('User rejected the signature');
    }
    throw error;
  }
}

export function formatSIWEMessage(message: SiweMessage): string {
  return message.prepareMessage();
}
