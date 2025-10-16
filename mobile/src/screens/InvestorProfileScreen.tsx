import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';
import {
  Avatar,
  Button,
  Card,
  Dialog,
  HelperText,
  List,
  Portal,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { signAuthMessage } from '@/lib/auth';
import { useCurrencyPreference, Currency } from '@/hooks/useCurrencyPreference';
import {
  ArrowUpRight,
  Copy,
  LogOut,
  Settings,
  Shield,
  Trophy,
  User,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

const FUNDING_TIERS = [
  { id: 'individual_supporter', label: 'Individual Supporter' },
  { id: 'professional_investor', label: 'Professional Investor' },
  { id: 'microvc', label: 'Micro VC' },
  { id: 'institutional', label: 'Institutional' },
] as const;

type FundingTierId = (typeof FUNDING_TIERS)[number]['id'];

interface InvestorProfile {
  walletAddress: string;
  pseudonym?: string;
  profileCompleted: boolean;
  showOnLeaderboard: boolean;
  totalInvested: string;
  investmentCount: number;
  joinedAt: string;
}

interface InvestorPreferences {
  walletAddress: string;
  preferredCurrency: string;
  interests: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  autoInvestEnabled: boolean;
  quickFundRange: FundingTierId;
  theme?: 'system' | 'light' | 'dark';
}

interface LeaderboardEntry {
  walletAddress: string;
  pseudonym?: string;
  totalInvested: string;
  investmentCount: number;
  rank: number;
}

const abbreviateAddress = (address?: string | null) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '—';

export default function InvestorProfileScreen() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currency, setCurrency } = useCurrencyPreference();

  const [isPreferencesDialogVisible, setPreferencesDialogVisible] = useState(false);
  const [pseudonym, setPseudonym] = useState('');
  const [pseudonymError, setPseudonymError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<FundingTierId>('individual_supporter');
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(false);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(false);

  const { data: profile } = useQuery<InvestorProfile | null>({
    queryKey: ['/api/investors', account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      const response = await apiRequest<InvestorProfile>(
        'GET',
        `/api/investors/${account?.address}`,
      );
      return response;
    },
  });

  const { data: preferences } = useQuery<InvestorPreferences | null>({
    queryKey: ['/api/investor-preferences', account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      const response = await apiRequest<InvestorPreferences>(
        'GET',
        `/api/investor-preferences/${account?.address}`,
      );
      return response;
    },
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/investors/leaderboard'],
    queryFn: () => apiRequest<LeaderboardEntry[]>('GET', '/api/investors/leaderboard'),
  });

  const leaderboardRank = useMemo(() => {
    if (!profile?.walletAddress) return null;
    const entry = leaderboard.find(
      (item) => item.walletAddress.toLowerCase() === profile.walletAddress.toLowerCase(),
    );
    return entry?.rank ?? null;
  }, [leaderboard, profile?.walletAddress]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<InvestorProfile>) => {
      if (!account?.address) throw new Error('Wallet not connected');
      return apiRequest('PATCH', `/api/investors/${account.address}`, {
        ...updates,
        walletAddress: account.address,
      });
    },
    onSuccess: () => {
      toast({ title: 'Profile updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/investors'] });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: 'Failed to update profile',
        description: 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<InvestorPreferences>) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const requestData = {
        ...updates,
        walletAddress: account.address,
      };

      if (!preferences) {
        const signedAuth = await signAuthMessage(account);
        Object.assign(requestData, signedAuth);
        return apiRequest('POST', '/api/investor-preferences', requestData);
      }
      return apiRequest('PATCH', `/api/investor-preferences/${account.address}`, requestData);
    },
    onSuccess: () => {
      toast({ title: 'Preferences updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/investor-preferences'] });
    },
    onError: (error) => {
      console.error('Preferences update error:', error);
      toast({
        title: 'Failed to update preferences',
        description: 'Please try again',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (preferences) {
      setSelectedTier(preferences.quickFundRange);
      setAutoInvestEnabled(preferences.autoInvestEnabled);
      setCurrency(preferences.preferredCurrency as Currency);
    }
  }, [preferences, setCurrency]);

  useEffect(() => {
    setPseudonym(profile?.pseudonym ?? '');
    setShowOnLeaderboard(profile?.showOnLeaderboard ?? false);
  }, [profile]);

  const applyPreferencesState = () => {
    if (preferences) {
      setSelectedTier(preferences.quickFundRange);
      setAutoInvestEnabled(preferences.autoInvestEnabled);
      setCurrency(preferences.preferredCurrency as Currency);
    } else {
      setSelectedTier('individual_supporter');
      setAutoInvestEnabled(false);
    }
    setShowOnLeaderboard(profile?.showOnLeaderboard ?? false);
  };

  const handleOpenPreferences = () => {
    applyPreferencesState();
    setPreferencesDialogVisible(true);
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate({
      preferredCurrency: currency,
      quickFundRange: selectedTier,
      autoInvestEnabled,
    });
    updateProfileMutation.mutate({ showOnLeaderboard });
    setPreferencesDialogVisible(false);
  };

  const handleCopyAddress = () => {
    if (account?.address) {
      Clipboard.setStringAsync(account.address);
      toast({
        title: 'Address copied',
        description: abbreviateAddress(account.address),
      });
    }
  };

  const handleDisconnect = async () => {
    if (!wallet) {
      toast({
        title: 'No wallet connected',
        description: 'Connect a wallet before attempting to disconnect.',
      });
      return;
    }
    await disconnect(wallet);
    toast({ title: 'Wallet disconnected' });
  };

  const validatePseudonym = (value: string) => {
    if (value.length > 32) {
      setPseudonymError('Pseudonym must be 32 characters or fewer');
    } else {
      setPseudonymError(null);
    }
    setPseudonym(value);
  };

  const handleSavePseudonym = () => {
    if (!pseudonymError) {
      updateProfileMutation.mutate({ pseudonym });
    }
  };

  if (!account?.address) {
    return (
      <View style={styles.centered}>
        <Card style={styles.centerCard}>
          <Card.Content style={styles.centerCardContent}>
            <User size={48} color="#F97316" />
            <Text variant="titleLarge" style={styles.centerTitle}>
              Connect Your Wallet
            </Text>
            <Text variant="bodyMedium" style={styles.centerMessage}>
              Connect your wallet to edit your investor profile and preferences.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text size={64} label={profile?.pseudonym?.[0] ?? 'B'} />
            <View style={styles.profileInfo}>
              <Text variant="titleLarge" style={styles.profileName}>
                {profile?.pseudonym ?? 'Bitcoin University Investor'}
              </Text>
              <View style={styles.addressRow}>
                <Text variant="bodySmall" style={styles.addressText}>
                  {abbreviateAddress(account.address)}
                </Text>
                <Button
                  mode="text"
                  compact
                  icon={() => <Copy size={16} color="#F97316" />}
                  onPress={handleCopyAddress}
                >
                  Copy
                </Button>
              </View>
              <TextInput
                label="Pseudonym"
                mode="outlined"
                value={pseudonym}
                onChangeText={validatePseudonym}
                right={<TextInput.Icon icon="check" onPress={handleSavePseudonym} />}
              />
              {pseudonymError ? (
                <HelperText type="error" visible>
                  {pseudonymError}
                </HelperText>
              ) : null}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.grid}>
          <Card style={styles.metricCard}>
            <Card.Content>
              <Text variant="labelMedium" style={styles.metricLabel}>
                Total Invested
              </Text>
              <Text variant="headlineMedium" style={styles.metricValue}>
                ${Number(profile?.totalInvested ?? 0).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.metricCard}>
            <Card.Content>
              <Text variant="labelMedium" style={styles.metricLabel}>
                Investments
              </Text>
              <Text variant="headlineMedium" style={styles.metricValue}>
                {profile?.investmentCount ?? 0}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.sectionCard}>
          <Card.Title
            title="Leaderboard"
            subtitle={
              leaderboardRank ? `Current rank: #${leaderboardRank}` : 'Not on leaderboard yet'
            }
            left={() => <Trophy size={24} color="#FACC15" />}
          />
          <Card.Content>
            <List.Item
              title="Show on leaderboard"
              description="Opt-in to display your portfolio on the community leaderboard"
              left={() => <List.Icon icon="trophy-outline" />}
              right={() => (
                <Switch
                  value={showOnLeaderboard}
                  onValueChange={(value) => {
                    setShowOnLeaderboard(value);
                    updateProfileMutation.mutate({ showOnLeaderboard: value });
                  }}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title
            title="Investment preferences"
            subtitle="Update quick fund ranges and automation"
            left={() => <Settings size={24} color="#6366F1" />}
          />
          <Card.Content>
            <List.Item
              title="Quick Fund Range"
              description={
                FUNDING_TIERS.find((tier) => tier.id === preferences?.quickFundRange)?.label ??
                'Not set'
              }
              left={() => <List.Icon icon="lightning-bolt-outline" />}
              right={() => (
                <Button onPress={handleOpenPreferences} compact mode="text">
                  Edit
                </Button>
              )}
            />
            <List.Item
              title="Preferred Currency"
              description={currency}
              left={() => <List.Icon icon="currency-usd" />}
              right={() => (
                <Button onPress={handleOpenPreferences} compact>
                  Change
                </Button>
              )}
            />
            <List.Item
              title="Auto Invest"
              description="Automatically invest in top opportunities that match your filters"
              left={() => <List.Icon icon="robot-outline" />}
              right={() => (
                <Switch
                  value={autoInvestEnabled}
                  onValueChange={(value) => {
                    setAutoInvestEnabled(value);
                    updatePreferencesMutation.mutate({ autoInvestEnabled: value });
                  }}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title
            title="Security"
            subtitle="Manage connected wallet sessions"
            left={() => <Shield size={24} color="#059669" />}
          />
          <Card.Content>
            <List.Item
              title="Wallet Connection"
              description={wallet ? 'Active' : 'Not connected'}
              left={() => <List.Icon icon="wallet" />}
              right={() => (
                <Button
                  mode="outlined"
                  onPress={handleDisconnect}
                  icon={() => <LogOut size={16} color="#EF4444" />}
                  textColor="#EF4444"
                >
                  Disconnect
                </Button>
              )}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={isPreferencesDialogVisible}
          onDismiss={() => setPreferencesDialogVisible(false)}
        >
          <Dialog.Title>Update Preferences</Dialog.Title>
          <Dialog.Content>
            <Text variant="labelMedium" style={styles.preferenceLabel}>
              Quick Fund Range
            </Text>
            {FUNDING_TIERS.map((tier) => (
              <List.Item
                key={tier.id}
                title={tier.label}
                onPress={() => setSelectedTier(tier.id)}
                right={() => (selectedTier === tier.id ? <ArrowUpRight size={16} /> : null)}
              />
            ))}

            <Text variant="labelMedium" style={styles.preferenceLabel}>
              Preferred Currency
            </Text>
            <View style={styles.currencyRow}>
              {(['ETH', 'USDC', 'DAI'] as Currency[]).map((option) => (
                <Button
                  key={option}
                  mode={currency === option ? 'contained' : 'outlined'}
                  style={styles.currencyButton}
                  onPress={() => setCurrency(option)}
                >
                  {option}
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPreferencesDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSavePreferences}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
  },
  profileCard: {
    borderRadius: 20,
  },
  profileContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    color: '#6B7280',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
  },
  metricLabel: {
    color: '#9CA3AF',
  },
  metricValue: {
    marginTop: 4,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 18,
  },
  preferenceLabel: {
    marginTop: 12,
    marginBottom: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    flex: 1,
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
