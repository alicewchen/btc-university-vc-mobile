import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useCurrencyPreference, Currency } from "@/hooks/useCurrencyPreference";
import { apiRequest } from "@/lib/queryClient";
import { signAuthMessage } from "@/lib/auth";
import { client, wallets, ConnectButton } from "@/lib/thirdweb";
import { useTheme } from "@/components/ThemeProvider";
import { 
  User,
  Settings,
  Trophy,
  TrendingUp,
  DollarSign,
  LogOut,
  Heart,
  Shield,
  Bell,
  ChevronRight,
  Copy,
  ExternalLink,
  Wallet,
  Monitor,
  Sun,
  Moon,
  Target,
  Zap,
  AlertTriangle
} from "lucide-react";

// Funding tier configuration
const FUNDING_TIERS = {
  individual_supporter: {
    label: 'Individual Supporter',
    amounts: [25, 50, 100, 250],
    description: 'Perfect for individual contributions'
  },
  professional_investor: {
    label: 'Professional Investor', 
    amounts: [100, 500, 1000, 2500],
    description: 'For professional individuals and small offices'
  },
  microvc: {
    label: 'MicroVC',
    amounts: [25000, 100000, 250000, 500000],
    description: 'Micro venture capital and angel syndicates'
  },
  institutional: {
    label: 'Institutional',
    amounts: [1000000, 2500000, 5000000, 10000000],
    description: 'Universities, foundations, and major VCs'
  }
};

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
  quickFundRange: 'individual_supporter' | 'professional_investor' | 'microvc' | 'institutional';
  theme?: 'system' | 'light' | 'dark';
}

interface LeaderboardEntry {
  walletAddress: string;
  pseudonym?: string;
  totalInvested: string;
  investmentCount: number;
  rank: number;
}

