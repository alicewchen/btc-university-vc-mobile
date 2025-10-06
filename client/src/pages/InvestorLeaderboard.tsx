import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";
import ThirdwebWalletConnection from "@/components/ThirdwebWalletConnection";
import { 
  TrendingUp, 
  Award, 
  DollarSign, 
  Users, 
  Target,
  Trophy,
  Crown,
  Medal,
  Wallet,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Link } from "wouter";

interface LeaderboardInvestor {
  walletAddress: string;
  pseudonym?: string;
  totalInvested: string;
  investmentCount: number;
  rank: number;
  joinedAt: string;
}

export default function InvestorLeaderboard() {
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<"amount" | "count">("amount");

  // Fetch leaderboard data
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardInvestor[]>({
    queryKey: ["/api/investors/leaderboard", activeTab],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/investors/leaderboard?sortBy=${activeTab}`);
      return response.json();
    }
  });

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format investment amount
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <TrendingUp className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Investor Leaderboard
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Meet the leading investors powering breakthrough research and innovation
            </p>
            
            {!account ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 mr-3" />
                  <span className="text-lg font-medium">Join the Investor Community</span>
                </div>
                <ThirdwebWalletConnection 
                  variant="button-only" 
                  className="w-full bg-white text-bitcoin-orange hover:bg-gray-100 font-semibold" 
                />
                <p className="text-sm mt-3 opacity-90">
                  Connect your wallet to access the Investor Portal
                </p>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 mr-3" />
                  <span className="text-lg font-medium">Welcome Back, Investor!</span>
                </div>
                <Link href="/invest/dashboard">
                  <Button className="w-full bg-white text-bitcoin-orange hover:bg-gray-100 font-semibold">
                    Enter Investor Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invested</p>
                  <p className="text-2xl font-bold text-charcoal dark:text-white">
                    ${leaderboard.reduce((sum, investor) => sum + parseFloat(investor.totalInvested), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-bitcoin-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Investors</p>
                  <p className="text-2xl font-bold text-charcoal dark:text-white">
                    {leaderboard.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-bitcoin-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Research Projects</p>
                  <p className="text-2xl font-bold text-charcoal dark:text-white">
                    {leaderboard.reduce((sum, investor) => sum + investor.investmentCount, 0)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-bitcoin-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-bitcoin-orange" />
              Top Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "amount" | "count")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="amount" data-testid="tab-by-amount">By Total Investment</TabsTrigger>
                <TabsTrigger value="count" data-testid="tab-by-count">By Project Count</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-0">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No Investors Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Be the first to join our investor community and support breakthrough research
                    </p>
                    {!account && (
                      <ThirdwebWalletConnection 
                        variant="button-only" 
                        className="bg-bitcoin-orange hover:bg-orange-600 text-white" 
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((investor, index) => (
                      <div
                        key={investor.walletAddress}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                          index < 3 
                            ? "bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800" 
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                        data-testid={`investor-${index}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(investor.rank)}
                          </div>
                          
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-bitcoin-orange to-orange-600 text-white font-bold">
                              {investor.pseudonym ? investor.pseudonym.slice(0, 2).toUpperCase() : investor.walletAddress.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <p className="font-medium text-charcoal dark:text-white">
                              {investor.pseudonym || formatWalletAddress(investor.walletAddress)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Joined {new Date(investor.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg text-charcoal dark:text-white">
                            {activeTab === "amount" ? formatAmount(investor.totalInvested) : `${investor.investmentCount} projects`}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {activeTab === "amount" ? `${investor.investmentCount} investments` : formatAmount(investor.totalInvested)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-charcoal to-gray-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join leading investors in funding breakthrough research that changes the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!account ? (
              <ThirdwebWalletConnection 
                variant="button-only" 
                className="bg-bitcoin-orange hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold" 
              />
            ) : (
              <Link href="/invest/dashboard">
                <Button size="lg" className="bg-bitcoin-orange hover:bg-orange-600 px-8 py-3 text-lg font-semibold">
                  Start Investing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link href="/programs">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal px-8 py-3">
                Browse Research Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}