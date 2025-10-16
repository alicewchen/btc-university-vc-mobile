import { useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, PanResponder, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Badge,
  Button,
  Card,
  Dialog,
  Divider,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, fetchJson } from '@/lib/api';
import { signAuthMessage } from '@/lib/auth';
import { ConnectButton, client, wallets, bitcoinUniversityTheme } from '@/lib/thirdweb';
import {
  ArrowUp,
  DollarSign,
  Heart,
  ShoppingCart as ShoppingCartIcon,
  Target,
  Users,
  Zap,
  Clock,
  TrendingUp,
  X,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FUNDING_TIERS = {
  individual_supporter: {
    label: 'Individual Supporter',
    amounts: [25, 50, 100, 250],
    description: 'Perfect for individual contributions',
  },
  professional_investor: {
    label: 'Professional Investor',
    amounts: [100, 500, 1000, 2500],
    description: 'For professional individuals and small offices',
  },
  microvc: {
    label: 'MicroVC',
    amounts: [25000, 100000, 250000, 500000],
    description: 'Micro venture capital and angel syndicates',
  },
  institutional: {
    label: 'Institutional',
    amounts: [1000000, 2500000, 5000000, 10000000],
    description: 'Universities, foundations, and major VCs',
  },
} as const;

type FundingTierKey = keyof typeof FUNDING_TIERS;

interface InvestmentOpportunity {
  id: string;
  type: 'dao' | 'grant' | 'scholarship';
  title: string;
  description: string;
  fundingGoal: number;
  fundingRaised: number;
  category: string;
  image?: string;
  deadline?: string;
  timeline?: string;
  impact?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  memberCount?: number;
  location?: string;
}

interface InvestorPreferences {
  preferredAmounts: string[];
  defaultAmount: string;
  preferredCurrency: string;
  quickFundRange: FundingTierKey;
}

const ENABLE_INVESTMENT_MOCKS =
  process.env.EXPO_PUBLIC_ENABLE_INVESTMENT_MOCKS !== 'false';

const MOCK_INVESTOR_PREFERENCES: InvestorPreferences = {
  preferredAmounts: ['250', '500', '1000', '2500'],
  defaultAmount: '250',
  preferredCurrency: 'USD',
  quickFundRange: 'professional_investor',
};

const MOCK_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'mock-dao-1',
    type: 'dao',
    title: 'Solar Commons Research Collective',
    description:
      'Scaling community-owned solar grids to power rural universities across Latin America.',
    fundingGoal: 500000,
    fundingRaised: 175000,
    category: 'Clean Energy',
    impact:
      'Deploy 12 microgrid pilots delivering reliable power to 40,000 students while generating open data sets.',
    timeline: 'Phase 1 deployment complete; expansion ready for Q2 2025.',
    urgency: 'high',
    memberCount: 48,
    location: 'Latin America',
  },
  {
    id: 'mock-grant-1',
    type: 'grant',
    title: 'Bitcoin University AI Research Fellows',
    description:
      '12-month fellowship funding AI researchers tackling decentralized learning and privacy.',
    fundingGoal: 350000,
    fundingRaised: 82000,
    category: 'AI Research',
    impact:
      'Fund five fellows to produce open-source tooling for decentralized education and grant a public dataset.',
    deadline: 'Applications close March 30, 2025',
    urgency: 'medium',
    location: 'Global',
  },
  {
    id: 'mock-scholarship-1',
    type: 'scholarship',
    title: 'Women in Bitcoin Engineering Scholarships',
    description:
      'Scholarships for emerging women engineers building Bitcoin infrastructure and developer tooling.',
    fundingGoal: 150000,
    fundingRaised: 94000,
    category: 'Scholarship',
    impact:
      'Support 25 scholars with stipends, mentorship, and placements in partner Bitcoin labs.',
    timeline: 'Program kickoff July 2025; mentorship runs for 9 months.',
    urgency: 'urgent',
    location: 'North America & Europe',
  },
];

const resolveCurrencySymbol = (currency?: string) => {
  if (currency === 'ETH') return 'Ξ';
  if (currency === 'BTC') return '₿';
  return '$';
};

