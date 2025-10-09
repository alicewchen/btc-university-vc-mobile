import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, List, Divider } from 'react-native-paper';

export default function WalletScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = async () => {
    // WalletConnect integration will be added later
    setIsConnected(true);
    setWalletAddress('0x1234...5678');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <View style={styles.connectContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Connect Your Wallet
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Connect your Web3 wallet to interact with DAOs and smart contracts
          </Text>
          <Button
            mode="contained"
            onPress={handleConnect}
            icon="wallet"
            style={styles.connectButton}
          >
            Connect Wallet
          </Button>
        </View>
      ) : (
        <View>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="labelLarge">Connected Wallet</Text>
              <Text variant="titleMedium" style={styles.address}>
                {walletAddress}
              </Text>
              <Button
                mode="outlined"
                onPress={handleDisconnect}
                style={styles.disconnectButton}
              >
                Disconnect
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Portfolio
              </Text>
              <List.Item
                title="DAO Memberships"
                description="3 active DAOs"
                left={(props) => <List.Icon {...props} icon="account-group" />}
              />
              <Divider />
              <List.Item
                title="Governance Tokens"
                description="5 different tokens"
                left={(props) => <List.Icon {...props} icon="coins" />}
              />
              <Divider />
              <List.Item
                title="Active Proposals"
                description="2 pending votes"
                left={(props) => <List.Icon {...props} icon="vote" />}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Recent Activity
              </Text>
              <List.Item
                title="Joined Climate Tech DAO"
                description="2 hours ago"
                left={(props) => <List.Icon {...props} icon="check-circle" />}
              />
              <List.Item
                title="Voted on Proposal #42"
                description="1 day ago"
                left={(props) => <List.Icon {...props} icon="vote" />}
              />
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  connectButton: {
    paddingHorizontal: 24,
  },
  card: {
    marginBottom: 16,
  },
  address: {
    marginTop: 8,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  disconnectButton: {
    marginTop: 8,
  },
  cardTitle: {
    marginBottom: 12,
  },
});
