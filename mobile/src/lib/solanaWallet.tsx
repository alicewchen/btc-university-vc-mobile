import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateMockAddress = () => {
  let address = '';
  for (let i = 0; i < 44; i += 1) {
    const index = Math.floor(Math.random() * BASE58_ALPHABET.length);
    address += BASE58_ALPHABET[index];
  }
  return address;
};

const shortenAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export interface WalletAccount {
  address: string;
  label?: string;
  type: 'mock' | 'generated';
  signMessage: ({ message }: { message: string }) => Promise<string>;
}

export interface ConnectOptions {
  type?: 'mock' | 'generated';
  address?: string;
  label?: string;
}

interface SolanaWalletContextValue {
  account: WalletAccount | null;
  connect: (options?: ConnectOptions) => Promise<WalletAccount>;
  disconnect: () => Promise<void>;
  connecting: boolean;
  isMockConnection: boolean;
}

const SolanaWalletContext = createContext<SolanaWalletContextValue | undefined>(
  undefined,
);

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isMockConnection, setIsMockConnection] = useState(false);

  const connect = useCallback(async (options?: ConnectOptions) => {
    const connectionType = options?.type ?? 'generated';
    const address = options?.address ?? generateMockAddress();
    const label =
      options?.label ??
      (connectionType === 'mock' ? 'Demo Investor Wallet' : 'Solana Devnet Wallet');

    setConnecting(true);
    try {
      await delay(350);

      const newAccount: WalletAccount = {
        address,
        label,
        type: connectionType,
        signMessage: async ({ message }: { message: string }) =>
          Promise.resolve(`sig-${address}-${message.length}-${Date.now()}`),
      };

      setAccount(newAccount);
      setIsMockConnection(connectionType === 'mock');
      return newAccount;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnecting(true);
    try {
      await delay(200);
      setAccount(null);
      setIsMockConnection(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      account,
      connect,
      disconnect,
      connecting,
      isMockConnection,
    }),
    [account, connect, disconnect, connecting, isMockConnection],
  );

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

function useWalletContext() {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
}

export function useSolanaWallet() {
  return useWalletContext();
}

export function useActiveAccount() {
  const { account } = useWalletContext();
  return account;
}

export function useActiveWallet() {
  const { account, isMockConnection } = useWalletContext();
  if (!account) {
    return null;
  }

  return {
    ...account,
    isMockConnection,
  };
}

export function useConnect() {
  const { connect, connecting } = useWalletContext();
  return {
    connect,
    isConnecting: connecting,
  };
}

export function useDisconnect() {
  const { disconnect } = useWalletContext();
  return {
    disconnect,
  };
}

export interface ConnectButtonProps {
  label?: string;
  connectedLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ConnectButton({
  label = 'Connect Solana Wallet',
  connectedLabel,
  style,
}: ConnectButtonProps) {
  const { account, connecting, connect, disconnect } = useWalletContext();

  const buttonLabel = account
    ? connectedLabel ?? `Connected: ${shortenAddress(account.address)}`
    : label;

  const handlePress = async () => {
    if (account) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return (
    <Button
      mode={account ? 'outlined' : 'contained'}
      onPress={handlePress}
      loading={connecting}
      style={style}
    >
      {buttonLabel}
    </Button>
  );
}

export const bitcoinUniversityTheme = {
  primary: '#F97316',
  onPrimary: '#FFFFFF',
  border: '#F97316',
  connectedBackground: '#FFFFFF',
  connectedBackgroundHover: '#F5F5F5',
};
