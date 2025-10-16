import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { apiRequest } from "@/lib/queryClient";
import { signAuthMessage } from "@/lib/auth";
import { client, wallets, ConnectButton } from "@/lib/thirdweb";
import { 
  Heart,
  X,
  ArrowUp,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  Zap,
  ShoppingCart
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

interface InvestmentOpportunity {
  id: string;
  type: "dao" | "grant" | "scholarship";
  title: string;
  description: string;
  fundingGoal: number;
  fundingRaised: number;
  category: string;
  image?: string;
  deadline?: string;
  timeline?: string;
  impact?: string;
  urgency?: "low" | "medium" | "high" | "urgent";
  memberCount?: number;
  location?: string;
}

interface InvestorPreferences {
  preferredAmounts: string[];
  defaultAmount: string;
  preferredCurrency: string;
  quickFundRange: string;
}

const ENABLE_INVESTMENT_MOCKS =
  import.meta.env.DEV && import.meta.env["VITE_ENABLE_INVESTMENT_MOCKS"] !== "false";

const MOCK_INVESTOR_PREFERENCES: InvestorPreferences = {
  preferredAmounts: ["250", "500", "1000", "2500"],
  defaultAmount: "250",
  preferredCurrency: "USD",
  quickFundRange: "professional_investor",
};

const MOCK_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: "mock-dao-1",
    type: "dao",
    title: "Solar Commons Research Collective",
    description:
      "Scaling community-owned solar grids to power rural universities across Latin America.",
    fundingGoal: 500000,
    fundingRaised: 175000,
    category: "Clean Energy",
    impact:
      "Deploy 12 microgrid pilots delivering reliable power to 40,000 students while generating open data sets.",
    timeline: "Phase 1 deployment complete; expansion ready for Q2 2025.",
    urgency: "high",
    memberCount: 48,
    location: "Latin America",
  },
  {
    id: "mock-grant-1",
    type: "grant",
    title: "Bitcoin University AI Research Fellows",
    description:
      "12-month fellowship funding AI researchers tackling decentralized learning and privacy.",
    fundingGoal: 350000,
    fundingRaised: 82000,
    category: "AI Research",
    impact:
      "Fund five fellows to produce open-source tooling for decentralized education and grant a public dataset.",
    deadline: "Applications close March 30, 2025",
    urgency: "medium",
    location: "Global",
  },
  {
    id: "mock-scholarship-1",
    type: "scholarship",
    title: "Women in Bitcoin Engineering Scholarships",
    description:
      "Scholarships for emerging women engineers building Bitcoin infrastructure and developer tooling.",
    fundingGoal: 150000,
    fundingRaised: 94000,
    category: "Scholarship",
    impact:
      "Support 25 scholars with stipends, mentorship, and placements in partner Bitcoin labs.",
    timeline: "Program kickoff July 2025; mentorship runs for 9 months.",
    urgency: "urgent",
    location: "North America & Europe",
  },
];

