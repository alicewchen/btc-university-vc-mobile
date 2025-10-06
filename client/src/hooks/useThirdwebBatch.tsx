// Hook for batch transactions with thirdweb
import { useState, useCallback } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall, toWei, getContract } from "thirdweb";
import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/thirdweb-native";
import { baseSepolia } from "thirdweb/chains";
import InvestmentTrackerABI from "../../../contracts/InvestmentTracker.abi.json";

// Get contract address from environment or use a default testnet address  
const INVESTMENT_TRACKER_ADDRESS = import.meta.env.VITE_INVESTMENT_TRACKER_ADDRESS || "0x1234567890123456789012345678901234567890";

export interface BatchItem {
  targetType: string;
  targetId: string;
  targetName: string;
  amount: string;
  metadata?: string;
}

export function useThirdwebBatch() {
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const account = useActiveAccount();
  const { toast } = useToast();
  const { mutate: sendTransaction, data: transactionResult } = useSendTransaction();

  // Process shopping cart items as a single batch transaction
  const processBatch = useCallback(async (items: BatchItem[]) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return null;
    }

    if (INVESTMENT_TRACKER_ADDRESS === "0x1234567890123456789012345678901234567890") {
      // If using default address, simulate transaction for demo
      toast({
        title: "🚀 Demo Mode",
        description: "Using simulated transaction. Set VITE_INVESTMENT_TRACKER_ADDRESS for real transactions.",
      });
      
      // Simulate transaction
      const mockTxHash = "0x" + Math.random().toString(36).substring(2, 15);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTransactionHash(mockTxHash);
      
      toast({
        title: "✅ Demo transaction complete!",
        description: `Mock tx: ${mockTxHash.substring(0, 10)}...`,
      });
      
      return mockTxHash;
    }

    setIsBatchProcessing(true);
    
    try {
      // Get the contract instance
      const contract = getContract({
        client,
        chain: baseSepolia,
        address: INVESTMENT_TRACKER_ADDRESS,
        abi: InvestmentTrackerABI as any
      });

      // Prepare arrays for batch investment
      const targetTypes = items.map(item => item.targetType);
      const targetIds = items.map(item => item.targetId);
      const targetNames = items.map(item => item.targetName);
      const amounts = items.map(item => toWei(item.amount));
      const metadataList = items.map(item => item.metadata || "");

      // Calculate total value to send (with 1% fee)
      const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
      const feeAmount = totalAmount / 100n; // 1% fee
      const totalValue = totalAmount + feeAmount;

      toast({
        title: "🚀 Preparing batch transaction",
        description: `Processing ${items.length} investments totaling $${(Number(totalAmount) / 1e18).toLocaleString()}`
      });

      // Prepare the batch investment contract call
      const transaction = prepareContractCall({
        contract,
        method: "batchInvest",
        params: [targetTypes, targetIds, targetNames, amounts, metadataList],
        value: totalValue
      });

      // Send the transaction
      return new Promise<string | null>((resolve) => {
        sendTransaction(transaction, {
          onSuccess: (result) => {
            const txHash = result.transactionHash;
            setTransactionHash(txHash);
            
            toast({
              title: "✅ Batch Investment Successful!",
              description: `Successfully invested in ${items.length} opportunities`,
            });
            
            resolve(txHash);
          },
          onError: (error) => {
            console.error("Batch transaction error:", error);
            toast({
              title: "Transaction Failed",
              description: error.message || "Failed to process batch investment. Please try again.",
              variant: "destructive"
            });
            resolve(null);
          }
        });
      });
      
    } catch (error: any) {
      console.error("Batch transaction failed:", error);
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to process batch transaction",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsBatchProcessing(false);
    }
  }, [account, toast, sendTransaction]);

  // Prepare gasless batch transaction
  const prepareGaslessBatch = useCallback(async (items: BatchItem[]) => {
    if (!account) {
      return null;
    }

    try {
      // In production with thirdweb Engine, this would prepare a gasless transaction
      const prepared = {
        items,
        estimatedGas: "0",
        sponsoredBy: "platform",
      };

      return prepared;
    } catch (error) {
      console.error("Failed to prepare gasless batch:", error);
      return null;
    }
  }, [account]);

  // Monitor transaction status  
  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      // For real transactions, could use thirdweb SDK to check status
      // For demo, return mock status
      if (txHash.startsWith("0x") && txHash.length > 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          status: "confirmed",
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: "21000",
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to get transaction status:", error);
      return null;
    }
  }, []);

  return {
    processBatch,
    prepareGaslessBatch,
    getTransactionStatus,
    isBatchProcessing,
    transactionHash,
  };
}