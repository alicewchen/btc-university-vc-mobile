// thirdweb Engine Integration
// This module handles all thirdweb Engine operations including
// batch transactions, smart backend wallets, and on-chain interactions

import { z } from "zod";

// Engine configuration
export const EngineConfig = {
  // In production, these would come from environment variables
  engineUrl: process.env.THIRDWEB_ENGINE_URL || "https://engine.thirdweb.com",
  accessToken: process.env.THIRDWEB_ENGINE_ACCESS_TOKEN || "",
  backendWalletAddress: process.env.THIRDWEB_BACKEND_WALLET || "",
  chainId: process.env.THIRDWEB_CHAIN_ID || "84532", // Base Sepolia default
};

// Transaction types for batch operations
export const TransactionSchema = z.object({
  toAddress: z.string(),
  value: z.string().optional().default("0"),
  data: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Batch transaction request schema
export const BatchTransactionSchema = z.object({
  transactions: z.array(TransactionSchema),
  atomic: z.boolean().optional().default(true),
});

export type BatchTransaction = z.infer<typeof BatchTransactionSchema>;

// Engine API client
export class ThirdwebEngine {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = EngineConfig.engineUrl;
    this.headers = {
      "Authorization": `Bearer ${EngineConfig.accessToken}`,
      "Content-Type": "application/json",
      "x-backend-wallet-address": EngineConfig.backendWalletAddress,
    };
  }

  // Send atomic batch transaction
  async sendBatchTransactionAtomic(transactions: Transaction[]) {
    const endpoint = `/backend-wallet/${EngineConfig.chainId}/send-transaction-batch-atomic`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Engine batch transaction failed: ${error}`);
    }

    return response.json();
  }

  // Deploy smart contract
  async deployContract(contractType: string, parameters: any) {
    const endpoint = `/deploy/${EngineConfig.chainId}/prebuilts/${contractType}`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(parameters),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Contract deployment failed: ${error}`);
    }

    return response.json();
  }

  // Read contract data
  async readContract(contractAddress: string, functionName: string, args: any[] = []) {
    const endpoint = `/contract/${EngineConfig.chainId}/${contractAddress}/read`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        functionName,
        args,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Contract read failed: ${error}`);
    }

    return response.json();
  }

  // Write to contract
  async writeContract(contractAddress: string, functionName: string, args: any[] = []) {
    const endpoint = `/contract/${EngineConfig.chainId}/${contractAddress}/write`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        functionName,
        args,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Contract write failed: ${error}`);
    }

    return response.json();
  }

  // Get transaction status
  async getTransactionStatus(transactionHash: string) {
    const endpoint = `/transaction/${EngineConfig.chainId}/${transactionHash}`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get transaction status: ${error}`);
    }

    return response.json();
  }

  // Create backend wallet
  async createBackendWallet(label?: string) {
    const endpoint = `/backend-wallet/create`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ label }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create backend wallet: ${error}`);
    }

    return response.json();
  }

  // Get wallet balance
  async getWalletBalance(walletAddress?: string) {
    const address = walletAddress || EngineConfig.backendWalletAddress;
    const endpoint = `/backend-wallet/${EngineConfig.chainId}/${address}/balance`;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get wallet balance: ${error}`);
    }

    return response.json();
  }
}

// Singleton instance
export const engine = new ThirdwebEngine();

// Helper functions for common operations

// Process shopping cart as batch transaction
export async function processShoppingCartBatch(cartItems: any[]) {
  const transactions: Transaction[] = cartItems.map(item => ({
    toAddress: item.contractAddress || "0x0000000000000000000000000000000000000000",
    value: item.amount || "0",
    data: encodeInvestmentData(item),
  }));

  return engine.sendBatchTransactionAtomic(transactions);
}

// Encode investment data for smart contract
function encodeInvestmentData(item: any): string {
  // This would encode the function call data for the investment
  // In a real implementation, this would use ethers.js or viem to encode
  return "0x"; // Placeholder
}

// Deploy investment tracking contract
export async function deployInvestmentContract(name: string, symbol: string) {
  return engine.deployContract("token-drop", {
    name,
    symbol,
    primary_sale_recipient: EngineConfig.backendWalletAddress,
  });
}

// Get investor portfolio from smart contract
export async function getOnChainPortfolio(investorAddress: string, contractAddress: string) {
  return engine.readContract(contractAddress, "getInvestorPortfolio", [investorAddress]);
}

// Record investment on-chain
export async function recordOnChainInvestment(
  contractAddress: string,
  investorAddress: string,
  targetId: string,
  amount: string
) {
  return engine.writeContract(contractAddress, "recordInvestment", [
    investorAddress,
    targetId,
    amount,
  ]);
}

export default engine;