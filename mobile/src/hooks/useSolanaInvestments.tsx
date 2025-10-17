import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveAccount } from '@/lib/solanaWallet';
import { useToast } from '@/hooks/use-toast';

export interface SolanaInvestment {
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockInvestments = (address: string): SolanaInvestment[] => {
  const prefix = address.slice(0, 4);
  const now = Date.now();

  return [
    {
      id: `solana-${prefix}-dao`,
      target_type: 'dao',
      target_id: 'solana-dao-collective',
      target_name: 'Solana Commons Research Collective',
      amount: '1250',
      date: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
      transaction_hash: `sig-${prefix}-${now.toString(16)}`,
      block_number: 185_234,
      token_id: 'SOL-DAO-1',
    },
    {
      id: `solana-${prefix}-grant`,
      target_type: 'grant',
      target_id: 'solana-grant-fund',
      target_name: 'Proof of Learn Research Grant',
      amount: '450',
      date: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(),
      transaction_hash: `sig-${prefix}-${(now - 2_000).toString(16)}`,
      block_number: 183_902,
      token_id: 'SOL-GRANT-2',
    },
    {
      id: `solana-${prefix}-scholarship`,
      target_type: 'scholarship',
      target_id: 'solana-scholarship',
      target_name: 'Campus Builders Scholarship',
      amount: '300',
      date: new Date(now - 1000 * 60 * 60 * 24 * 28).toISOString(),
      transaction_hash: `sig-${prefix}-${(now - 4_000).toString(16)}`,
      block_number: 179_110,
      token_id: 'SOL-SCHOLAR-4',
    },
  ];
};

export function useSolanaInvestments() {
  const account = useActiveAccount();
  const { toast } = useToast();

  const [investments, setInvestments] = useState<SolanaInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    if (!account?.address) {
      setInvestments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await delay(420);
      setInvestments(createMockInvestments(account.address));
    } catch (err) {
      console.error('Failed to fetch Solana investments:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to fetch Solana investments';
      setError(message);
      toast({
        title: 'Solana read error',
        description: 'Unable to fetch on-chain investments. Showing cached data only.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, toast]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const refresh = useCallback(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const totalInvested = useMemo(
    () => investments.reduce((sum, investment) => sum + Number(investment.amount), 0),
    [investments],
  );

  return {
    investments,
    isLoading,
    error,
    refresh,
    totalInvested,
    investmentCount: investments.length,
    isConnected: !!account?.address,
    isDemo: true,
  };
}
