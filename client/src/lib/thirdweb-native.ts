// thirdweb Native Configuration
// Enhanced wallet setup with In-App Wallets, Smart Wallets, and gasless transactions

import { createThirdwebClient } from "thirdweb";
import { 
  createWallet,
  inAppWallet,
  smartWallet,
  injectedProvider,
} from "thirdweb/wallets";
import { base, baseSepolia } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// Initialize client
export const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "",
});

// Chain configuration
export const activeChain = import.meta.env.VITE_CHAIN === "base" ? base : baseSepolia;

// Smart contract addresses (would be deployed contracts)
export const CONTRACT_ADDRESSES = {
  investmentTracker: import.meta.env.VITE_INVESTMENT_TRACKER_ADDRESS || "",
  daoFactory: import.meta.env.VITE_DAO_FACTORY_ADDRESS || "",
  treasuryRouter: import.meta.env.VITE_TREASURY_ROUTER_ADDRESS || "",
};

// In-App Wallet configuration
export const inAppWalletConfig = inAppWallet({
  auth: {
    options: ["email", "google", "apple", "facebook"],
  },
  smartAccount: {
    chain: activeChain,
    sponsorGas: true, // Enable gasless transactions
  },
});

// Native wallet connectors
export const walletConnectors = [
  // In-App Wallet (primary option for easy onboarding)
  inAppWalletConfig,
  
  // External wallets for crypto natives
  injectedProvider({
    recommended: true,
  }),
  
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
];

// Smart Wallet factory for gasless transactions
export const createSmartWallet = (personalWallet: any) => {
  return smartWallet({
    chain: activeChain,
    gasless: true,
    personalAccount: personalWallet,
  });
};

// Batch transaction builder
export class BatchTransactionBuilder {
  private transactions: any[] = [];

  add(contract: string, method: string, params: any[], value?: string) {
    this.transactions.push({
      toAddress: contract,
      data: this.encodeFunction(method, params),
      value: value || "0",
    });
    return this;
  }

  private encodeFunction(method: string, params: any[]): string {
    // This would encode the function call
    // In production, use thirdweb SDK's encoding utilities
    return "0x" + method; // Placeholder
  }

  build() {
    return this.transactions;
  }

  clear() {
    this.transactions = [];
  }
}

// Investment contract interface
export class InvestmentContract {
  private contractAddress: string;

  constructor(address?: string) {
    this.contractAddress = address || CONTRACT_ADDRESSES.investmentTracker;
  }

  // Read investor portfolio from blockchain
  async getInvestorPortfolio(investorAddress: string) {
    // In production, use thirdweb SDK to read contract
    try {
      // Placeholder for contract read
      return {
        totalInvested: "0",
        investmentCount: 0,
        recentInvestments: [],
      };
    } catch (error) {
      console.error("Failed to read portfolio:", error);
      return null;
    }
  }

  // Get all investments for an investor
  async getInvestorInvestments(investorAddress: string) {
    try {
      // Placeholder for contract read
      return [];
    } catch (error) {
      console.error("Failed to read investments:", error);
      return [];
    }
  }

  // Prepare batch investment transaction
  prepareBatchInvestment(items: any[]) {
    const builder = new BatchTransactionBuilder();
    
    items.forEach(item => {
      builder.add(
        this.contractAddress,
        "invest",
        [item.targetType, item.targetId, item.metadata || ""],
        item.amount
      );
    });

    return builder.build();
  }
}

// Session management for gasless transactions
export class SessionKeyManager {
  private sessionKey: string | null = null;
  private expiresAt: number = 0;

  async createSession(wallet: any, permissions: string[]) {
    // Create a session key for gasless transactions
    // This would interact with thirdweb's session key infrastructure
    const now = Date.now();
    const duration = 24 * 60 * 60 * 1000; // 24 hours
    
    this.sessionKey = "session_" + Math.random().toString(36);
    this.expiresAt = now + duration;
    
    return this.sessionKey;
  }

  isValid(): boolean {
    return this.sessionKey !== null && Date.now() < this.expiresAt;
  }

  getKey(): string | null {
    return this.isValid() ? this.sessionKey : null;
  }

  clear() {
    this.sessionKey = null;
    this.expiresAt = 0;
  }
}

// Hooks for easy integration
export const useInvestmentContract = () => {
  return new InvestmentContract();
};

export const useBatchBuilder = () => {
  return new BatchTransactionBuilder();
};

export const useSessionManager = () => {
  return new SessionKeyManager();
};

// Export configured client and chain
export { thirdwebClient as client, activeChain as chain };

// Helper to check if wallet is smart wallet
export const isSmartWallet = (wallet: any): boolean => {
  return wallet?.type === "smart" || wallet?.account?.type === "smart";
};

// Helper to check if wallet is in-app wallet
export const isInAppWallet = (wallet: any): boolean => {
  return wallet?.id === "inApp" || wallet?.connector?.id === "inApp";
};

// Gas estimation helper
export async function estimateGasCost(transactions: any[]): Promise<string> {
  // In production, this would estimate gas using thirdweb SDK
  const estimatedGas = transactions.length * 100000; // Placeholder
  return estimatedGas.toString();
}

// Transaction status monitor
export class TransactionMonitor {
  private pending: Map<string, any> = new Map();

  track(txHash: string, description: string) {
    this.pending.set(txHash, {
      hash: txHash,
      description,
      timestamp: Date.now(),
      status: "pending",
    });
  }

  async waitForConfirmation(txHash: string): Promise<boolean> {
    // In production, poll blockchain for transaction status
    return new Promise(resolve => {
      setTimeout(() => {
        this.pending.delete(txHash);
        resolve(true);
      }, 3000);
    });
  }

  getPending(): any[] {
    return Array.from(this.pending.values());
  }
}

export default {
  client: thirdwebClient,
  chain: activeChain,
  contracts: CONTRACT_ADDRESSES,
  wallets: walletConnectors,
  InvestmentContract,
  BatchTransactionBuilder,
  SessionKeyManager,
  TransactionMonitor,
};