export default function InvestorProfile() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrencyPreference();
  const [activeTab, setActiveTab] = useState("profile");
  const [showSettings, setShowSettings] = useState(false);
  const [showInvestmentSettings, setShowInvestmentSettings] = useState(false);
  const [defaultAmount, setDefaultAmount] = useState<number | null>(null);
  
  // Fetch investor profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/investors", account?.address],
    queryFn: async (): Promise<InvestorProfile> => {
      if (!account?.address) throw new Error("Wallet not connected");
      const response = await fetch(`/api/investors/${account.address}`);
      if (!response.ok) throw new Error("Profile not found");
      return response.json();
    },
    enabled: !!account?.address
  });

  // Fetch leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/investors/leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const response = await fetch("/api/investors/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    }
  });

  // Fetch investor preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["/api/investor-preferences", account?.address],
    queryFn: async (): Promise<InvestorPreferences | null> => {
      if (!account?.address) return null;
      const response = await fetch(`/api/investor-preferences/${account.address}`);
      if (!response.ok) {
        if (response.status === 404) return null; // No preferences set yet
        throw new Error("Failed to fetch investor preferences");
      }
      const data = await response.json();
      return data;
    },
    enabled: !!account?.address
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<InvestorProfile>) => {
      if (!account?.address) throw new Error("Wallet not connected");
      // PATCH /api/investors/:address only needs basic ownership verification, no signature required
      
      return apiRequest("PATCH", `/api/investors/${account.address}`, {
        ...updates,
        walletAddress: account.address
      });
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/investors"] });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Failed to update profile",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<InvestorPreferences>) => {
      if (!account?.address) throw new Error("Wallet not connected");
      
      // Determine if preferences exist
      const method = preferences ? "PATCH" : "POST";
      const endpoint = preferences 
        ? `/api/investor-preferences/${account.address}`
        : `/api/investor-preferences`;
      
      const requestData = {
        ...updates,
        walletAddress: account.address
      };
      
      // POST requests require signature authentication, PATCH requests only need basic verification
      if (method === "POST") {
        const signedAuth = await signAuthMessage(account);
        Object.assign(requestData, signedAuth);
      }
      
      return apiRequest(method, endpoint, requestData);
    },
    onSuccess: () => {
      toast({ title: "Preferences updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/investor-preferences"] });
    },
    onError: (error) => {
      console.error("Preferences update error:", error);
      toast({
        title: "Failed to update preferences",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      toast({ title: "Wallet address copied!" });
    }
  };

  const handleDisconnect = async () => {
    try {
      if (wallet) {
        await disconnect(wallet);
        toast({ 
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully"
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnect Failed", 
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getUserRank = () => {
    if (!account?.address || !leaderboard.length) return null;
    const entry = leaderboard.find(e => e.walletAddress.toLowerCase() === account.address.toLowerCase());
    return entry?.rank || null;
  };

  if (!account?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Wallet className="w-16 h-16 text-bitcoin-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to access your investor profile
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-bitcoin-orange">
                <AvatarFallback className="text-white text-xl font-bold">
                  {profile?.pseudonym?.[0] || account.address.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-charcoal dark:text-white">
                  {profile?.pseudonym || "Investor"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleCopyAddress}
                    data-testid="copy-address"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setShowSettings(true)}
              data-testid="settings-button"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-3 text-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatAmount(profile?.totalInvested || "0")}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Total Invested</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 text-center">
                <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {profile?.investmentCount || 0}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Projects</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-3 text-center">
                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  #{getUserRank() || "-"}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Rank</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {!showInvestmentSettings && (
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          )}

          {/* Profile Tab */}
          {!showInvestmentSettings && (
            <TabsContent value="profile" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/portfolio">
                    <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-bitcoin-orange" />
                        <span>View Full Portfolio</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => setShowInvestmentSettings(true)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    data-testid="investment-settings-link"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-bitcoin-orange" />
                      <span>Investment Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-bitcoin-orange" />
                      <span>Notifications</span>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Wallet Connected</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {account.address.slice(0, 10)}...{account.address.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button variant="destructive" className="w-full" data-testid="disconnect-wallet" onClick={handleDisconnect}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Investment Settings View */}
          {showInvestmentSettings && (
            <div className="mt-4 space-y-4">
              {/* Header with Back Button */}
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInvestmentSettings(false)}
                  data-testid="back-to-profile"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Profile
                </Button>
                <div>
                  <h2 className="text-xl font-bold">Investment Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your investment preferences and risk tolerance</p>
                </div>
              </div>

              {/* Risk Tolerance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-bitcoin-orange" />
                    Risk Tolerance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={preferences?.riskTolerance || "moderate"}
                    onValueChange={(value) => {
                      updatePreferencesMutation.mutate({ riskTolerance: value as 'conservative' | 'moderate' | 'aggressive' });
                    }}
                    className="space-y-4"
                    data-testid="risk-tolerance-group"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="conservative" id="conservative" />
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <div>
                            <Label htmlFor="conservative" className="font-medium cursor-pointer">Conservative</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Lower risk, steady returns</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-bitcoin-orange" />
                          <div>
                            <Label htmlFor="moderate" className="font-medium cursor-pointer">Moderate</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Balanced risk and reward</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="aggressive" id="aggressive" />
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-red-500" />
                          <div>
                            <Label htmlFor="aggressive" className="font-medium cursor-pointer">Aggressive</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Higher risk, potential higher returns</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Quick Fund Range Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-bitcoin-orange" />
                    Quick Fund Range
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={preferences?.quickFundRange || "individual_supporter"}
                    onValueChange={(value) => {
                      updatePreferencesMutation.mutate({ 
                        quickFundRange: value as 'individual_supporter' | 'professional_investor' | 'microvc' | 'institutional'
                      });
                    }}
                    className="space-y-4"
                    data-testid="funding-tier-selector"
                  >
                    {Object.entries(FUNDING_TIERS).map(([key, tier]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={key} id={key} />
                          <div>
                            <Label htmlFor={key} className="font-medium cursor-pointer">{tier.label}</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <div>
                    <Label className="text-sm font-medium">Quick Fund Amounts</Label>
                    <TooltipProvider>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {(() => {
                          const selectedTier = preferences?.quickFundRange || 'individual_supporter';
                          const amounts = FUNDING_TIERS[selectedTier as keyof typeof FUNDING_TIERS]?.amounts || FUNDING_TIERS.individual_supporter.amounts;
                          
                          // Set first amount as default if none selected
                          if (defaultAmount === null && amounts.length > 0) {
                            setDefaultAmount(amounts[0]);
                          }
                          
                          return amounts.map((amount, index) => (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`text-xs transition-all duration-200 ${
                                    amount === defaultAmount 
                                      ? 'border-bitcoin-orange border-2 bg-bitcoin-orange/5 text-bitcoin-orange' 
                                      : 'hover:border-bitcoin-orange/30'
                                  }`}
                                  onClick={() => setDefaultAmount(amount)}
                                  data-testid={`quick-fund-button-${index}`}
                                >
                                  ${amount.toLocaleString()}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to set as default funding amount when swiping up</p>
                              </TooltipContent>
                            </Tooltip>
                          ));
                        })()}
                      </div>
                    </TooltipProvider>
                    <p className="text-xs text-gray-500 mt-2">
                      These amounts update based on your selected funding tier. The highlighted amount is your default for quick funding.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leaderboard Tab */}
          {!showInvestmentSettings && (
            <TabsContent value="leaderboard" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Investors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div 
                    key={entry.walletAddress}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.walletAddress.toLowerCase() === account.address.toLowerCase()
                        ? "bg-bitcoin-orange/10 border border-bitcoin-orange"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`font-bold text-lg ${
                        index < 3 ? "text-bitcoin-orange" : "text-gray-600 dark:text-gray-400"
                      }`}>
                        #{index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {entry.pseudonym?.[0] || entry.walletAddress.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {entry.pseudonym || `${entry.walletAddress.slice(0, 6)}...${entry.walletAddress.slice(-4)}`}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {entry.investmentCount} investments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatAmount(entry.totalInvested)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          {!showInvestmentSettings && (
            <TabsContent value="settings" className="mt-4 space-y-4">
            {/* Profile Basics */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pseudonym">Display Name</Label>
                  <Input
                    id="pseudonym"
                    placeholder="Enter your display name"
                    defaultValue={profile?.pseudonym}
                    onBlur={(e) => {
                      if (e.target.value !== profile?.pseudonym) {
                        updateProfileMutation.mutate({ pseudonym: e.target.value });
                      }
                    }}
                    data-testid="pseudonym-input"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">Show on Leaderboard</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your profile publicly
                    </p>
                  </div>
                  <Switch
                    checked={profile?.showOnLeaderboard || false}
                    onCheckedChange={(checked) => {
                      updateProfileMutation.mutate({ showOnLeaderboard: checked });
                    }}
                    data-testid="leaderboard-toggle"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Selected Currency</Label>
                  <Select 
                    value={currency}
                    onValueChange={(value) => {
                      setCurrency(value as Currency);
                    }}
                  >
                    <SelectTrigger id="currency" data-testid="currency-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                      <SelectItem value="DAI">DAI Stablecoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>


            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-bitcoin-orange" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    const themeValue = value as 'system' | 'light' | 'dark';
                    setTheme(themeValue);
                    // Also save to preferences for backup
                    updatePreferencesMutation.mutate({ theme: themeValue });
                  }}
                  className="space-y-2"
                  data-testid="theme-selector"
                >
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="system" id="system" />
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        <div>
                          <Label htmlFor="system" className="font-medium cursor-pointer">System</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Use system preference</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="light" id="light" />
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <div>
                          <Label htmlFor="light" className="font-medium cursor-pointer">Light</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Light mode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="dark" id="dark" />
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        <div>
                          <Label htmlFor="dark" className="font-medium cursor-pointer">Dark</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dark mode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}