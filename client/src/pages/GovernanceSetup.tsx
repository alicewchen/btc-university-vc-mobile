import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import WalletConnection from "@/components/WalletConnection";
import { useWeb3 } from "@/contexts/Web3Context";
import { 
  Coins, 
  Shield, 
  Users, 
  Vote, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ArrowRight,
  Target,
  Zap,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  Globe,
  Calculator
} from "lucide-react";
import { z } from "zod";

// Form schema for governance setup
const governanceSetupSchema = z.object({
  // Token Configuration
  tokenName: z.string().min(1, "Token name is required"),
  tokenSymbol: z.string().min(1, "Token symbol is required").max(5, "Symbol must be 5 characters or less"),
  initialSupply: z.number().min(1000, "Minimum supply is 1,000 tokens"),
  
  // Voting Configuration
  votingMechanism: z.string().min(1, "Voting mechanism is required"),
  proposalThreshold: z.number().min(0.1).max(50),
  quorumPercentage: z.number().min(1).max(100),
  votingPeriod: z.number().min(1).max(30),
  
  // Distribution
  founderAllocation: z.number().min(0).max(50),
  teamAllocation: z.number().min(0).max(30),
  communityAllocation: z.number().min(20).max(80),
  treasuryAllocation: z.number().min(10).max(50),
  
  // Advanced Settings
  enableTimelock: z.boolean(),
  timelockDelay: z.number().min(1).max(7),
  enableVetoRights: z.boolean(),
  vetoThreshold: z.number().min(10).max(90),
  minStakingPeriod: z.number().min(1).max(365)
});

type GovernanceSetupForm = z.infer<typeof governanceSetupSchema>;

const votingMechanisms = [
  {
    id: "simple-majority",
    name: "Simple Majority",
    description: "50% + 1 vote to pass proposals",
    pros: ["Fast decisions", "Simple to understand", "Lower gas costs"],
    cons: ["Risk of 51% attacks", "May exclude minority views"],
    bestFor: "Small, aligned teams"
  },
  {
    id: "supermajority",
    name: "Supermajority (66%)",
    description: "66% majority required to pass proposals",
    pros: ["Higher consensus", "More stable decisions", "Better minority protection"],
    cons: ["Slower decision making", "May create gridlock"],
    bestFor: "Critical protocol changes"
  },
  {
    id: "quadratic-voting",
    name: "Quadratic Voting",
    description: "Vote cost increases quadratically",
    pros: ["Prevents whale dominance", "More democratic", "Better preference expression"],
    cons: ["Complex implementation", "Higher gas costs", "Learning curve"],
    bestFor: "Diverse communities"
  },
  {
    id: "conviction-voting",
    name: "Conviction Voting",
    description: "Support builds over time",
    pros: ["No time limits", "Organic consensus", "Continuous signaling"],
    cons: ["Complex to understand", "Slower execution", "Harder to predict"],
    bestFor: "Funding decisions"
  }
];

