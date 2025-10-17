import { useCallback, useState } from 'react';
import { useActiveAccount } from '@/lib/solanaWallet';
import { useToast } from '@/hooks/use-toast';

export interface BatchItem {
  targetType: string;
  targetId: string;
  targetName: string;
  amount: string;
  metadata?: string;
}

const generateMockSignature = () =>
  `sig-${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16)}`;

export function useSolanaBatch() {
  const account = useActiveAccount();
  const { toast } = useToast();

  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  const processBatch = useCallback(
    async (items: BatchItem[]) => {
      if (!account) {
        toast({
          title: 'Wallet not connected',
          description: 'Connect a Solana wallet to continue.',
          variant: 'destructive',
        });
        return null;
      }

      if (items.length === 0) {
        toast({
          title: 'Cart is empty',
          description: 'Add investments before attempting a checkout.',
          variant: 'destructive',
        });
        return null;
      }

      setIsBatchProcessing(true);
      toast({
        title: '🚀 Preparing Solana transaction',
        description: `Processing ${items.length} opportunities for ${account.address.slice(0, 4)}...`,
      });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1600));

        const signature = generateMockSignature();
        setTransactionSignature(signature);

        toast({
          title: '✅ Demo transaction sent!',
          description: `Mock signature: ${signature.slice(0, 12)}...`,
        });

        return signature;
      } catch (error) {
        console.error('Mock Solana batch failed:', error);
        toast({
          title: 'Transaction failed',
          description: 'Unable to process the mock batch. Please try again.',
          variant: 'destructive',
        });
        return null;
      } finally {
        setIsBatchProcessing(false);
      }
    },
    [account, toast],
  );

  const prepareGaslessBatch = useCallback(
    async (items: BatchItem[]) => {
      if (!account) {
        return null;
      }

      return {
        items,
        estimatedFeeLamports: '0',
        sponsor: 'Bitcoin University Demo',
      };
    },
    [account],
  );

  const getTransactionStatus = useCallback(async (signature: string) => {
    if (signature.startsWith('sig-')) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        status: 'confirmed',
        slot: Math.floor(Math.random() * 200_000),
        confirmations: 8,
      };
    }
    return null;
  }, []);

  return {
    processBatch,
    prepareGaslessBatch,
    getTransactionStatus,
    isBatchProcessing,
    transactionSignature,
  };
}
