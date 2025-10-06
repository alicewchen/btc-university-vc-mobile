import { createThirdwebClient } from "thirdweb";
import { lightTheme } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";

// Create Thirdweb client
export const client = createThirdwebClient({
  clientId: (import.meta.env?.VITE_THIRDWEB_CLIENT_ID as string) || "",
});

// Define wallet options
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "x",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

// Define custom theme matching the Bitcoin University branding
export const bitcoinUniversityTheme = lightTheme({
  colors: { 
    primaryButtonBg: "hsl(24, 95%, 53%)", // Orange theme color
    primaryButtonText: "hsl(0, 0%, 100%)", // White text
    borderColor: "hsl(24, 95%, 53%)",
    connectedButtonBg: "hsl(0, 0%, 100%)", // White background when connected
    connectedButtonBgHover: "hsl(0, 0%, 95%)"
  },
});

// Define custom chains for development
export const localhostChain = defineChain({
  id: 1337,
  name: "Localhost",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "http://localhost:8545",
});

export const hardhatChain = defineChain({
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "http://localhost:8545",
});

// Sepolia Testnet for development wallet pregeneration
export const sepoliaChain = defineChain({
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://11155111.rpc.thirdweb.com",
  blockExplorers: [{
    name: "Sepolia Etherscan",
    url: "https://sepolia.etherscan.io",
    apiUrl: "https://api-sepolia.etherscan.io/api",
  }],
});

// Default chain for development (Sepolia testnet)
export const defaultChain = sepoliaChain;

// Export ConnectButton for easy reuse
export { ConnectButton };