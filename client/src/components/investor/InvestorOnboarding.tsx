import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActiveAccount } from "thirdweb/react";
import { apiRequest } from "@/lib/queryClient";
import { signAuthMessage, createAuthenticatedRequest } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";
import { 
  User, 
  DollarSign, 
  Target, 
  Shield, 
  Award,
  Eye,
  EyeOff,
  Globe,
  Lightbulb,
  TrendingUp
} from "lucide-react";

const investorOnboardingSchema = z.object({
  pseudonym: z.string().optional(),
  interests: z.array(z.string()).default([]),
  quickFundRange: z.enum(["range1", "range2", "range3", "range4"]),
  preferredAmounts: z.array(z.string()).min(1, "Select at least one preferred amount"),
  defaultAmount: z.string().min(1, "Default amount is required"),
  preferredCurrency: z.enum(["ETH", "USDC", "DAI"]),
  riskTolerance: z.enum(["low", "medium", "high"]),
  showOnLeaderboard: z.boolean(),
  autoInvestEnabled: z.boolean()
});

type OnboardingFormData = z.infer<typeof investorOnboardingSchema>;

interface InvestorOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export default function InvestorOnboarding({ open, onOpenChange, onComplete }: InvestorOnboardingProps) {
  const account = useActiveAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(investorOnboardingSchema),
    defaultValues: {
      pseudonym: "",
      interests: [],
      quickFundRange: "range1",
      preferredAmounts: [],
      defaultAmount: "",
      preferredCurrency: "ETH",
      riskTolerance: "medium",
      showOnLeaderboard: false,
      autoInvestEnabled: false
    }
  });

  // Investment range configurations
  const investmentRanges = [
    {
      id: "range1",
      label: "Individual Supporter",
      description: "Perfect for individual contributions",
      amounts: ["25", "50", "100", "250"],
      icon: User
    },
    {
      id: "range2", 
      label: "Professional Investor",
      description: "For professional individuals and small offices",
      amounts: ["100", "500", "1000", "2500"],
      icon: TrendingUp
    },
    {
      id: "range3",
      label: "MicroVC",
      description: "Micro venture capital and angel syndicates",
      amounts: ["25000", "100000", "250000", "500000"],
      icon: Award
    },
    {
      id: "range4",
      label: "Institutional",
      description: "Universities, foundations, and major VCs",
      amounts: ["1000000", "2500000", "5000000", "10000000"],
      icon: Globe
    }
  ];

  // Research interest categories
  const interestCategories = [
    "Climate Science", "Ocean Conservation", "Renewable Energy", "Carbon Capture",
    "Biodiversity", "Sustainable Agriculture", "Clean Technology", "Environmental Policy",
    "Indigenous Knowledge", "Conservation Biology", "Green Chemistry", "Ecosystem Restoration"
  ];

  // Format currency amounts
  const formatAmount = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Create investor profile mutation
  const createInvestorMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      if (!account?.address) throw new Error("Wallet not connected");

      try {
        // Sign authentication message
        const signedAuth = await signAuthMessage({ account });
        console.log("Signed authentication for onboarding:", signedAuth);

        // Create investor profile with signature
        const investorData = {
          walletAddress: account.address,
          pseudonym: data.pseudonym || null,
          profileCompleted: true,
          showOnLeaderboard: data.showOnLeaderboard,
          totalInvested: "0.00",
          investmentCount: 0
        };
        const investorResponse = await apiRequest("POST", "/api/investors", createAuthenticatedRequest(investorData, signedAuth));

        // Create investor preferences with signature
        const preferencesData = {
          walletAddress: account.address,
          quickFundRange: data.quickFundRange,
          preferredAmounts: data.preferredAmounts,
          defaultAmount: data.defaultAmount,
          preferredCurrency: data.preferredCurrency,
          interests: data.interests,
          riskTolerance: data.riskTolerance,
          autoInvestEnabled: data.autoInvestEnabled
        };
        
        // Use same signed auth for preferences (they should be created in same session)
        const preferencesResponse = await apiRequest("POST", "/api/investor-preferences", createAuthenticatedRequest(preferencesData, signedAuth));

        return { investor: await investorResponse.json(), preferences: await preferencesResponse.json() };
      } catch (error) {
        console.error("Onboarding mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Investor Community!",
        description: "Your profile has been created successfully. Start funding breakthrough research!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investors"] });
      onOpenChange(false);
      onComplete?.();
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
      toast({
        title: "Profile Creation Failed",
        description: "There was an issue creating your investor profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: OnboardingFormData) => {
    createInvestorMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = form.getValues("interests");
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    form.setValue("interests", newInterests);
  };

  const handleAmountToggle = (amount: string) => {
    const currentAmounts = form.getValues("preferredAmounts");
    const newAmounts = currentAmounts.includes(amount)
      ? currentAmounts.filter(a => a !== amount)
      : [...currentAmounts, amount];
    form.setValue("preferredAmounts", newAmounts);
    
    // Auto-set default amount if this is the first selection
    if (newAmounts.length === 1 && !form.getValues("defaultAmount")) {
      form.setValue("defaultAmount", amount);
    }
  };

  const getSelectedRange = () => {
    return investmentRanges.find(range => range.id === form.watch("quickFundRange"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-bitcoin-orange" />
            Welcome to the Investor Community
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? "bg-bitcoin-orange text-white" 
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i + 1 < currentStep ? "bg-bitcoin-orange" : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Basic Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
                      Set Up Your Profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Let's start with some basic information (all optional)
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="pseudonym"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Display Name (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a display name for the leaderboard"
                            data-testid="input-pseudonym"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown instead of your wallet address on the public leaderboard
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showOnLeaderboard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            {field.value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            Show on Leaderboard
                          </FormLabel>
                          <FormDescription>
                            Display your investments on the public investor leaderboard
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-show-leaderboard"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Research Interests */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
                      Research Interests
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select areas of research you're interested in funding (optional)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestCategories.map(interest => (
                      <div
                        key={interest}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          form.watch("interests").includes(interest)
                            ? "bg-bitcoin-orange text-white border-bitcoin-orange"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-bitcoin-orange"
                        }`}
                        onClick={() => handleInterestToggle(interest)}
                        data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-sm font-medium">{interest}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {form.watch("interests").length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Great! We'll prioritize showing you opportunities in: {form.watch("interests").join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Investment Range */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
                      Quick Fund Range
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose your preferred investment range for one-click funding
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investmentRanges.map(range => {
                      const Icon = range.icon;
                      const isSelected = form.watch("quickFundRange") === range.id;
                      
                      return (
                        <Card 
                          key={range.id}
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? "ring-2 ring-bitcoin-orange border-bitcoin-orange" 
                              : "hover:border-bitcoin-orange"
                          }`}
                          onClick={() => {
                            form.setValue("quickFundRange", range.id as any);
                            form.setValue("preferredAmounts", []);
                            form.setValue("defaultAmount", "");
                          }}
                          data-testid={`range-${range.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                isSelected 
                                  ? "bg-bitcoin-orange text-white" 
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-charcoal dark:text-white mb-1">
                                  {range.label}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {range.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {range.amounts.map(amount => (
                                    <Badge key={amount} variant="secondary" className="text-xs">
                                      {formatAmount(amount)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
                      Investment Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Customize your Quick Fund buttons and preferences
                    </p>
                  </div>

                  {/* Quick Fund Amounts */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-charcoal dark:text-white">
                      Select Your Quick Fund Amounts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose 2-4 amounts for your one-click funding buttons
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getSelectedRange()?.amounts.map(amount => (
                        <div
                          key={amount}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            form.watch("preferredAmounts").includes(amount)
                              ? "bg-bitcoin-orange text-white border-bitcoin-orange"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-bitcoin-orange"
                          }`}
                          onClick={() => handleAmountToggle(amount)}
                          data-testid={`amount-${amount}`}
                        >
                          <div className="text-center">
                            <DollarSign className="w-5 h-5 mx-auto mb-1" />
                            <div className="font-semibold">{formatAmount(amount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Default Amount */}
                  {form.watch("preferredAmounts").length > 0 && (
                    <FormField
                      control={form.control}
                      name="defaultAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Quick Fund Amount</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-default-amount">
                                <SelectValue placeholder="Choose your primary amount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {form.watch("preferredAmounts").map(amount => (
                                <SelectItem key={amount} value={amount}>
                                  {formatAmount(amount)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This will be highlighted as your main funding button
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Currency Preference */}
                  <FormField
                    control={form.control}
                    name="preferredCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                            <SelectItem value="DAI">Dai Stablecoin (DAI)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Risk Tolerance */}
                  <FormField
                    control={form.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Tolerance</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-risk-tolerance">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Conservative - Established research</SelectItem>
                            <SelectItem value="medium">Balanced - Mix of established and emerging</SelectItem>
                            <SelectItem value="high">Aggressive - Early-stage and experimental</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  data-testid="button-previous"
                >
                  Previous
                </Button>
                
                <div className="flex gap-3">
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-bitcoin-orange hover:bg-orange-600"
                      data-testid="button-next"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-bitcoin-orange hover:bg-orange-600"
                      disabled={createInvestorMutation.isPending}
                      data-testid="button-complete"
                    >
                      {createInvestorMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                      Complete Setup
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}