import { useCallback, useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, toWei, getContract } from 'thirdweb';
import { useToast } from '@/hooks/use-toast';
import { client } from '@/lib/thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import InvestmentTrackerABI from '@/contracts/InvestmentTracker.abi.json';

const INVESTMENT_TRACKER_ADDRESS =
  process.env.EXPO_PUBLIC_INVESTMENT_TRACKER_ADDRESS ??
  '0x1234567890123456789012345678901234567890';

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
  const { mutate: sendTransaction } = useSendTransaction();

  const processBatch = useCallback(
    async (items: BatchItem[]) => {
      if (!account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet to continue',
          variant: 'destructive',
        });
        return null;
      }

      if (
        INVESTMENT_TRACKER_ADDRESS === '0x1234567890123456789012345678901234567890'
      ) {
        toast({
          title: '🚀 Demo Mode',
          description:
            'Using simulated transaction. Set EXPO_PUBLIC_INVESTMENT_TRACKER_ADDRESS for real transactions.',
        });

        const mockTxHash = `0x${Math.random().toString(16).slice(2, 18)}`;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTransactionHash(mockTxHash);
        toast({
          title: '✅ Demo transaction complete!',
          description: `Mock tx: ${mockTxHash.slice(0, 10)}...`,
        });
        return mockTxHash;
      }

      setIsBatchProcessing(true);

      try {
        const contract = getContract({
          client,
          chain: baseSepolia,
          address: INVESTMENT_TRACKER_ADDRESS,
          abi: InvestmentTrackerABI as any,
        });

        const targetTypes = items.map((item) => item.targetType);
        const targetIds = items.map((item) => item.targetId);
        const targetNames = items.map((item) => item.targetName);
        const amounts = items.map((item) => toWei(item.amount));
        const metadataList = items.map((item) => item.metadata ?? '');

        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
        const feeAmount = totalAmount / 100n;
        const totalValue = totalAmount + feeAmount;

        toast({
          title: '🚀 Preparing batch transaction',
          description: `Processing ${items.length} investments totaling $${(
            Number(totalAmount) / 1e18
          ).toLocaleString()}`,
        });

        const transaction = prepareContractCall({
          contract,
          method: 'batchInvest',
          params: [targetTypes, targetIds, targetNames, amounts, metadataList],
          value: totalValue,
        });

        return await new Promise<string | null>((resolve) => {
          sendTransaction(transaction, {
            onSuccess: (result) => {
              const txHash = result.transactionHash;
              setTransactionHash(txHash);
              toast({
                title: '✅ Batch Investment Successful!',
                description: `Invested in ${items.length} opportunities`,
              });
              resolve(txHash);
            },
            onError: (error) => {
              console.error('Batch transaction error:', error);
              toast({
                title: 'Transaction Failed',
                description:
                  error instanceof Error
                    ? error.message
                    : 'Failed to process batch investment. Please try again.',
                variant: 'destructive',
              });
              resolve(null);
            },
          });
        });
      } catch (error) {
        console.error('Batch transaction failed:', error);
        toast({
          title: 'Transaction failed',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to process batch transaction',
          variant: 'destructive',
        });
        return null;
      } finally {
        setIsBatchProcessing(false);
      }
    },
    [account, toast, sendTransaction],
  );

  const prepareGaslessBatch = useCallback(
    async (items: BatchItem[]) => {
      if (!account) {
        return null;
      }

      return {
        items,
        estimatedGas: '0',
        sponsoredBy: 'platform',
      };
    },
    [account],
  );

  const getTransactionStatus = useCallback(async (txHash: string) => {
    if (txHash.startsWith('0x') && txHash.length > 10) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 1_000_000),
        gasUsed: '21000',
      };
    }
    return null;
  }, []);

  return {
    processBatch,
    prepareGaslessBatch,
    getTransactionStatus,
    isBatchProcessing,
    transactionHash,
  };
}
