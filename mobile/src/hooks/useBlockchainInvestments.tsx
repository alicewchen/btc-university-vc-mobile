import { useActiveAccount } from 'thirdweb/react';
import { getContract, getContractEvents } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { client } from '@/lib/thirdweb';
import InvestmentTrackerABI from '@/contracts/InvestmentTracker.abi.json';

const INVESTMENT_TRACKER_ADDRESS =
  process.env.EXPO_PUBLIC_INVESTMENT_TRACKER_ADDRESS ??
  '0x1234567890123456789012345678901234567890';

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
  const account = useActiveAccount();
  const { toast } = useToast();

  const [investments, setInvestments] = useState<BlockchainInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContractInstance = useCallback(() => {
    if (
      INVESTMENT_TRACKER_ADDRESS === '0x1234567890123456789012345678901234567890'
    ) {
      return null;
    }

    return getContract({
      client,
      chain: baseSepolia,
      address: INVESTMENT_TRACKER_ADDRESS,
      abi: InvestmentTrackerABI as any,
    });
  }, []);

  const fetchInvestments = useCallback(async () => {
    if (!account?.address) {
      setInvestments([]);
      return;
    }

    const contract = getContractInstance();
    if (!contract) {
      setInvestments([
        {
          id: 'blockchain-demo-1',
          target_type: 'dao',
          target_id: 'demo-dao-1',
          target_name: 'Demo Blockchain DAO',
          amount: '1000',
          date: new Date().toISOString(),
          transaction_hash: '0xdemo123',
          block_number: 12345,
          token_id: '1',
        },
      ]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const events = await getContractEvents({
        contract,
        fromBlock: 0n,
        toBlock: 'latest',
      });

      const investmentEvents = events.filter(
        (event: any) =>
          event.eventName === 'InvestmentMade' &&
          event.args?.investor?.toLowerCase() === account.address.toLowerCase(),
      );

      const formatted: BlockchainInvestment[] = investmentEvents.map((event: any) => {
        const { tokenId, targetId, amount } = event.args;
        return {
          id: `blockchain-${event.transactionHash}-${tokenId}`,
          target_type: 'dao',
          target_id: targetId,
          target_name: `Investment ${tokenId}`,
          amount: (Number(amount) / 1e18).toString(),
          date: new Date(
            Number(event.blockTimestamp || Date.now() / 1000) * 1000,
          ).toISOString(),
          transaction_hash: event.transactionHash,
          block_number: Number(event.blockNumber),
          token_id: tokenId.toString(),
        };
      });

      setInvestments(formatted);
    } catch (err) {
      console.error('Failed to fetch blockchain investments:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch blockchain investments',
      );
      if (
        INVESTMENT_TRACKER_ADDRESS !== '0x1234567890123456789012345678901234567890'
      ) {
        toast({
          title: 'Blockchain read error',
          description:
            'Unable to read investments from blockchain. Showing database investments only.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, getContractInstance, toast]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const refresh = useCallback(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const totalInvested = investments.reduce(
    (sum, investment) => sum + Number(investment.amount),
    0,
  );

  return {
    investments,
    isLoading,
    error,
    refresh,
    totalInvested,
    investmentCount: investments.length,
    isConnected: !!account?.address,
    isDemo:
      INVESTMENT_TRACKER_ADDRESS === '0x1234567890123456789012345678901234567890',
  };
}