export default function SwipeInvestingScreen() {
  const theme = useTheme();
  const account = useActiveAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addItem } = useShoppingCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<InvestmentOpportunity | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>('');

  const pan = useRef(new Animated.ValueXY()).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const horizontalSwipeThreshold = SCREEN_WIDTH * 0.25;
  const verticalSwipeThreshold = SCREEN_WIDTH * 0.2;
  const velocityThreshold = 1.6;

  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(cardScale, {
          toValue: 0.97,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy, vx, vy } = gestureState;

        if (dx > horizontalSwipeThreshold || vx > velocityThreshold) {
          animateOffScreen({ x: SCREEN_WIDTH * 1.2, y: 0 }, () => {
            handleRightSwipe(currentOpportunity);
          });
          return;
        }

        if (dx < -horizontalSwipeThreshold || vx < -velocityThreshold) {
          animateOffScreen({ x: -SCREEN_WIDTH * 1.2, y: 0 }, () => {
            handleLeftSwipe();
          });
          return;
        }

        if (dy < -verticalSwipeThreshold || vy < -velocityThreshold) {
          animateOffScreen({ x: 0, y: -SCREEN_WIDTH }, () => {
            handleUpSwipe(currentOpportunity);
          });
          return;
        }

        resetCardPosition();
      },
      onPanResponderTerminate: () => {
        resetCardPosition();
      },
    }),
  ).current;

  const animateOffScreen = (toValue: { x: number; y: number }, onComplete: () => void) => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      pan.setValue({ x: 0, y: 0 });
      cardScale.setValue(1);
      onComplete();
    });
  };

  const {
    data: fetchedPreferences,
  } = useQuery({
    queryKey: ['/api/investor-preferences', account?.address],
    queryFn: () =>
      apiRequest<InvestorPreferences>(
        'GET',
        `/api/investor-preferences/${account?.address}`,
      ),
    enabled: !!account?.address,
    retry: false,
  });

  const preferences =
    fetchedPreferences ??
    (ENABLE_INVESTMENT_MOCKS ? MOCK_INVESTOR_PREFERENCES : undefined);

  const {
    data: fetchedOpportunities = [],
    isLoading: opportunitiesLoading,
    error: opportunitiesError,
  } = useQuery<InvestmentOpportunity[]>({
    queryKey: ['/api/swipe-opportunities'],
    queryFn: () => fetchJson<InvestmentOpportunity[]>('/api/swipe-opportunities'),
    enabled: true,
    retry: ENABLE_INVESTMENT_MOCKS ? 0 : 1,
  });

  const shouldUseMockOpportunities =
    !account?.address || ENABLE_INVESTMENT_MOCKS || !!opportunitiesError;

  const opportunities = useMemo<InvestmentOpportunity[]>(() => {
    if (shouldUseMockOpportunities) {
      return MOCK_OPPORTUNITIES;
    }
    return fetchedOpportunities;
  }, [shouldUseMockOpportunities, fetchedOpportunities]);

  const currentOpportunity = opportunities[currentIndex];
  const hasMore = currentIndex < opportunities.length - 1;

  const investMutation = useMutation({
    mutationFn: async ({
      opportunity,
      amount,
    }: {
      opportunity: InvestmentOpportunity;
      amount: string;
    }) => {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      const signedAuth = await signAuthMessage(account);
      return apiRequest('POST', '/api/investments', {
        targetType: opportunity.type,
        targetId: opportunity.id,
        amount,
        currency: preferences?.preferredCurrency ?? 'USD',
        ...signedAuth,
      });
    },
    onSuccess: (_, { opportunity, amount }) => {
      const currencySymbol = resolveCurrencySymbol(
        preferences?.preferredCurrency,
      );
      toast({
        title: '🚀 Instant Investment Successful!',
        description: `Invested ${currencySymbol}${amount} in ${opportunity.title}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/investors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
      nextCard();
    },
    onError: (error) => {
      console.error('Investment error:', error);
      toast({
        title: 'Investment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'There was an issue processing your investment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const nextCard = () => {
    setSelectedAmount('');
    setSelectedOpportunity(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLeftSwipe = () => {
    toast({
      title: '⏭️ Passed',
      description: 'Moving to next opportunity',
    });
    if (hasMore) {
      nextCard();
    } else {
      setCurrentIndex(opportunities.length);
    }
  };

  const handleRightSwipe = (opportunity?: InvestmentOpportunity | null) => {
    if (!opportunity) {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
      return;
    }
    setSelectedOpportunity(opportunity);
    setShowAmountModal(true);
  };

  const handleUpSwipe = (opportunity?: InvestmentOpportunity | null) => {
    if (!opportunity) {
      return;
    }
    if (!account?.address) {
      toast({
        title: 'Demo Mode',
        description: 'Connect your wallet to invest instantly.',
      });
      return;
    }
    const amount = preferences?.defaultAmount ?? '100';
    investMutation.mutate({ opportunity, amount });
  };

  const handleQuickAddToCart = (opportunity: InvestmentOpportunity, amount: number) => {
    const currency = preferences?.preferredCurrency ?? 'USD';
    const symbol = resolveCurrencySymbol(currency);

    addItem({
      targetType: opportunity.type,
      targetId: opportunity.id,
      targetName: opportunity.title,
      amount: amount.toString(),
      currency,
      description: opportunity.description,
    });

    toast({
      title: '🛒 Added to Cart!',
      description: `${symbol}${amount.toLocaleString()} investment in ${opportunity.title}`,
    });
    setShowAmountModal(false);
    nextCard();
  };

  const handleAddToCart = () => {
    if (!selectedOpportunity || !selectedAmount) {
      return;
    }
    const currency = preferences?.preferredCurrency ?? 'USD';
    const symbol = resolveCurrencySymbol(currency);

    addItem({
      targetType: selectedOpportunity.type,
      targetId: selectedOpportunity.id,
      targetName: selectedOpportunity.title,
      amount: selectedAmount,
      currency,
      description: selectedOpportunity.description,
    });

    toast({
      title: '🛒 Added to Cart',
      description: `${selectedOpportunity.title} added with ${symbol}${selectedAmount}`,
    });

    setShowAmountModal(false);
    nextCard();
  };

  const getFundingProgress = (raised: number, goal: number) =>
    Math.min(100, Math.round((raised / goal) * 100));

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dao':
        return <Users color={theme.colors.primary} size={18} />;
      case 'grant':
        return <Target color={theme.colors.primary} size={18} />;
      case 'scholarship':
        return <TrendingUp color={theme.colors.primary} size={18} />;
      default:
        return <DollarSign color={theme.colors.primary} size={18} />;
    }
  };

  if (opportunitiesLoading && !shouldUseMockOpportunities) {
    return (
      <LinearGradient
        colors={['#FFF7ED', '#F3F4F6']}
        style={styles.fullscreenCenter}
      >
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="titleLarge" style={styles.loadingTitle}>
              Loading Opportunities
            </Text>
            <Text variant="bodyMedium" style={styles.loadingSubtitle}>
              Finding the best investment opportunities for you...
            </Text>
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  if (opportunitiesError && !shouldUseMockOpportunities) {
    return (
      <LinearGradient
        colors={['#FFF7ED', '#F3F4F6']}
        style={styles.fullscreenCenter}
      >
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <X color={theme.colors.error} size={48} />
            <Text variant="titleLarge" style={styles.loadingTitle}>
              Unable to Load Opportunities
            </Text>
            <Text variant="bodyMedium" style={styles.loadingSubtitle}>
              There was an error loading investment opportunities. Please try again.
            </Text>
            <Button
              mode="contained"
              onPress={() => queryClient.invalidateQueries({ queryKey: ['/api/swipe-opportunities'] })}
              style={styles.retryButton}
            >
              Try Again
            </Button>
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  if (!account?.address && !shouldUseMockOpportunities) {
    return (
      <LinearGradient colors={['#FFF7ED', '#F3F4F6']} style={styles.fullscreenCenter}>
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <Zap color={theme.colors.primary} size={48} />
            <Text variant="titleLarge" style={styles.loadingTitle}>
              Connect Your Wallet
            </Text>
            <Text variant="bodyMedium" style={styles.loadingSubtitle}>
              Connect your wallet to start swiping through investment opportunities
            </Text>
            <ConnectButton
              client={client}
              wallets={wallets}
              theme={bitcoinUniversityTheme}
            />
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  if (!currentOpportunity) {
    return (
      <LinearGradient colors={['#FFF7ED', '#F3F4F6']} style={styles.fullscreenCenter}>
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <Heart color={theme.colors.primary} size={48} />
            <Text variant="titleLarge" style={styles.loadingTitle}>
              You&apos;re All Caught Up!
            </Text>
            <Text variant="bodyMedium" style={styles.loadingSubtitle}>
              No more investment opportunities right now. Check back later for new projects!
            </Text>
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  const cardRotation = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const cardOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.4, 1, 0.4],
  });

  const selectedTier =
    preferences?.quickFundRange && FUNDING_TIERS[preferences.quickFundRange]
      ? preferences.quickFundRange
      : 'individual_supporter';

  const tierAmounts = FUNDING_TIERS[selectedTier as FundingTierKey].amounts;

  return (
    <LinearGradient colors={['#FFF7ED', '#F3F4F6']} style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate: cardRotation },
                { scale: cardScale },
              ],
              opacity: cardOpacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Card style={styles.primaryCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Badge>{currentOpportunity.category}</Badge>
                <View style={styles.iconRow}>{getTypeIcon(currentOpportunity.type)}</View>
              </View>

              <Text variant='titleLarge' style={styles.cardTitle}>
                {currentOpportunity.title}
              </Text>

              <Text variant='bodyMedium' style={styles.cardDescription}>
                {currentOpportunity.description}
              </Text>

              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text variant='labelMedium'>Funding Goal</Text>
                  <Text variant='titleMedium'>
                    ${currentOpportunity.fundingGoal.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant='labelMedium'>Raised</Text>
                  <Text variant='titleMedium'>
                    ${currentOpportunity.fundingRaised.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${getFundingProgress(currentOpportunity.fundingRaised, currentOpportunity.fundingGoal)}%` },
                  ]}
                />
              </View>
              <Text variant='bodySmall' style={styles.progressLabel}>
                Progress: {getFundingProgress(currentOpportunity.fundingRaised, currentOpportunity.fundingGoal)}%
              </Text>

              {currentOpportunity.impact ? (
                <>
                  <Divider style={styles.divider} />
                  <Text variant='labelMedium'>Impact</Text>
                  <Text variant='bodySmall' style={styles.impactText}>
                    {currentOpportunity.impact}
                  </Text>
                </>
              ) : null}

              <View style={styles.metaRow}>
                {currentOpportunity.timeline ? (
                  <View style={styles.metaItem}>
                    <ArrowUp color={theme.colors.primary} size={16} />
                    <Text variant='bodySmall' style={styles.metaText}>
                      {currentOpportunity.timeline}
                    </Text>
                  </View>
                ) : null}
                {currentOpportunity.deadline ? (
                  <View style={styles.metaItem}>
                    <Clock color={theme.colors.error} size={16} />
                    <Text variant='bodySmall' style={styles.metaText}>
                      {currentOpportunity.deadline}
                    </Text>
                  </View>
                ) : null}
                {currentOpportunity.urgency ? (
                  <View style={styles.metaItem}>
                    <View
                      style={[
                        styles.urgencyDot,
                        { backgroundColor: getUrgencyColor(currentOpportunity.urgency) },
                      ]}
                    />
                    <Text variant='bodySmall' style={styles.metaText}>
                      {currentOpportunity.urgency.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.instructions}>
                <Text variant='labelMedium'>Swipe Gestures</Text>
                <Text variant='bodySmall' style={styles.instructionsText}>
                  Swipe right to add to cart, left to skip, and up to invest instantly.
                </Text>
              </View>

              <View style={styles.footer}>
                <Text variant='bodySmall' style={styles.pagination}>
                  {currentIndex + 1} of {opportunities.length}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* {hasMore ? (
          <View style={styles.nextCard}>
            <Card mode='outlined' style={styles.nextCardInner}>
              <Card.Content style={styles.nextCardContent}>
                <Heart color={theme.colors.primary} size={28} />
                <Text variant='bodyMedium' style={styles.nextCardText}>
                  Next opportunity waiting
                </Text>
              </Card.Content>
            </Card>
          </View>
        ) : null} */}
      </View>

      <Portal>
        <Dialog visible={showAmountModal} onDismiss={() => setShowAmountModal(false)}>
          <Dialog.Title>Quick Add to Cart</Dialog.Title>
          <Dialog.Content>
            <Text variant='bodyMedium' style={styles.modalSubtitle}>
              Tap an amount to add {selectedOpportunity?.title} to your cart
            </Text>
            <View style={styles.amountGrid}>
              {tierAmounts.map((amount) => (
                <Button
                  key={amount}
                  mode='outlined'
                  style={styles.amountButton}
                  onPress={() =>
                    selectedOpportunity && handleQuickAddToCart(selectedOpportunity, amount)
                  }
                  icon={({ size, color }) => <ShoppingCartIcon size={size} color={color} />}
                >
                  ${amount >= 1_000_000 ? `${(amount / 1_000_000).toFixed(1)}M` : amount >= 1000
                    ? `${(amount / 1000).toFixed(0)}K`
                    : amount.toLocaleString()}
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAmountModal(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 380,
  },
  primaryCard: {
    borderRadius: 24,
    elevation: 8,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#FFF3E7',
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardDescription: {
    color: '#4B5563',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    flex: 1,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#F97316',
  },
  progressLabel: {
    color: '#6B7280',
  },
  divider: {
    marginVertical: 8,
  },
  impactText: {
    color: '#4B5563',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaText: {
    color: '#374151',
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  instructions: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
  },
  instructionsText: {
    color: '#92400E',
  },
  footer: {
    alignItems: 'center',
  },
  pagination: {
    color: '#6B7280',
  },
  nextCard: {
    position: 'absolute',
    width: '100%',
    maxWidth: 360,
    transform: [{ translateY: 20 }],
  },
  nextCardInner: {
    borderRadius: 24,
    borderStyle: 'dashed',
  },
  nextCardContent: {
    alignItems: 'center',
    gap: 8,
  },
  nextCardText: {
    color: '#6B7280',
  },
  fullscreenCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  loadingTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingSubtitle: {
    textAlign: 'center',
    color: '#4B5563',
  },
  retryButton: {
    marginTop: 12,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  amountButton: {
    flexGrow: 1,
  },
  modalSubtitle: {
    color: '#4B5563',
  },
});
