import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, Chip, HelperText } from 'react-native-paper';
import {
  useActiveAccount,
  useSolanaWallet,
  useConnect,
  useDisconnect,
} from '@/lib/solanaWallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, TestTube, User } from 'lucide-react-native';

const TEST_ACCOUNTS = [
  {
    id: 'test-user-1',
    name: 'Test Investor Alice',
    address: '2yJ1N9ze2vfsonMSKcwkbeGU8ZndKyGKoU9p24XS5PBP',
    balance: '1250.0',
    description: 'Active Solana ecosystem investor focused on climate tech and regenerative finance',
    riskTolerance: 'moderate',
    investmentPreferences: ['Biotechnology', 'Climate Tech', 'DeFi'],
  },
  {
    id: 'test-user-2',
    name: 'Test Investor Bob',
    address: '8pkDGpTe3nyY5hFNjMagsyN4m3Cs8dUdu7Nc7xCgQNgH',
    balance: '9800.0',
    description: 'Crypto whale interested in AI safety, DePIN, and zero-knowledge research',
    riskTolerance: 'high',
    investmentPreferences: ['AI Safety', 'DePIN', 'Zero Knowledge'],
  },
  {
    id: 'test-user-3',
    name: 'Test Investor Carol',
    address: '5Qgnxf2Vb2cib1oC6H1VSM8bW4QbZ8iWJSy9g1roPa7R',
    balance: '480.0',
    description: 'Conservative investor focused on sustainable agriculture and women-led teams',
    riskTolerance: 'low',
    investmentPreferences: ['Agriculture', 'Sustainability', 'Women in Web3'],
  },
] as const;

type TestAccount = (typeof TEST_ACCOUNTS)[number];

const TEST_USER_STORAGE_KEY = '@btc_university_test_user';
const TEST_WALLET_STORAGE_KEY = '@btc_university_test_wallet';

export default function TestWalletScreen() {
  const account = useActiveAccount();
  const { isMockConnection } = useSolanaWallet();
  const { connect, isConnecting: isGlobalConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [storedAccount, setStoredAccount] = useState<TestAccount | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(TEST_USER_STORAGE_KEY).then((value) => {
      if (value) {
        try {
          const parsed = JSON.parse(value) as TestAccount;
          setStoredAccount(parsed);
          setSelectedAccount(parsed.id);
        } catch (error) {
          console.error('Failed to parse stored test user', error);
        }
      }
    });
  }, []);

  const handleTestLogin = async (testAccount: TestAccount) => {
    setIsConnecting(true);
    setSelectedAccount(testAccount.id);

    try {
      await AsyncStorage.setItem(TEST_USER_STORAGE_KEY, JSON.stringify(testAccount));
      await AsyncStorage.setItem(TEST_WALLET_STORAGE_KEY, testAccount.address);

      await connect({
        type: 'mock',
        address: testAccount.address,
        label: testAccount.name,
      });

      setStoredAccount(testAccount);
      toast({
        title: 'Test login successful',
        description: testAccount.name,
      });
    } catch (error) {
      console.error('Test login failed', error);
      await AsyncStorage.removeItem(TEST_USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TEST_WALLET_STORAGE_KEY);
      setSelectedAccount(null);
      toast({
        title: 'Test login failed',
        description: 'Unable to authenticate test account',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    setSelectedAccount(null);
    setStoredAccount(null);
    await AsyncStorage.removeItem(TEST_USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TEST_WALLET_STORAGE_KEY);
    await disconnect();
    toast({ title: 'Test session cleared' });
  };

  const isRealWalletConnected = Boolean(account && !isMockConnection);
  const accountAddress = account?.address ?? '';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <TestTube size={32} color="#F97316" />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Test Wallet Login
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Quick login with pre-configured test accounts for development builds.
          </Text>
          <View style={styles.alertBox}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text variant="bodySmall" style={styles.alertText}>
              Test accounts simulate investor profiles and preferences. Real wallet connections
              override test mode automatically.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {isRealWalletConnected ? (
        <Card style={styles.noticeCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.noticeText}>
              ✅ Real wallet connected: {accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}` : 'Active session'}
            </Text>
            <Text variant="bodySmall" style={styles.noticeHint}>
              Test accounts are disabled while a real or generated wallet is connected.
            </Text>
          </Card.Content>
        </Card>
      ) : null}

      {storedAccount ? (
        <Card style={styles.noticeCard}>
          <Card.Content style={styles.noticeContent}>
            <User size={24} color="#2563EB" />
            <View style={styles.noticeInfo}>
              <Text variant="bodyMedium" style={styles.noticeText}>
                Active Test Session: {storedAccount.name}
              </Text>
              <Text variant="bodySmall" style={styles.noticeHint}>
                {storedAccount.address.slice(0, 10)}... ({storedAccount.balance} SOL)
              </Text>
            </View>
            <Button mode="text" onPress={handleLogout}>
              Logout
            </Button>
          </Card.Content>
        </Card>
      ) : null}

      <View style={styles.list}>
        {TEST_ACCOUNTS.map((testAccount) => {
          const isSelected = selectedAccount === testAccount.id;
          return (
            <Card
              key={testAccount.id}
              style={[
                styles.accountCard,
                isSelected ? styles.accountCardSelected : undefined,
              ]}
            >
              <Card.Content>
                <View style={styles.accountHeader}>
                  <Text variant="titleMedium">{testAccount.name}</Text>
                  <Chip compact>{testAccount.riskTolerance}</Chip>
                </View>
                <Text variant="bodySmall" style={styles.accountDescription}>
                  {testAccount.description}
                </Text>
                <View style={styles.accountMeta}>
                  <Text variant="bodySmall">
                    Address: {testAccount.address.slice(0, 10)}...
                  </Text>
                  <Text variant="bodySmall">Balance: {testAccount.balance} SOL</Text>
                </View>
                <View style={styles.preferenceRow}>
                  {testAccount.investmentPreferences.map((pref) => (
                    <Chip key={pref} compact mode="outlined">
                      {pref}
                    </Chip>
                  ))}
                </View>
                <Button
                  mode={isSelected ? 'outlined' : 'contained'}
                  disabled={isRealWalletConnected}
                  loading={(isConnecting || isGlobalConnecting) && selectedAccount === testAccount.id}
                  onPress={() =>
                    isSelected ? handleLogout() : handleTestLogin(testAccount)
                  }
                  style={styles.loginButton}
                >
                  {isSelected ? 'Logout' : 'Test Login'}
                </Button>
                {isRealWalletConnected ? (
                  <HelperText type="info" visible style={styles.helperText}>
                    Disconnect your real wallet to re-enable test accounts.
                  </HelperText>
                ) : null}
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  headerCard: {
    borderRadius: 20,
  },
  headerContent: {
    gap: 12,
  },
  headerTitle: {
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#4B5563',
  },
  alertBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
  },
  alertText: {
    flex: 1,
    color: '#92400E',
  },
  noticeCard: {
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noticeInfo: {
    flex: 1,
  },
  noticeText: {
    fontWeight: '600',
  },
  noticeHint: {
    color: '#6B7280',
  },
  list: {
    gap: 16,
  },
  accountCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  accountCardSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountDescription: {
    color: '#4B5563',
    marginBottom: 8,
  },
  accountMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  loginButton: {
    alignSelf: 'flex-start',
  },
  helperText: {
    marginLeft: 0,
    marginTop: 8,
  },
});
