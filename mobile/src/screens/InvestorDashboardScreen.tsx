import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import {
  Card,
  Text,
  Button,
  Chip,
  List,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { useBlockchainInvestments } from '@/hooks/useBlockchainInvestments';
import { ConnectButton, bitcoinUniversityTheme, client, wallets } from '@/lib/thirdweb';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  Heart,
  TrendingUp,
} from 'lucide-react-native';

interface InvestorProfile {
  walletAddress: string;
  pseudonym?: string;
  profileCompleted: boolean;
  showOnLeaderboard: boolean;
  totalInvested: string;
  investmentCount: number;
  joinedAt: string;
}

interface Investment {
  id: string;
  targetId: string;
  targetName: string;
  targetType: 'dao' | 'scholarship' | 'grant';
  amount: string;
  currency?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
  returns?: number;
  performance?: number;
  source?: 'database' | 'blockchain';
  transactionHash?: string;
  tokenId?: string;
}

const formatAmount = (amount: string | number, currency: string = 'USD') => {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = currency === 'ETH' ? 'Ξ' : '$';

  if (numeric >= 1_000_000) {
    return `${symbol}${(numeric / 1_000_000).toFixed(1)}M`;
  }
  if (numeric >= 1000) {
    return `${symbol}${(numeric / 1000).toFixed(1)}K`;
  }
  return `${symbol}${numeric.toLocaleString()}`;
};

