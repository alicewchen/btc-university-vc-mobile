import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { signAuthMessage } from "@/lib/auth";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";
import { 
  DollarSign, 
  TrendingUp, 
  Zap,
  Shield,
  Info
} from "lucide-react";

interface QuickFundButtonsProps {
  targetType: "dao" | "grant" | "scholarship";
  targetId: string;
  targetName: string;
  description?: string;
  currentAmount?: number;
  goalAmount?: number;
  className?: string;
}

interface InvestorPreferences {
  preferredAmounts: string[];
  defaultAmount: string;
  preferredCurrency: string;
  quickFundRange: string;
}

export default function QuickFundButtons({ 
  targetType, 
  targetId, 
  targetName, 
  description,
  currentAmount,
  goalAmount,
  className = ""
}: QuickFundButtonsProps) {
  const account = useActiveAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingAmount, setProcessingAmount] = useState<string | null>(null);

  // Fetch investor preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["/api/investor-preferences", account?.address],
    queryFn: async (): Promise<InvestorPreferences> => {
      if (!account?.address) throw new Error("Wallet not connected");
      const response = await fetch(`/api/investor-preferences/${account.address}`);
      if (!response.ok) throw new Error("Preferences not found");
      return response.json();
    },
    enabled: !!account?.address
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async ({ amount, signedAuth }: { amount: string; signedAuth: any }) => {
      return apiRequest("POST", "/api/investments", {
        targetType,
        targetId,
        amount,
        currency: preferences?.preferredCurrency || "ETH",
        ...signedAuth
      });
    },
    onSuccess: () => {
      const currencySymbol = preferences?.preferredCurrency === 'ETH' ? 'Ξ' : 
                          preferences?.preferredCurrency === 'BTC' ? '₿' : '$';
      toast({
        title: "Investment Successful!",
        description: `Successfully invested ${currencySymbol}${processingAmount} in ${targetName}`,
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/investors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      
      // Invalidate target-specific queries for real-time updates
      if (targetType === 'dao') {
        queryClient.invalidateQueries({ queryKey: ["/api/research-daos", targetId] });
        queryClient.invalidateQueries({ queryKey: ["/api/research-daos"] });
      } else if (targetType === 'grant') {
        queryClient.invalidateQueries({ queryKey: ["/api/grants", targetId] });
        queryClient.invalidateQueries({ queryKey: ["/api/grants"] });
      } else if (targetType === 'scholarship') {
        queryClient.invalidateQueries({ queryKey: ["/api/scholarships", targetId] });
        queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      }
      setProcessingAmount(null);
    },
    onError: (error) => {
      console.error("Investment error:", error);
      toast({
        title: "Investment Failed",
        description: "There was an issue processing your investment. Please try again.",
        variant: "destructive"
      });
      setProcessingAmount(null);
    }
  });

  const handleQuickFund = async (amount: string) => {
    if (!account?.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make an investment.",
        variant: "destructive"
      });
      return;
    }

    if (!preferences) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your investor profile first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingAmount(amount);
      
      // Sign authentication message
      const signedAuth = await signAuthMessage(account);
      
      await investMutation.mutateAsync({
        amount,
        signedAuth
      });
    } catch (error) {
      console.error("Quick fund error:", error);
      toast({
        title: "Authentication Failed",
        description: "Failed to sign investment message. Please try again.",
        variant: "destructive"
      });
      setProcessingAmount(null);
    }
  };

  const formatAmount = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getFundingProgress = () => {
    if (currentAmount == null || goalAmount == null) return null;
    return Math.round((currentAmount / goalAmount) * 100);
  };

  if (!account?.address) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-bitcoin-orange" />
            Quick Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your wallet to enable quick funding
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (preferencesLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-bitcoin-orange" />
            Quick Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-bitcoin-orange" />
            Quick Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Info className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Complete your investor profile to enable quick funding
            </p>
            <Button 
              size="sm" 
              className="bg-bitcoin-orange hover:bg-orange-600"
              onClick={() => window.location.href = '/invest/dashboard'}
              data-testid="button-setup-profile"
            >
              Set Up Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-bitcoin-orange" />
          Quick Fund
          <Badge variant="secondary" className="ml-auto text-xs">
            {preferences.preferredCurrency}
          </Badge>
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Funding Progress */}
        {currentAmount != null && goalAmount != null && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium">{getFundingProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getFundingProgress() || 0, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              ${currentAmount.toLocaleString()} / ${goalAmount.toLocaleString()}
            </div>
          </div>
        )}

        {/* Quick Fund Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Quick Fund Amounts
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {preferences.preferredAmounts.map((amount) => {
              const isDefault = amount === preferences.defaultAmount;
              const isProcessing = processingAmount === amount;
              
              return (
                <Button
                  key={amount}
                  onClick={() => handleQuickFund(amount)}
                  disabled={investMutation.isPending}
                  className={`relative ${
                    isDefault 
                      ? "bg-bitcoin-orange hover:bg-orange-600 text-white" 
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                  data-testid={`button-quick-fund-${amount}`}
                >
                  {isProcessing && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  <DollarSign className="w-4 h-4 mr-1" />
                  {formatAmount(amount)}
                  {isDefault && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {preferences.defaultAmount && (
            <p className="text-xs text-gray-500 text-center">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {formatAmount(preferences.defaultAmount)} is your primary amount
            </p>
          )}
        </div>

        {/* Investment Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between mb-1">
            <span>Investment Type:</span>
            <span className="font-medium capitalize">{targetType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Processing Fee:</span>
            <span className="font-medium">1% (Platform)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}