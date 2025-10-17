import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, List } from 'react-native-paper';
import { ConnectButton, useActiveAccount } from '@/lib/solanaWallet';
import { CheckCircle, Download, Shield, Wallet } from 'lucide-react-native';

const STEP_ITEMS = [
  {
    icon: Download,
    title: 'Install a wallet',
    description: 'Download Phantom, Solflare, Backpack, or use the built-in mock wallet.',
  },
  {
    icon: Shield,
    title: 'Secure your keys',
    description:
      'Back up your recovery phrase in a secure location and never share it with anyone.',
  },
  {
    icon: Wallet,
    title: 'Connect to Bitcoin University',
    description:
      'Use the connect button below to link your Solana wallet and start exploring investments.',
  },
] as const;

export default function WalletOnboardingScreen() {
  const account = useActiveAccount();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Wallet Onboarding
      </Text>
      <Text variant="bodyLarge" style={styles.subheading}>
        Follow these steps to set up your wallet and join the Bitcoin University ecosystem.
      </Text>

      <Card style={styles.primaryCard}>
        <Card.Content style={styles.primaryContent}>
          {STEP_ITEMS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <step.icon size={24} color="#F97316" />
              </View>
              <View style={styles.stepInfo}>
                <Text variant="titleMedium">{index + 1}. {step.title}</Text>
                <Text variant="bodySmall" style={styles.stepDescription}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.secondaryCard}>
        <Card.Title
          title="Recommended wallets"
          subtitle="Choose one of the following options to get started quickly."
        />
        <Card.Content>
          <List.Item
            title="Phantom"
            description="Popular Solana wallet across mobile and desktop. Great developer ecosystem."
            left={() => <List.Icon icon="ghost" />}
          />
          <List.Item
            title="Solflare"
            description="Long-standing Solana wallet with hardware wallet support and staking integrations."
            left={() => <List.Icon icon="white-balance-sunny" />}
          />
          <List.Item
            title="Backpack"
            description="All-in-one wallet with xNFT support and integrated Solana dev tooling."
            left={() => <List.Icon icon="bag-personal" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.connectCard}>
        <Card.Content style={styles.connectContent}>
          <Text variant="titleMedium" style={styles.connectTitle}>
            Connect your wallet
          </Text>
          <Text variant="bodySmall" style={styles.connectSubtitle}>
            {account?.address
              ? 'Wallet connected. You are ready to invest!'
              : 'Connect now to access investment opportunities, leaderboards, and portfolio tracking.'}
          </Text>
          <ConnectButton />
          {account?.address ? (
            <View style={styles.successRow}>
              <CheckCircle size={20} color="#22C55E" />
              <Text variant="bodySmall" style={styles.successText}>
                Connected as {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </Text>
            </View>
          ) : (
            <Button
              mode="text"
              onPress={() => {}}
              disabled
              style={styles.disabledButton}
            >
              Waiting for wallet connection
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
  },
  heading: {
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    color: '#4B5563',
  },
  primaryCard: {
    borderRadius: 20,
  },
  primaryContent: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
  },
  stepDescription: {
    color: '#6B7280',
    marginTop: 4,
  },
  secondaryCard: {
    borderRadius: 18,
  },
  connectCard: {
    borderRadius: 18,
    backgroundColor: '#FFFBEB',
  },
  connectContent: {
    gap: 12,
  },
  connectTitle: {
    fontWeight: '600',
  },
  connectSubtitle: {
    color: '#6B7280',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: '#047857',
  },
  disabledButton: {
    alignSelf: 'flex-start',
  },
});
