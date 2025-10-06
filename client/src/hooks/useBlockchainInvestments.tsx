// Hook for reading investment data from blockchain events
import { useState, useEffect, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getContract, getContractEvents } from "thirdweb";
import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/thirdweb-native";
import { baseSepolia } from "thirdweb/chains";
import InvestmentTrackerABI from "../../../contracts/InvestmentTracker.abi.json";

// Get contract address from environment or use a default testnet address  
const INVESTMENT_TRACKER_ADDRESS = import.meta.env.VITE_INVESTMENT_TRACKER_ADDRESS || "0x1234567890123456789012345678901234567890";

export interface BlockchainInvestment {
  id: string;
  target_type: string;
  target_id: string;
  target_name: string;
  amount: string;
  date: string;
  transaction_hash: string;
  block_number: number;
  token_id: string;
}

export function useBlockchainInvestments() {
  const [investments, setInvestments] = useState<BlockchainInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();
  const { toast } = useToast();

  // Get the contract instance
  const getContractInstance = useCallback(() => {
    if (INVESTMENT_TRACKER_ADDRESS === "0x1234567890123456789012345678901234567890") {
      return null; // Demo mode, no real contract
    }

    return getContract({
      client,
      chain: baseSepolia,
      address: INVESTMENT_TRACKER_ADDRESS,
      abi: InvestmentTrackerABI as any
    });
  }, []);

  // Fetch investment events for the current user
  const fetchInvestments = useCallback(async () => {
    if (!account?.address) {
      setInvestments([]);
      return;
    }

    const contract = getContractInstance();
    if (!contract) {
      // Demo mode: return mock data if wallet is connected
      if (account) {
        setInvestments([
          {
            id: "blockchain-demo-1",
            target_type: "dao",
            target_id: "demo-dao-1",
            target_name: "Demo Blockchain DAO",
            amount: "1000",
            date: new Date().toISOString(),
            transaction_hash: "0xdemo123...",
            block_number: 12345,
            token_id: "1"
          }
        ]);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get all InvestmentMade events for this user
      // Note: Using simplified approach for demo - in production would use proper event filtering
      const events = await getContractEvents({
        contract,
        fromBlock: BigInt(0), // Start from beginning 
        toBlock: "latest"
      });

      // Filter events for InvestmentMade and current user
      const investmentEvents = events.filter(event => 
        event.eventName === "InvestmentMade" && 
        event.args?.investor?.toLowerCase() === account.address.toLowerCase()
      );

      // Transform events to our investment format
      const blockchainInvestments: BlockchainInvestment[] = investmentEvents.map((event: any) => {
        const { investor, tokenId, targetId, amount } = event.args;
        
        return {
          id: `blockchain-${event.transactionHash}-${tokenId}`,
          target_type: "dao", // Could be extracted from metadata in future
          target_id: targetId,
          target_name: `Investment ${tokenId}`, // Could be enriched from metadata
          amount: (Number(amount) / 1e18).toString(), // Convert from wei
          date: new Date(Number(event.blockTimestamp || Date.now() / 1000) * 1000).toISOString(),
          transaction_hash: event.transactionHash,
          block_number: Number(event.blockNumber),
          token_id: tokenId.toString()
        };
      });

      setInvestments(blockchainInvestments);

    } catch (err: any) {
      console.error("Failed to fetch blockchain investments:", err);
      setError(err.message || "Failed to fetch blockchain investments");
      
      // Don't show toast error for demo mode or missing contract
      if (INVESTMENT_TRACKER_ADDRESS !== "0x1234567890123456789012345678901234567890") {
        toast({
          title: "Blockchain read error",
          description: "Unable to read investments from blockchain. Showing database investments only.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, getContractInstance, toast]);

  // Get investment details for a specific token ID
  const getInvestmentDetails = useCallback(async (tokenId: string) => {
    const contract = getContractInstance();
    if (!contract) return null;

    try {
      // This would call the getInvestmentDetails function on the contract
      // const details = await readContract({
      //   contract,
      //   method: "getInvestmentDetails",
      //   params: [BigInt(tokenId)]
      // });
      // return details;
      
      // For now, return null since we're focusing on events
      return null;
    } catch (err) {
      console.error("Failed to get investment details:", err);
      return null;
    }
  }, [getContractInstance]);

  // Refresh investments data
  const refresh = useCallback(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  // Auto-fetch when account changes
  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  // Calculate total invested amount
  const totalInvested = investments.reduce((sum, investment) => {
    return sum + parseFloat(investment.amount);
  }, 0);

  // Calculate investment count
  const investmentCount = investments.length;

  return {
    investments,
    isLoading,
    error,
    refresh,
    getInvestmentDetails,
    totalInvested,
    investmentCount,
    isConnected: !!account?.address,
    isDemo: INVESTMENT_TRACKER_ADDRESS === "0x1234567890123456789012345678901234567890"
  };
}