export default function SwipeInvesting() {
  const account = useActiveAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addItem } = useShoppingCart();
  const inDemoMode = !account?.address && ENABLE_INVESTMENT_MOCKS;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const resolveCurrencySymbol = (currency?: string) => {
    if (currency === "ETH") return "Ξ";
    if (currency === "BTC") return "₿";
    return "$";
  };

  // Fetch investor preferences
  const { data: fetchedPreferences } = useQuery({
    queryKey: ["/api/investor-preferences", account?.address],
    queryFn: async (): Promise<InvestorPreferences> => {
      if (!account?.address) throw new Error("Wallet not connected");
      const response = await fetch(`/api/investor-preferences/${account.address}`);
      if (!response.ok) throw new Error("Preferences not found");
      return response.json();
    },
    enabled: !!account?.address,
    retry: false,
  });

  const preferences =
    fetchedPreferences ??
    (ENABLE_INVESTMENT_MOCKS ? MOCK_INVESTOR_PREFERENCES : undefined);

  // Fetch swipe opportunities from API
  const {
    data: fetchedOpportunities = [],
    isLoading: remoteOpportunitiesLoading,
    error: remoteOpportunitiesError,
  } = useQuery<InvestmentOpportunity[]>({
    queryKey: ["/api/swipe-opportunities"],
    enabled: !inDemoMode,
    retry: ENABLE_INVESTMENT_MOCKS ? 0 : 1,
    queryFn: async () => {
      const response = await fetch("/api/swipe-opportunities");
      if (!response.ok) {
        throw new Error(`Failed to load opportunities (${response.status})`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        if (ENABLE_INVESTMENT_MOCKS) {
          return MOCK_OPPORTUNITIES;
        }
        return [];
      }
      return data;
    },
  });

  const shouldUseMockOpportunities =
    inDemoMode || (!!remoteOpportunitiesError && ENABLE_INVESTMENT_MOCKS);
  const opportunities = shouldUseMockOpportunities
    ? MOCK_OPPORTUNITIES
    : fetchedOpportunities;
  const opportunitiesLoading = shouldUseMockOpportunities
    ? false
    : remoteOpportunitiesLoading;
  const opportunitiesError = shouldUseMockOpportunities
    ? null
    : remoteOpportunitiesError;

  const canTransact = !!account?.address;

  // Investment mutation for instant funding (up swipe)
  const investMutation = useMutation({
    mutationFn: async ({ opportunity, amount }: { opportunity: InvestmentOpportunity; amount: string }) => {
      if (!account?.address) throw new Error("Wallet not connected");
      const signedAuth = await signAuthMessage(account);
      
      return apiRequest("POST", "/api/investments", {
        targetType: opportunity.type,
        targetId: opportunity.id,
        amount,
        currency: preferences?.preferredCurrency || "ETH",
        ...signedAuth
      });
    },
    onSuccess: (_, { opportunity, amount }) => {
      const currencySymbol = resolveCurrencySymbol(
        preferences?.preferredCurrency,
      );
      toast({
        title: "🚀 Instant Investment Successful!",
        description: `Invested ${currencySymbol}${amount} in ${opportunity.title}`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/investors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      
      // Move to next card
      nextCard();
    },
    onError: (error) => {
      console.error("Investment error:", error);
      toast({
        title: "Investment Failed",
        description: "There was an issue processing your investment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const currentOpportunity = opportunities[currentIndex];
  const hasMore = currentIndex < opportunities.length - 1;

  const nextCard = () => {
    if (hasMore) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Handle loading state
  if (opportunitiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bitcoin-orange mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Loading Opportunities</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Finding the best investment opportunities for you...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle error state
  if (opportunitiesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Unable to Load Opportunities</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error loading investment opportunities. Please try again.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-bitcoin-orange hover:bg-orange-600"
              data-testid="retry-button"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resetCard = () => {
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsDragging(false);
  };

  // Touch/Mouse event handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    currentPos.current = { x: clientX, y: clientY };
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Determine swipe direction based on dominant axis
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else if (deltaY < -50) { // Upward swipe threshold
      setSwipeDirection("up");
    }
  };

  const handleEnd = () => {
    if (!isDragging || !currentOpportunity) return;
    
    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Right swipe - show amount selection
        handleRightSwipe(currentOpportunity);
      } else {
        // Left swipe - pass
        handleLeftSwipe();
      }
    } else if (deltaY < -threshold) {
      // Up swipe - instant fund
      handleUpSwipe(currentOpportunity);
    } else {
      // Not enough movement - reset card
      resetCard();
    }
  };

  const handleLeftSwipe = () => {
    toast({
      title: "⏭️ Passed",
      description: "Moving to next opportunity",
    });
    nextCard();
    resetCard();
  };

  const handleRightSwipe = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowAmountModal(true);
    resetCard();
  };

  const handleQuickAddToCart = (opportunity: InvestmentOpportunity, amount: number) => {
    const currency = preferences?.preferredCurrency || "USD";
    const symbol = resolveCurrencySymbol(currency);

    addItem({
      targetType: opportunity.type,
      targetId: opportunity.id,
      targetName: opportunity.title,
      amount: amount.toString(),
      currency,
      description: opportunity.description,
    });
    
    toast({
      title: "🛒 Added to Cart!",
      description: `${symbol}${amount.toLocaleString()} investment in ${opportunity.title}`,
    });
    
    setShowAmountModal(false);
  };

  const handleUpSwipe = (opportunity: InvestmentOpportunity) => {
    if (!canTransact) {
      toast({
        title: "Demo Mode",
        description: "Connect your wallet to invest instantly.",
      });
      resetCard();
      return;
    }

    const amount = preferences?.defaultAmount || "100";
    investMutation.mutate({ opportunity, amount });
    resetCard();
  };

  const handleAddToCart = () => {
    if (!selectedOpportunity || !selectedAmount) return;
    
    const currency = preferences?.preferredCurrency || "ETH";
    const symbol = resolveCurrencySymbol(currency);

    addItem({
      targetType: selectedOpportunity.type,
      targetId: selectedOpportunity.id,
      targetName: selectedOpportunity.title,
      amount: selectedAmount,
      currency,
      description: selectedOpportunity.description,
    });
    
    toast({
      title: "🛒 Added to Cart",
      description: `${selectedOpportunity.title} added with ${symbol}${selectedAmount}`,
    });
    
    setShowAmountModal(false);
    nextCard();
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getFundingProgress = (raised: number, goal: number) => {
    return Math.round((raised / goal) * 100);
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dao": return <Users className="w-4 h-4" />;
      case "grant": return <Target className="w-4 h-4" />;
      case "scholarship": return <TrendingUp className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  if (!canTransact && !shouldUseMockOpportunities) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Zap className="w-16 h-16 text-bitcoin-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to start swiping through investment opportunities
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

  if (!currentOpportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Heart className="w-16 h-16 text-bitcoin-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">You're All Caught Up!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No more investment opportunities right now. Check back later for new projects!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Card Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-md h-[calc(100vh-120px)]">
          {/* Current Card */}
          <div
            ref={cardRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              opacity: Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300)
            }}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            data-testid={`swipe-card-${currentOpportunity.id}`}
          >
            <Card className="h-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
              {/* Swipe Direction Indicator */}
              {swipeDirection && (
                <div className={`absolute inset-0 pointer-events-none flex items-center justify-center z-10 ${
                  swipeDirection === 'left' ? 'bg-gradient-to-r from-red-500/30 to-transparent' :
                  swipeDirection === 'right' ? 'bg-gradient-to-l from-green-500/30 to-transparent' :
                  'bg-gradient-to-b from-blue-500/30 to-transparent'
                }`}>
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    swipeDirection === 'left' ? 'bg-red-500/90 text-white' :
                    swipeDirection === 'right' ? 'bg-green-500/90 text-white' :
                    'bg-blue-500/90 text-white'
                  }`}>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      {swipeDirection === 'left' ? <X className="w-8 h-8" /> :
                       swipeDirection === 'right' ? <ShoppingCart className="w-8 h-8" /> :
                       <Zap className="w-8 h-8" />}
                      {swipeDirection === 'left' ? 'PASS' :
                       swipeDirection === 'right' ? 'CART' :
                       'FUND'}
                    </div>
                  </div>
                </div>
              )}

              <CardContent className="h-full p-0 flex flex-col">
                {/* Header */}
                <div className="p-6 pb-4 flex-shrink-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getTypeIcon(currentOpportunity.type)}
                        {currentOpportunity.type.toUpperCase()}
                      </Badge>
                      <Badge className={getUrgencyColor(currentOpportunity.urgency)}>
                        {currentOpportunity.urgency}
                      </Badge>
                    </div>
                    <Badge variant="outline">{currentOpportunity.category}</Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {currentOpportunity.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {currentOpportunity.description}
                  </p>
                </div>

                {/* Funding Progress */}
                <div className="px-6 pb-4 flex-shrink-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Funding Progress</span>
                      <span className="font-semibold">
                        {getFundingProgress(currentOpportunity.fundingRaised, currentOpportunity.fundingGoal)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-bitcoin-orange h-2 rounded-full" 
                        style={{ 
                          width: `${getFundingProgress(currentOpportunity.fundingRaised, currentOpportunity.fundingGoal)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-600">
                        {formatAmount(currentOpportunity.fundingRaised)} raised
                      </span>
                      <span className="text-gray-500">
                        Goal: {formatAmount(currentOpportunity.fundingGoal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 flex-grow space-y-4">
                  {currentOpportunity.impact && (
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-bitcoin-orange mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Expected Impact</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {currentOpportunity.impact}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentOpportunity.timeline && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-bitcoin-orange mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Timeline</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {currentOpportunity.timeline}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentOpportunity.deadline && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-red-600">Application Deadline</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {currentOpportunity.deadline}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentOpportunity.memberCount && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-bitcoin-orange mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Members</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {currentOpportunity.memberCount} active members
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with progress indicator */}
                <div className="p-6 pt-4 flex-shrink-0">
                  <div className="text-center text-sm text-gray-500">
                    {currentIndex + 1} of {opportunities.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Card Preview (if available) */}
          {hasMore && (
            <div 
              className="absolute inset-0 -z-10"
              style={{
                transform: 'scale(0.95) translateY(10px)',
                opacity: 0.5
              }}
            >
              <Card className="h-full bg-white dark:bg-gray-700 shadow-lg rounded-2xl">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <p>Next opportunity</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add to Cart Modal */}
      <Dialog open={showAmountModal} onOpenChange={setShowAmountModal}>
        <DialogContent className="w-11/12 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-bitcoin-orange" />
              Quick Add to Cart
            </DialogTitle>
            <DialogDescription>
              Tap an amount to add {selectedOpportunity?.title} to your cart
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preset Amount Buttons for Cart */}
            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const selectedTier = preferences?.quickFundRange || 'individual_supporter';
                const tierAmounts = FUNDING_TIERS[selectedTier as keyof typeof FUNDING_TIERS]?.amounts || FUNDING_TIERS.individual_supporter.amounts;
                
                return tierAmounts.map((amount, index) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => selectedOpportunity && handleQuickAddToCart(selectedOpportunity, amount)}
                    className="p-4 h-16 text-lg font-semibold bg-gradient-to-r from-bitcoin-orange/5 to-orange-100/30 hover:from-bitcoin-orange/10 hover:to-orange-100/50 border-bitcoin-orange/20 hover:border-bitcoin-orange/40 transition-all duration-200"
                    data-testid={`quick-cart-${amount}`}
                  >
                    <div className="text-center">
                      <div className="text-bitcoin-orange font-bold">
                        ${amount >= 1000000 
                          ? `${(amount / 1000000).toFixed(1)}M` 
                          : amount >= 1000 
                          ? `${(amount / 1000).toFixed(0)}K` 
                          : amount.toLocaleString()
                        }
                      </div>
                      <div className="text-xs text-gray-600">Add to Cart</div>
                    </div>
                  </Button>
                ));
              })()}
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                💡 Amounts based on your {FUNDING_TIERS[preferences?.quickFundRange as keyof typeof FUNDING_TIERS || 'individual_supporter']?.label} tier
              </p>
            </div>

            {/* Cancel Button */}
            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowAmountModal(false)}
                className="w-full"
                data-testid="cancel-quick-cart"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
