import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { Button, Card, Dialog, IconButton, List, Portal, Text, TextInput } from 'react-native-paper';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { useThirdwebBatch } from '@/hooks/useThirdwebBatch';
import { useToast } from '@/hooks/use-toast';
import { ConnectButton, bitcoinUniversityTheme, client, wallets } from '@/lib/thirdweb';
import {
  ArrowLeft,
  Check,
  Edit3,
  ShoppingCart as ShoppingCartIcon,
  Trash2,
  Wallet,
} from 'lucide-react-native';

const formatAmount = (amount: string) => {
  const numeric = parseFloat(amount);
  if (numeric >= 1_000_000) {
    return `$${(numeric / 1_000_000).toFixed(1)}M`;
  }
  if (numeric >= 1000) {
    return `$${(numeric / 1000).toFixed(1)}K`;
  }
  return `$${numeric.toLocaleString()}`;
};

const typeBadgeColor = (type: string) => {
  switch (type) {
    case 'dao':
      return '#3B82F6';
    case 'scholarship':
      return '#10B981';
    case 'grant':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

export default function ShoppingCartScreen() {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { items, removeItem, updateItemAmount, clearCart, getTotalAmount, getTotalItems } =
    useShoppingCart();
  const { processBatch, isBatchProcessing } = useThirdwebBatch();

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const totalAmount = getTotalAmount();
  const totalItems = getTotalItems();

  const handleEdit = (itemId: string, currentAmount: string) => {
    setEditingItem(itemId);
    setEditAmount(currentAmount);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      const numeric = parseFloat(editAmount);
      if (!Number.isNaN(numeric) && numeric > 0) {
        updateItemAmount(editingItem, editAmount);
      }
    }
    setEditingItem(null);
    setEditAmount('');
  };

  const handleBlockchainCheckout = async () => {
    if (!account?.address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to continue',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some investments to your cart first',
        variant: 'destructive',
      });
      return;
    }

    const batchItems = items.map((item) => ({
      targetType: item.targetType,
      targetId: item.targetId,
      targetName: item.targetName,
      amount: item.amount,
      metadata: JSON.stringify({
        currency: item.currency,
        timestamp: Date.now(),
      }),
    }));

    const txHash = await processBatch(batchItems);

    if (txHash) {
      toast({
        title: '🎉 Investment Complete!',
        description: `Successfully invested in ${items.length} opportunities via blockchain!`,
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['blockchain-investments'] });
    }
  };

  if (!account?.address) {
    return (
      <View style={styles.centered}>
        <Card style={styles.centerCard}>
          <Card.Content style={styles.centerCardContent}>
            <Wallet size={48} color="#F97316" />
            <Text variant="titleLarge" style={styles.centerTitle}>
              Connect Your Wallet
            </Text>
            <Text variant="bodyMedium" style={styles.centerMessage}>
              Connect your wallet to view your cart and make investments.
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

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Card style={styles.centerCard}>
          <Card.Content style={styles.centerCardContent}>
            <ShoppingCartIcon size={48} color="#9CA3AF" />
            <Text variant="titleLarge" style={styles.centerTitle}>
              Your Cart is Empty
            </Text>
            <Text variant="bodyMedium" style={styles.centerMessage}>
              Swipe through opportunities on the Discover tab to add investments to your cart.
            </Text>
            <Button
              mode="contained"
              icon={() => <ArrowLeft size={18} color="#fff" />}
              onPress={() => toast({ title: 'Try Discover', description: 'Find new opportunities to invest in.' })}
            >
              Go to Discover
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.heading}>
          Shopping Cart
        </Text>

        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <View>
              <Text variant="labelMedium" style={styles.summaryLabel}>
                Total To Invest
              </Text>
              <Text variant="displaySmall" style={styles.summaryValue}>
                {formatAmount(totalAmount.toString())}
              </Text>
              <Text variant="bodySmall" style={styles.summaryHint}>
                {totalItems} opportunities selected
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={handleBlockchainCheckout}
              loading={isBatchProcessing}
              icon={() => <Check size={18} color="#fff" />}
            >
              Blockchain Checkout
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: typeBadgeColor(item.targetType) },
                    ]}
                  />
                  <View style={styles.itemInfo}>
                    <Text variant="titleMedium" style={styles.itemTitle}>
                      {item.targetName}
                    </Text>
                    <Text variant="bodySmall" style={styles.itemSubtitle}>
                      {item.targetType.toUpperCase()} • {item.currency}
                    </Text>
                  </View>
                  <IconButton
                    icon={() => <Trash2 size={18} color="#EF4444" />}
                    onPress={() => removeItem(item.id)}
                  />
                </View>
                <List.Item
                  title="Amount"
                  description={formatAmount(item.amount)}
                  left={() => <List.Icon icon="cash" />}
                  right={() =>
                    editingItem === item.id ? (
                      <View style={styles.editActions}>
                        <TextInput
                          mode="outlined"
                          value={editAmount}
                          onChangeText={setEditAmount}
                          keyboardType="numeric"
                          style={styles.amountInput}
                        />
                        <IconButton icon={() => <Check size={18} />} onPress={handleSaveEdit} />
                      </View>
                    ) : (
                      <IconButton
                        icon={() => <Edit3 size={18} color="#6B7280" />}
                        onPress={() => handleEdit(item.id, item.amount)}
                      />
                    )
                  }
                />
                {item.description ? (
                  <Text variant="bodySmall" style={styles.itemDescription}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            ))}
            <Button
              mode="outlined"
              onPress={() => setShowClearDialog(true)}
              style={styles.clearButton}
              icon={() => <Trash2 size={18} color="#EF4444" />}
              textColor="#EF4444"
            >
              Clear Cart
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
          <Dialog.Title>Clear Cart?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will remove all items from your cart. You can add them again from the Discover tab.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
            <Button
              onPress={() => {
                clearCart();
                setShowClearDialog(false);
              }}
            >
              Clear
            </Button>
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
    gap: 16,
  },
  heading: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#9CA3AF',
  },
  summaryValue: {
    fontWeight: '700',
  },
  summaryHint: {
    color: '#6B7280',
  },
  sectionCard: {
    borderRadius: 18,
  },
  itemRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 8,
    height: 48,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#6B7280',
  },
  itemDescription: {
    marginTop: 8,
    color: '#6B7280',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountInput: {
    width: 100,
  },
  clearButton: {
    marginTop: 16,
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