export default function InvestorDashboardScreen() {
  const account = useActiveAccount();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    investments: blockchainInvestments,
    isLoading: blockchainLoading,
    refresh: refreshBlockchain,
    isDemo,
  } = useBlockchainInvestments();

  const {
    data: profile,
    isLoading: profileLoading,
  } = useQuery<InvestorProfile>({
    queryKey: ['/api/investors', account?.address],
    enabled: !!account?.address,
    queryFn: () => apiRequest('GET', `/api/investors/${account?.address}`),
  });

  const {
    data: databaseInvestments = [],
    isLoading: databaseLoading,
  } = useQuery<Investment[]>({
    queryKey: ['/api/investments', account?.address],
    enabled: !!account?.address,
    queryFn: () => apiRequest('GET', `/api/investments/${account?.address}`),
  });

  const investments = useMemo(() => {
    const map = new Map<string, Investment>();

    databaseInvestments.forEach((investment) => {
      map.set(`db-${investment.id}`, {
        ...investment,
        source: 'database',
        currency: investment.currency ?? 'USD',
      });
    });

    blockchainInvestments.forEach((chainInvestment) => {
      const key = `chain-${chainInvestment.transaction_hash}-${chainInvestment.token_id}`;
      const duplicate = Array.from(map.values()).find(
        (existing) =>
          existing.targetId === chainInvestment.target_id &&
          existing.currency === 'ETH' &&
          Math.abs(parseFloat(existing.amount) - parseFloat(chainInvestment.amount)) < 0.001,
      );

      if (!duplicate) {
        map.set(key, {
          id: chainInvestment.id,
          targetId: chainInvestment.target_id,
          targetName: chainInvestment.target_name,
          targetType: chainInvestment.target_type as Investment['targetType'],
          amount: chainInvestment.amount,
          currency: 'ETH',
          createdAt: chainInvestment.date,
          status: 'confirmed',
          source: 'blockchain',
          transactionHash: chainInvestment.transaction_hash,
          tokenId: chainInvestment.token_id,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [databaseInvestments, blockchainInvestments]);

  const isLoading = profileLoading || databaseLoading || blockchainLoading;

  const portfolioStats = useMemo(() => {
    const usdInvestments = investments.filter((inv) => inv.currency === 'USD');
    const ethInvestments = investments.filter((inv) => inv.currency === 'ETH');

    const totalUSD = usdInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalETH = ethInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

    const usdReturns = usdInvestments.reduce(
      (sum, inv) => sum + (inv.returns ?? 0),
      0,
    );
    const ethReturns = ethInvestments.reduce(
      (sum, inv) => sum + (inv.returns ?? 0),
      0,
    );

    const averagePerformance =
      investments.length > 0
        ? investments.reduce((sum, inv) => sum + (inv.performance ?? 0), 0) /
          investments.length
        : 0;

    const topPerformer =
      investments
        .filter((inv) => inv.performance)
        .sort((a, b) => (b.performance ?? 0) - (a.performance ?? 0))[0] ?? null;

    return {
      totalUSD,
      totalETH,
      usdReturns,
      ethReturns,
      averagePerformance,
      topPerformer,
    };
  }, [investments]);

  const onRefresh = async () => {
    if (!account?.address) {
      return;
    }
    try {
      setIsRefreshing(true);
      await Promise.all([
        refreshBlockchain(),
      ]);
    } catch (error) {
      console.error('Refresh failed', error);
      toast({
        title: 'Refresh failed',
        description: 'Unable to refresh dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!account?.address) {
    return (
      <View style={styles.centered}>
        <Card style={styles.centerCard}>
          <Card.Content style={styles.centerCardContent}>
            <Heart size={48} color="#F97316" />
            <Text variant="titleLarge" style={styles.centerTitle}>
              Connect Your Wallet
            </Text>
            <Text variant="bodyMedium" style={styles.centerMessage}>
              Connect your wallet to view personalized portfolio analytics and investment history.
            </Text>
            <ConnectButton
              client={client}
              wallets={wallets}
              theme={bitcoinUniversityTheme}
            />
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#F97316" />
      }
    >
      <Text variant="headlineSmall" style={styles.heading}>
        Investor Dashboard
      </Text>

      {isLoading ? (
        <Card style={styles.sectionCard}>
          <Card.Content style={styles.loadingContent}>
            <ActivityIndicator animating size="large" color="#F97316" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Loading your portfolio...
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <>
          <Card style={styles.heroCard}>
            <Card.Content style={styles.heroContent}>
              <Text variant="labelMedium" style={styles.sectionLabel}>
                Total Portfolio Value
              </Text>
              <Text variant="displayMedium" style={styles.heroAmount}>
                {formatAmount(portfolioStats.totalUSD, 'USD')}
              </Text>
              <Text variant="bodyMedium" style={styles.heroSubtext}>
                {formatAmount(portfolioStats.totalETH, 'ETH')} in on-chain assets
              </Text>
              <Chip icon={() => <TrendingUp size={16} color="#F97316" />} style={styles.heroChip}>
                {investments.length} investments •{' '}
                {portfolioStats.averagePerformance.toFixed(1)}% avg performance
              </Chip>
            </Card.Content>
          </Card>

          <View style={styles.grid}>
            <Card style={styles.metricCard}>
              <Card.Content>
                <View style={styles.metricHeader}>
                  <DollarSign size={20} color="#F97316" />
                  <Text variant="labelMedium">USD Returns</Text>
                </View>
                <Text variant="titleLarge" style={styles.metricValue}>
                  {formatAmount(portfolioStats.usdReturns, 'USD')}
                </Text>
                <Text variant="bodySmall" style={styles.metricHint}>
                  From {investments.filter((inv) => inv.currency === 'USD').length} positions
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.metricCard}>
              <Card.Content>
                <View style={styles.metricHeader}>
                  <ArrowUpRight size={20} color="#22C55E" />
                  <Text variant="labelMedium">ETH Returns</Text>
                </View>
                <Text variant="titleLarge" style={styles.metricValue}>
                  {formatAmount(portfolioStats.ethReturns, 'ETH')}
                </Text>
                <Text variant="bodySmall" style={styles.metricHint}>
                  Blockchain-confirmed rewards
                </Text>
              </Card.Content>
            </Card>
          </View>

          {portfolioStats.topPerformer ? (
            <Card style={styles.sectionCard}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <ArrowUpRight size={20} color="#22C55E" />
                  <Text variant="titleMedium">Top Performing Investment</Text>
                </View>
                <Text variant="bodyLarge" style={styles.topPerformerTitle}>
                  {portfolioStats.topPerformer.targetName}
                </Text>
                <Text variant="bodyMedium">
                  Return: {(portfolioStats.topPerformer.performance ?? 0).toFixed(1)}%
                </Text>
              </Card.Content>
            </Card>
          ) : null}

          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Briefcase size={20} color="#6366F1" />
                <Text variant="titleMedium">Recent Activity</Text>
              </View>
              {investments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Activity size={32} color="#9CA3AF" />
                  <Text variant="bodyMedium" style={styles.emptyMessage}>
                    No investments yet. Explore opportunities on the Discover tab.
                  </Text>
                </View>
              ) : (
                investments.slice(0, 10).map((investment) => (
                  <View key={`${investment.source}-${investment.id}`}>
                    <List.Item
                      title={investment.targetName}
                      description={`${investment.targetType.toUpperCase()} · ${new Date(
                        investment.createdAt,
                      ).toLocaleDateString()}`}
                      left={() => (
                        <List.Icon
                          icon={
                            investment.source === 'blockchain'
                              ? 'cube'
                              : 'database'
                          }
                        />
                      )}
                      right={() => (
                        <Text variant="bodyMedium">
                          {formatAmount(investment.amount, investment.currency)}
                        </Text>
                      )}
                    />
                    <Divider />
                  </View>
                ))
              )}
            </Card.Content>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <ArrowDownRight size={20} color="#F97316" />
                <Text variant="titleMedium">Data Sources</Text>
              </View>
              <View style={styles.dataSourceRow}>
                <Chip icon="database">
                  {databaseInvestments.length} database records
                </Chip>
                <Chip icon="cube-outline">
                  {blockchainInvestments.length} on-chain records
                </Chip>
                {isDemo ? <Chip icon="beaker">Demo mode</Chip> : null}
              </View>
              <Button
                mode="outlined"
                onPress={onRefresh}
                loading={isRefreshing}
                style={styles.refreshButton}
              >
                Refresh Data
              </Button>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
  },
  heading: {
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
  },
  heroContent: {
    gap: 6,
  },
  sectionLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  heroAmount: {
    fontWeight: '700',
  },
  heroSubtext: {
    color: '#6B7280',
  },
  heroChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEDD5',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    marginTop: 8,
    fontWeight: '600',
  },
  metricHint: {
    color: '#6B7280',
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  topPerformerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  dataSourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  refreshButton: {
    marginTop: 12,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerCard: {
    borderRadius: 20,
  },
  centerCardContent: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  centerTitle: {
    fontWeight: '600',
  },
  centerMessage: {
    textAlign: 'center',
    color: '#6B7280',
  },
});
