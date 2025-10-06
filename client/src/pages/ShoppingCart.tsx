import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { client, wallets, ConnectButton } from "@/lib/thirdweb";
import { useThirdwebBatch } from "@/hooks/useThirdwebBatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  ShoppingCart as ShoppingCartIcon, 
  Trash2, 
  CreditCard, 
  DollarSign,
  Edit3,
  Check,
  X,
  Target,
  Users,
  Briefcase,
  Globe,
  ArrowLeft,
  Plus,
  Wallet
} from "lucide-react";

export default function ShoppingCart() {
  const account = useActiveAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { items, removeItem, updateItemAmount, clearCart, getTotalAmount, getTotalItems } = useShoppingCart();
  const { processBatch, prepareGaslessBatch, isBatchProcessing } = useThirdwebBatch();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Blockchain-only checkout using thirdweb batch transactions
  const handleBlockchainCheckout = async () => {
    if (!account?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some investments to your cart first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Convert cart items to batch format for blockchain transaction
      const batchItems = items.map(item => ({
        targetType: item.targetType,
        targetId: item.targetId,
        targetName: item.targetName || item.targetId,
        amount: item.amount,
        metadata: JSON.stringify({
          currency: item.currency,
          timestamp: Date.now()
        })
      }));

      // Process via blockchain batch transaction
      const txHash = await processBatch(batchItems);
      
      if (txHash) {
        toast({
          title: "🎉 Investment Complete!",
          description: `Successfully invested in ${items.length} opportunities via blockchain! Transaction: ${txHash.slice(0, 10)}...`,
        });
        
        // Clear cart
        clearCart();
        
        // Refresh blockchain investment data
        queryClient.invalidateQueries({ queryKey: ["blockchain-investments"] });
      }
    } catch (error) {
      console.error("Blockchain checkout failed:", error);
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "An error occurred during blockchain checkout",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditAmount = (itemId: string, currentAmount: string) => {
    setEditingItem(itemId);
    setEditAmount(currentAmount);
  };

  const handleSaveEdit = (itemId: string) => {
    const amount = parseFloat(editAmount);
    if (amount > 0) {
      updateItemAmount(itemId, editAmount);
    }
    setEditingItem(null);
    setEditAmount("");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditAmount("");
  };


  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dao':
        return <Users className="w-4 h-4" />;
      case 'scholarship':
        return <Target className="w-4 h-4" />;
      case 'grant':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'dao':
        return 'bg-blue-500';
      case 'scholarship':
        return 'bg-green-500';
      case 'grant':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!account?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Wallet className="w-16 h-16 text-bitcoin-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to view your cart and make investments
            </p>
            <ConnectButton
              client={client}
              connectModal={{ size: "compact" }}
              wallets={wallets}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 p-4">
            <Link href="/discover">
              <Button size="sm" variant="ghost" data-testid="back-to-discover">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-charcoal dark:text-white">Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md text-center p-8">
            <CardContent>
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Discover investment opportunities and add them to your cart
              </p>
              <Link href="/discover">
                <Button className="bg-bitcoin-orange hover:bg-orange-600" data-testid="discover-opportunities">
                  <Plus className="w-4 h-4 mr-2" />
                  Discover Opportunities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/discover">
              <Button size="sm" variant="ghost" data-testid="back-to-discover">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-charcoal dark:text-white">Cart</h1>
          </div>
          <Badge variant="secondary" className="bg-bitcoin-orange/10 text-bitcoin-orange">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeBadgeColor(item.targetType)} flex items-center gap-1`}>
                        {getTypeIcon(item.targetType)}
                        {item.targetType.toUpperCase()}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      data-testid={`remove-item-${item.targetId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="font-medium text-lg mb-2 line-clamp-2">
                    {item.targetName}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Amount Section */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Investment Amount</span>
                    <div className="flex items-center gap-2">
                      {editingItem === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 h-8 text-sm"
                            data-testid={`edit-amount-input-${item.targetId}`}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveEdit(item.id)}
                            className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            data-testid={`save-edit-${item.targetId}`}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            data-testid={`cancel-edit-${item.targetId}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-bitcoin-orange">
                            ${parseFloat(item.amount).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditAmount(item.id, item.amount)}
                            className="text-bitcoin-orange hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            data-testid={`edit-amount-${item.targetId}`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-bitcoin-orange/5 to-orange-100/50 dark:from-bitcoin-orange/10 dark:to-orange-900/20 border-bitcoin-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Investment Summary</span>
              <DollarSign className="w-5 h-5 text-bitcoin-orange" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Items</span>
              <span className="font-medium">{getTotalItems()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
              <span className="font-bold text-xl text-bitcoin-orange">
                ${getTotalAmount().toLocaleString()}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🚀 You're about to invest in {getTotalItems()} innovative opportunities
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                All investments are processed securely through your connected wallet
              </p>
            </div>

            <Separator />

            <div className="text-xs text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              ⚡ Blockchain-only investments - All transactions processed on-chain with batch optimization!
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <div className="sticky bottom-20 pt-4">
          <Button
            onClick={handleBlockchainCheckout}
            disabled={isProcessing || isBatchProcessing || items.length === 0}
            className="w-full bg-bitcoin-orange hover:bg-orange-600 text-white py-6 text-lg font-semibold shadow-lg"
            data-testid="checkout-button"
          >
            {(isProcessing || isBatchProcessing) ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Blockchain Transaction...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                ⚡ Blockchain Invest ${getTotalAmount().toLocaleString()}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}