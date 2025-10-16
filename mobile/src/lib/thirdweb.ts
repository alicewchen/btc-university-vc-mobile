import { createThirdwebClient } from 'thirdweb';
import { lightTheme, ThirdwebProvider, ConnectButton } from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';

const THIRDWEB_CLIENT_ID = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID;
const RESOLVED_CLIENT_ID =
  THIRDWEB_CLIENT_ID && THIRDWEB_CLIENT_ID.trim().length > 0
    ? THIRDWEB_CLIENT_ID.trim()
    : 'demo-client';

if (!THIRDWEB_CLIENT_ID) {
  console.warn(
    '[Thirdweb] EXPO_PUBLIC_THIRDWEB_CLIENT_ID is not set. Falling back to "demo-client" for development.\n' +
      'Set EXPO_PUBLIC_THIRDWEB_CLIENT_ID in your environment for production builds.',
  );
}

export const client = createThirdwebClient({
  clientId: RESOLVED_CLIENT_ID,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: ['google', 'discord', 'telegram', 'farcaster', 'x'],
    },
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('io.zerion.wallet'),
];

export const bitcoinUniversityTheme = lightTheme({
  colors: {
    primaryButtonBg: 'hsl(24, 95%, 53%)',
    primaryButtonText: 'hsl(0, 0%, 100%)',
    borderColor: 'hsl(24, 95%, 53%)',
    connectedButtonBg: 'hsl(0, 0%, 100%)',
    connectedButtonBgHover: 'hsl(0, 0%, 95%)',
  },
});

export const localhostChain = defineChain({
  id: 1337,
  name: 'Localhost',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpc: 'http://localhost:8545',
});

export const hardhatChain = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpc: 'http://localhost:8545',
});

export const sepoliaChain = defineChain({
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpc: 'https://11155111.rpc.thirdweb.com',
  blockExplorers: [
    {
      name: 'Sepolia Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api',
    },
  ],
});

export const defaultChain = sepoliaChain;

export { ThirdwebProvider, ConnectButton };