export default function GovernanceSetup() {
  const [, setLocation] = useLocation();
  const [selectedVotingMechanism, setSelectedVotingMechanism] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const { isConnected, address } = useWeb3();

  const form = useForm<GovernanceSetupForm>({
    resolver: zodResolver(governanceSetupSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      initialSupply: 1000000,
      votingMechanism: "",
      proposalThreshold: 1,
      quorumPercentage: 30,
      votingPeriod: 7,
      founderAllocation: 15,
      teamAllocation: 15,
      communityAllocation: 50,
      treasuryAllocation: 20,
      enableTimelock: true,
      timelockDelay: 2,
      enableVetoRights: false,
      vetoThreshold: 75,
      minStakingPeriod: 30
    }
  });

  const watchedValues = form.watch();
  const totalAllocation = watchedValues.founderAllocation + watchedValues.teamAllocation + 
                          watchedValues.communityAllocation + watchedValues.treasuryAllocation;

  const onSubmit = (data: GovernanceSetupForm) => {
    console.log("Governance setup data:", data);
    // TODO: Navigate to smart contract deployment
    setLocation("/dao-deployment");
  };

  const creationSteps = [
    { step: 1, title: "Choose Template", status: "completed" },
    { step: 2, title: "Project Details", status: "completed" },
    { step: 3, title: "Governance Setup", status: "current" },
    { step: 4, title: "Smart Contract Deployment", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/create-dao")}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Project Details
          </Button>
          
          <div className="text-center">
            <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
              <Coins className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Governance Setup</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Configure your DAO's governance structure, token distribution, and voting mechanisms
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              {creationSteps.map((step) => (
                <div key={step.step} className={`text-center p-4 rounded-lg border-2 ${
                  step.status === "completed" ? "border-green-500 bg-green-50" :
                  step.status === "current" ? "border-bitcoin-orange bg-orange-50" :
                  "border-gray-200 bg-gray-50"
                }`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 text-sm font-semibold ${
                    step.status === "completed" ? "bg-green-500 text-white" :
                    step.status === "current" ? "bg-bitcoin-orange text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Configuration */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Token Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="w-5 h-5 mr-2 text-bitcoin-orange" />
                      Token Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="tokenName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Marine Research Token" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tokenSymbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Symbol</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., MRT" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="initialSupply"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Token Supply</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1000000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Total number of governance tokens to mint initially
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Voting Mechanism */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Vote className="w-5 h-5 mr-2 text-blue-600" />
                      Voting Mechanism
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {votingMechanisms.map((mechanism) => (
                        <Card 
                          key={mechanism.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedVotingMechanism === mechanism.id ? "ring-2 ring-bitcoin-orange bg-orange-50" : ""
                          }`}
                          onClick={() => {
                            setSelectedVotingMechanism(mechanism.id);
                            form.setValue("votingMechanism", mechanism.id);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{mechanism.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{mechanism.description}</p>
                                
                                <div className="grid md:grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <h5 className="font-medium text-green-700 mb-1">Pros:</h5>
                                    <ul className="space-y-1">
                                      {mechanism.pros.map((pro, index) => (
                                        <li key={index} className="flex items-center text-green-600">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          {pro}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-orange-700 mb-1">Cons:</h5>
                                    <ul className="space-y-1">
                                      {mechanism.cons.map((con, index) => (
                                        <li key={index} className="flex items-center text-orange-600">
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          {con}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                
                                <Badge variant="outline" className="mt-3">{mechanism.bestFor}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Voting Parameters */}
                {selectedVotingMechanism && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-purple-600" />
                        Voting Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="proposalThreshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proposal Threshold (%)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={50}
                                    min={0.1}
                                    step={0.1}
                                    className="w-full"
                                  />
                                  <div className="text-center text-sm text-gray-600">
                                    {field.value}% of tokens needed to create proposals
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="quorumPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quorum Requirement (%)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={100}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-center text-sm text-gray-600">
                                    {field.value}% participation required
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="votingPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voting Period (days)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={30}
                                  min={1}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600">
                                  {field.value} day{field.value !== 1 ? 's' : ''} to vote on proposals
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Token Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Token Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="founderAllocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founder Allocation (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={50}
                                  min={0}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600">{field.value}%</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="teamAllocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Allocation (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={30}
                                  min={0}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600">{field.value}%</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="communityAllocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Community Allocation (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={80}
                                  min={20}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600">{field.value}%</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="treasuryAllocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Treasury Allocation (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={50}
                                  min={10}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600">{field.value}%</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Distribution Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total Allocation:</span>
                        <span className={`font-bold ${totalAllocation === 100 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalAllocation}%
                        </span>
                      </div>
                      {totalAllocation !== 100 && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Total allocation must equal 100%
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                      Advanced Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="timelock" className="font-medium">Enable Timelock</Label>
                          <p className="text-sm text-gray-600">Delay execution of passed proposals for security</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="enableTimelock"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {watchedValues.enableTimelock && (
                        <FormField
                          control={form.control}
                          name="timelockDelay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timelock Delay (days)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={7}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-center text-sm text-gray-600">
                                    {field.value} day{field.value !== 1 ? 's' : ''} delay
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="veto" className="font-medium">Enable Veto Rights</Label>
                          <p className="text-sm text-gray-600">Allow emergency veto of dangerous proposals</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="enableVetoRights"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setLocation("/create-dao")}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Project Details
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-bitcoin-orange hover:bg-orange-600"
                    disabled={totalAllocation !== 100 || !selectedVotingMechanism || !isConnected}
                  >
                    {!isConnected ? 'Connect Wallet to Continue' : 'Continue to Deployment'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Sidebar - Preview and Tips */}
              <div className="space-y-6">
                {/* Wallet Connection */}
                <WalletConnection variant="default" showBalance={true} />

                {/* Configuration Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Calculator className="w-5 h-5 mr-2 text-bitcoin-orange" />
                      Configuration Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {watchedValues.tokenName && (
                      <div>
                        <Label className="text-sm font-medium">Token</Label>
                        <p className="text-sm text-gray-600">
                          {watchedValues.tokenName} ({watchedValues.tokenSymbol})
                        </p>
                        <p className="text-xs text-gray-500">
                          Supply: {watchedValues.initialSupply?.toLocaleString()} tokens
                        </p>
                      </div>
                    )}

                    {selectedVotingMechanism && (
                      <div>
                        <Label className="text-sm font-medium">Voting</Label>
                        <p className="text-sm text-gray-600">
                          {votingMechanisms.find(m => m.id === selectedVotingMechanism)?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {watchedValues.quorumPercentage}% quorum, {watchedValues.votingPeriod} day periods
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Security</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {watchedValues.enableTimelock && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Timelock
                          </Badge>
                        )}
                        {watchedValues.enableVetoRights && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Veto Rights
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Best Practices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Info className="w-5 h-5 mr-2 text-blue-600" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Keep founder allocation reasonable</p>
                          <p className="text-gray-600 text-xs">10-20% is typical for credibility</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Enable timelock for security</p>
                          <p className="text-gray-600 text-xs">Protects against malicious proposals</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Set appropriate quorum</p>
                          <p className="text-gray-600 text-xs">25-40% prevents low-participation votes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Consider proposal thresholds</p>
                          <p className="text-gray-600 text-xs">1-5% prevents spam proposals</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimated Costs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                      Deployment Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Token Contract</span>
                        <span className="font-medium">~0.05 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Governor Contract</span>
                        <span className="font-medium">~0.15 ETH</span>
                      </div>
                      {watchedValues.enableTimelock && (
                        <div className="flex justify-between">
                          <span>Timelock Contract</span>
                          <span className="font-medium">~0.08 ETH</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Estimated</span>
                        <span>~{(0.2 + (watchedValues.enableTimelock ? 0.08 : 0)).toFixed(2)} ETH</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        *Actual costs depend on network congestion
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}