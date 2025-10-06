import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { client, wallets, ConnectButton } from "@/lib/thirdweb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useBlockchainInvestments } from "@/hooks/useBlockchainInvestments";
import { 
  DollarSign, 
  TrendingUp, 
  Target,
  Users, 
  Clock,
  Heart,
  Briefcase,
  Globe,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity
} from "lucide-react";

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
  targetType: "dao" | "scholarship" | "grant";
  amount: string;
  currency?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "failed";
  returns?: number;
  performance?: number;
  source?: "database" | "blockchain"; // Track data source
  transactionHash?: string; // For blockchain investments
  tokenId?: string; // For blockchain investments
}

interface PortfolioStats {
  totalValue: number;
  totalETH?: number;
  totalReturns: number;
  totalETHReturns?: number;
  averagePerformance: number;
  topPerformingInvestment: Investment | null;
}

export default function InvestorDashboard() {
  const account = useActiveAccount();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get blockchain investments
  const {
    investments: blockchainInvestments,
    isLoading: blockchainLoading,
    error: blockchainError,
    refresh: refreshBlockchain,
    isDemo
  } = useBlockchainInvestments();

  // Fetch investor profile
  const { data: profile, isLoading: profileLoading } = useQuery<InvestorProfile>({
    queryKey: ["/api/investors", account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/investors/${account?.address}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      return response.json();
    }
  });

  // Fetch database investments
  const { data: databaseInvestments = [], isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments", account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/investments/${account?.address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }
      return response.json();
    }
  });

  // Merge blockchain and database investments with deduplication
  const investments = useMemo(() => {
    const investmentMap = new Map<string, Investment>();
    
    // Add database investments with source tag
    databaseInvestments.forEach(inv => {
      const key = `db-${inv.id}`;
      investmentMap.set(key, {
        ...inv,
        source: "database",
        createdAt: inv.createdAt,
        currency: inv.currency || "USD"
      });
    });
    
    // Add blockchain investments with source tag and convert format
    // Note: Keep amounts in ETH for blockchain investments to avoid currency confusion
    blockchainInvestments.forEach(blockInv => {
      const key = `blockchain-${blockInv.transaction_hash}-${blockInv.token_id}`;
      
      // Check if this investment might already exist in database 
      // Only compare if currencies match to avoid false positives between ETH/USD
      const potentialDuplicate = Array.from(investmentMap.values()).find(inv => 
        inv.targetId === blockInv.target_id && 
        inv.currency === "ETH" && // Only compare with ETH entries
        Math.abs(parseFloat(inv.amount) - parseFloat(blockInv.amount)) < 0.001 // Stricter threshold for ETH
      );
      
      if (!potentialDuplicate) {
        investmentMap.set(key, {
          id: blockInv.id,
          targetId: blockInv.target_id,
          targetName: blockInv.target_name,
          targetType: blockInv.target_type as "dao" | "scholarship" | "grant",
          amount: blockInv.amount,
          currency: "ETH", // Keep as ETH to distinguish from USD
          createdAt: blockInv.date,
          status: "confirmed", // Blockchain investments are always confirmed
          source: "blockchain",
          transactionHash: blockInv.transaction_hash,
          tokenId: blockInv.token_id
        });
      }
    });
    
    // Convert map to array and sort by date (newest first)
    return Array.from(investmentMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [databaseInvestments, blockchainInvestments]);

  // Combined loading state
  const isLoading = investmentsLoading || blockchainLoading;

  // Calculate portfolio stats from combined data (separate USD and ETH)
  const portfolioStats: PortfolioStats = useMemo(() => {
    const usdInvestments = investments.filter(inv => inv.currency === "USD");
    const ethInvestments = investments.filter(inv => inv.currency === "ETH");
    
    const totalUSD = usdInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalETH = ethInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    
    // Only calculate returns for USD investments to avoid currency mixing
    const usdReturns = usdInvestments.reduce((sum, inv) => sum + (inv.returns || 0), 0);
    const ethReturns = ethInvestments.reduce((sum, inv) => sum + (inv.returns || 0), 0);
    
    return {
      totalValue: totalUSD, // Only USD for now, ETH shown separately
      totalETH: totalETH,
      totalReturns: usdReturns, // Only USD returns to avoid mixing
      totalETHReturns: ethReturns, // Separate ETH returns
      averagePerformance: investments.length > 0 
        ? investments.reduce((sum, inv) => sum + (inv.performance || 0), 0) / investments.length 
        : 0,
      topPerformingInvestment: investments
        .filter(inv => inv.performance)
        .sort((a, b) => (b.performance || 0) - (a.performance || 0))[0] || null
    };
  }, [investments]);

  // Calculate data source stats
  const dataSourceStats = {
    blockchainCount: investments.filter(inv => inv.source === "blockchain").length,
    databaseCount: investments.filter(inv => inv.source === "database").length,
    totalCount: investments.length
  };

  const formatAmount = (amount: string | number, currency: string = "USD") => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const symbol = currency === "ETH" ? "Ξ" : "$";
    
    if (num >= 1000000) {
      return `${symbol}${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${symbol}${(num / 1000).toFixed(1)}K`;
    }
    return `${symbol}${num.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dao":
        return <Users className="w-4 h-4" />;
      case "scholarship":
        return <Target className="w-4 h-4" />;
      case "grant":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  if (!account?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Activity className="w-16 h-16 text-bitcoin-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to view your investment portfolio
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

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bitcoin-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Header with Stats */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-charcoal dark:text-white">Portfolio</h1>
            <Link href="/discover">
              <Button size="sm" className="bg-bitcoin-orange hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-1" />
                Invest
              </Button>
            </Link>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className={`text-xs font-medium flex items-center ${portfolioStats.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolioStats.totalReturns >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {formatPercentage(portfolioStats.averagePerformance)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {formatAmount(portfolioStats.totalValue, "USD")}
                  </p>
                  {portfolioStats.totalETH && portfolioStats.totalETH > 0 && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      + {formatAmount(portfolioStats.totalETH, "ETH")}
                    </p>
                  )}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Total Portfolio</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {isDemo && (
                    <Badge className="bg-purple-500 text-white text-xs">Demo</Badge>
                  )}
                </div>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {investments.length}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-blue-600 dark:text-blue-400">Active Investments</p>
                  {dataSourceStats.blockchainCount > 0 && (
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      ⛓️ {dataSourceStats.blockchainCount}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Returns Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Returns Summary</span>
                  <TrendingUp className="w-5 h-5 text-bitcoin-orange" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Returns</span>
                    <span className={`font-bold ${portfolioStats.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatAmount(portfolioStats.totalReturns)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Performance</span>
                    <span className={`font-bold ${portfolioStats.averagePerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(portfolioStats.averagePerformance)}
                    </span>
                  </div>
                  {portfolioStats.topPerformingInvestment && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Performer</p>
                      <p className="font-medium">{portfolioStats.topPerformingInvestment.targetName}</p>
                      <p className="text-sm text-green-600">
                        {formatPercentage(portfolioStats.topPerformingInvestment.performance || 0)} returns
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {investments.slice(0, 5).map((investment) => (
                  <div key={`${investment.source}-${investment.id}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                        {getTypeIcon(investment.targetType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{investment.targetName}</p>
                          {investment.source === "blockchain" ? (
                            <Badge className="bg-purple-500 text-white text-xs">⛓️</Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white text-xs">DB</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatAmount(investment.amount, investment.currency)}</p>
                      {getStatusBadge(investment.status)}
                    </div>
                  </div>
                ))}
                {investments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No investments yet</p>
                    <Link href="/discover">
                      <Button className="bg-bitcoin-orange hover:bg-orange-600">
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="mt-4">
            {/* Data Sources Info */}
            {(dataSourceStats.blockchainCount > 0 || isDemo) && (
              <Card className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-500 text-white">⛓️ Hybrid Portfolio</Badge>
                    {isDemo && <Badge className="bg-orange-500 text-white">Demo Mode</Badge>}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your portfolio combines investments from both traditional database records and blockchain transactions. 
                    Blockchain investments are verified on-chain and cannot be altered.
                  </p>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    📊 Database: {dataSourceStats.databaseCount} • ⛓️ Blockchain: {dataSourceStats.blockchainCount}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>All Investments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {investments.map((investment) => (
                  <div key={`${investment.source}-${investment.id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(investment.targetType)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{investment.targetName}</p>
                            {investment.source === "blockchain" ? (
                              <Badge className="bg-purple-500 text-white text-xs">⛓️ Blockchain</Badge>
                            ) : (
                              <Badge className="bg-gray-500 text-white text-xs">Database</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {investment.targetType.toUpperCase()}
                            {investment.transactionHash && (
                              <span className="ml-2">• Tx: {investment.transactionHash.substring(0, 8)}...</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(investment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Invested</p>
                        <p className="font-bold">{formatAmount(investment.amount, investment.currency)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Returns</p>
                        <p className={`font-bold ${(investment.returns || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatAmount(investment.returns || 0, investment.currency)}
                        </p>
                      </div>
                    </div>

                    {investment.performance !== undefined && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                          <span className={`text-sm font-bold flex items-center gap-1 ${
                            investment.performance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.performance >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {formatPercentage(investment.performance)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              investment.performance >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(Math.abs(investment.performance), 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(investment.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="ghost" data-testid={`view-investment-${investment.id}`}>
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {investments.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No investments yet</p>
                    <Link href="/discover">
                      <Button className="bg-bitcoin-orange hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Make Your First Investment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatPercentage(portfolioStats.averagePerformance)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Avg Returns</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {investments.filter(i => i.performance && i.performance > 0).length}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Profitable</p>
                    </div>
                  </div>

                  {/* Investment Distribution */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Investment Distribution</h3>
                    {["dao", "scholarship", "grant"].map((type) => {
                      const typeInvestments = investments.filter(i => i.targetType === type);
                      const typeTotal = typeInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
                      const percentage = portfolioStats.totalValue > 0 ? (typeTotal / portfolioStats.totalValue) * 100 : 0;

                      if (typeInvestments.length === 0) return null;

                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              {getTypeIcon(type)}
                              {type.toUpperCase()}
                            </span>
                            <span className="font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className="bg-bitcoin-orange h-3 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top Performers */}
                  {investments.filter(i => i.performance && i.performance > 0).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Top Performers</h3>
                      {investments
                        .filter(i => i.performance && i.performance > 0)
                        .sort((a, b) => (b.performance || 0) - (a.performance || 0))
                        .slice(0, 3)
                        .map((investment, index) => (
                          <div key={investment.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-xl font-bold text-green-600">
                                #{index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{investment.targetName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {investment.targetType}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-600">
                                {formatPercentage(investment.performance || 0)}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatAmount(investment.returns || 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}