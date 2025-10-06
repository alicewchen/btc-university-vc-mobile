import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Users, 
  DollarSign, 
  Clock, 
  Globe,
  Lightbulb,
  Shield,
  Coins,
  FileText,
  CheckCircle,
  ArrowRight,
  Plus,
  Target,
  Calendar,
  MapPin,
  Zap,
  AlertCircle
} from "lucide-react";
import React, { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateResearchDAO() {
  const { isConnected, contractService, address } = useWeb3();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationFee, setCreationFee] = useState<string>("0.01");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    researchArea: "",
    fundingGoal: "",
    duration: "",
    teamSize: "",
    location: "Global",
    tokenName: "",
    tokenSymbol: "",
    initialSupply: "1000000",
    proposalThreshold: "1000",
    votingDuration: "7",
    quorumPercentage: "10"
  });

  const daoTemplates = [
    {
      id: "conservation",
      title: "Conservation Technology DAO",
      description: "Focus on wildlife tracking, climate monitoring, and ecosystem preservation",
      icon: Globe,
      color: "bg-green-500",
      features: ["Environmental Impact Tracking", "Carbon Credit Integration", "Wildlife Data Collection"],
      fundingRange: "$50K - $500K",
      timeframe: "6-18 months"
    },
    {
      id: "blockchain",
      title: "Blockchain Infrastructure DAO",
      description: "Develop decentralized protocols, smart contracts, and Web3 infrastructure",
      icon: Shield,
      color: "bg-blue-500",
      features: ["Smart Contract Auditing", "Protocol Development", "Security Research"],
      fundingRange: "$100K - $1M",
      timeframe: "12-24 months"
    },
    {
      id: "healthcare",
      title: "Healthcare Innovation DAO",
      description: "Medical research, drug discovery, and healthcare accessibility solutions",
      icon: Zap,
      color: "bg-purple-500",
      features: ["Clinical Trial Coordination", "Drug Discovery Research", "Medical Data Analysis"],
      fundingRange: "$200K - $2M",
      timeframe: "18-36 months"
    },
    {
      id: "indigenous",
      title: "Indigenous Knowledge DAO",
      description: "Preserve traditional knowledge and support Indigenous communities",
      icon: Users,
      color: "bg-orange-500",
      features: ["Cultural Documentation", "Language Preservation", "Traditional Medicine Research"],
      fundingRange: "$25K - $250K",
      timeframe: "12-24 months"
    }
  ];

  const creationSteps = [
    {
      step: 1,
      title: "Choose Template",
      description: "Select a research area template or create a custom DAO",
      icon: Target,
      status: selectedTemplate ? "completed" : "current"
    },
    {
      step: 2,
      title: "Project Details",
      description: "Define your research goals, funding needs, and timeline",
      icon: FileText,
      status: selectedTemplate ? "current" : "pending"
    },
    {
      step: 3,
      title: "Governance Setup",
      description: "Configure voting mechanisms and token distribution",
      icon: Coins,
      status: "pending"
    },
    {
      step: 4,
      title: "Smart Contract Deployment",
      description: "Deploy your DAO smart contract with milestone-based funding",
      icon: Rocket,
      status: "pending"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Milestone-Based Funding",
      description: "Secure funding that releases automatically upon completing research milestones"
    },
    {
      icon: Users,
      title: "Global Collaboration",
      description: "Connect with researchers worldwide through our intelligent matching system"
    },
    {
      icon: Shield,
      title: "Transparent Governance",
      description: "Community-driven decision making with blockchain-verified voting"
    },
    {
      icon: Lightbulb,
      title: "IP-NFT Integration",
      description: "Tokenize your research output and maintain ownership through blockchain"
    },
    {
      icon: Globe,
      title: "Nature Reserve Access",
      description: "Conduct field research at our 15 protected conservation sites globally"
    },
    {
      icon: CheckCircle,
      title: "Verified Credentials",
      description: "Blockchain-certified research achievements and publication records"
    }
  ];

  const handleSubmit = async () => {
    await handleCreateDAO();
  };

  const handleCreateDAO = async () => {
    if (!isConnected || !contractService) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a DAO",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in DAO name and description",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);

      // Set default values based on template if not provided
      const tokenName = formData.tokenName || `${formData.name} Token`;
      const tokenSymbol = formData.tokenSymbol || formData.name.substring(0, 4).toUpperCase();

      // Check if name is available
      const isAvailable = await contractService.isNameAvailable(formData.name);
      if (!isAvailable) {
        toast({
          title: "Name Unavailable",
          description: "This DAO name is already taken. Please choose another.",
          variant: "destructive"
        });
        return;
      }

      // Create the DAO on-chain
      const result = await contractService.createResearchDAO({
        tokenName,
        tokenSymbol,
        daoName: formData.name,
        description: formData.description,
        researchFocus: formData.researchArea || selectedTemplate,
        initialSupply: formData.initialSupply,
        proposalThreshold: formData.proposalThreshold,
        votingDuration: parseInt(formData.votingDuration),
        quorumPercentage: parseInt(formData.quorumPercentage)
      });

      toast({
        title: "DAO Created Successfully!",
        description: `Your research DAO "${formData.name}" has been deployed to ${result.daoAddress}`,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        researchArea: "",
        fundingGoal: "",
        duration: "",
        teamSize: "",
        location: "Global",
        tokenName: "",
        tokenSymbol: "",
        initialSupply: "1000000",
        proposalThreshold: "1000",
        votingDuration: "7",
        quorumPercentage: "10"
      });
      setSelectedTemplate("");

    } catch (error: any) {
      console.error('Error creating DAO:', error);
      toast({
        title: "Creation Failed",
        description: error.reason || error.message || "Failed to create DAO. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Get creation fee on component mount
  React.useEffect(() => {
    if (contractService) {
      contractService.getCreationFee().then(fee => {
        setCreationFee(fee);
      }).catch(console.error);
    }
  }, [contractService]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-20 bg-[#000000]">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-200 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-orange-200 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full blur-lg"></div>
              <Rocket className="relative w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Create Your Own Research DAO
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Launch a decentralized research organization with smart contract governance, 
              milestone-based funding, and global collaboration capabilities
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                🔗 Smart Contract Governance
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                💰 Milestone-Based Funding
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                🌍 Global Collaboration
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                🔬 Research Excellence
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Creation Progress */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Clock className="w-6 h-6 mr-3 text-bitcoin-orange" />
              DAO Creation Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {creationSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.step} className={`text-center p-4 rounded-lg border-2 ${
                    step.status === "completed" ? "border-green-500 bg-green-50" :
                    step.status === "current" ? "border-bitcoin-orange bg-orange-50" :
                    "border-gray-200 bg-gray-50"
                  }`}>
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      step.status === "completed" ? "bg-green-500 text-white" :
                      step.status === "current" ? "bg-bitcoin-orange text-white" :
                      "bg-gray-300 text-gray-600"
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold mb-2">Step {step.step}: {step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Templates and Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Choose Template */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Target className="w-6 h-6 mr-3 text-bitcoin-orange" />
                  Step 1: Choose Your Research Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {daoTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedTemplate === template.id ? "ring-2 ring-bitcoin-orange bg-orange-50" : ""
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${template.color} text-white`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{template.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                              
                              <div className="space-y-2 mb-3">
                                {template.features.map((feature, index) => (
                                  <div key={index} className="flex items-center text-xs text-gray-500">
                                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex justify-between text-xs">
                                <Badge variant="outline">{template.fundingRange}</Badge>
                                <Badge variant="outline">{template.timeframe}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Project Details */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-bitcoin-orange" />
                    Step 2: Define Your Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dao-name">DAO Name</Label>
                        <Input 
                          id="dao-name"
                          placeholder="e.g. Marine Conservation Research DAO"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="research-area">Specific Research Area</Label>
                        <Input 
                          id="research-area"
                          placeholder="e.g. Coral Reef Restoration Technology"
                          value={formData.researchArea}
                          onChange={(e) => setFormData(prev => ({...prev, researchArea: e.target.value}))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="funding-goal">Funding Goal (ETH)</Label>
                        <Input 
                          id="funding-goal"
                          placeholder="e.g. 100 ETH"
                          value={formData.fundingGoal}
                          onChange={(e) => setFormData(prev => ({...prev, fundingGoal: e.target.value}))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="duration">Project Duration</Label>
                        <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({...prev, duration: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6-months">6 months</SelectItem>
                            <SelectItem value="12-months">12 months</SelectItem>
                            <SelectItem value="18-months">18 months</SelectItem>
                            <SelectItem value="24-months">24 months</SelectItem>
                            <SelectItem value="36-months">36 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="team-size">Expected Team Size</Label>
                        <Select value={formData.teamSize} onValueChange={(value) => setFormData(prev => ({...prev, teamSize: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5-10">5-10 researchers</SelectItem>
                            <SelectItem value="10-20">10-20 researchers</SelectItem>
                            <SelectItem value="20-50">20-50 researchers</SelectItem>
                            <SelectItem value="50+">50+ researchers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Primary Location</Label>
                        <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({...prev, location: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Global">Global (Remote)</SelectItem>
                            <SelectItem value="Americas">Americas Region</SelectItem>
                            <SelectItem value="Europe">Europe Region</SelectItem>
                            <SelectItem value="Asia-Pacific">Asia-Pacific Region</SelectItem>
                            <SelectItem value="Africa">Africa Region</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe your research goals, methodology, expected outcomes, and impact..."
                      className="mt-2 min-h-[120px]"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setSelectedTemplate("")}>
                      Back to Templates
                    </Button>
                    {!isConnected ? (
                      <Alert className="flex-1 ml-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please connect your wallet to create a DAO
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Button 
                        className="bg-bitcoin-orange hover:bg-orange-600"
                        onClick={handleSubmit}
                        disabled={isCreating}
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        {isCreating ? "Creating DAO..." : `Deploy DAO (${creationFee} ETH)`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Benefits and Info */}
          <div className="space-y-8">
            {/* Why Create a Research DAO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-bitcoin-orange" />
                  Why Research DAOs?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-bitcoin-orange bg-opacity-10 rounded-lg">
                          <IconComponent className="w-4 h-4 text-bitcoin-orange" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{benefit.title}</h4>
                          <p className="text-xs text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-sm text-green-800 mb-2">Ocean Plastic Research DAO</h4>
                    <p className="text-xs text-green-700 mb-2">
                      Developed blockchain-tracked ocean cleanup technology, raised 500 ETH, 
                      removed 10,000 tons of plastic waste.
                    </p>
                    <Badge className="bg-green-100 text-green-800 text-xs">Completed Successfully</Badge>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-blue-800 mb-2">Quantum Cryptography DAO</h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Advanced post-quantum cryptography research, 1000 ETH funding, 
                      3 published papers in top journals.
                    </p>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Active - Phase 2</Badge>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-sm text-purple-800 mb-2">Indigenous Medicine DAO</h4>
                    <p className="text-xs text-purple-700 mb-2">
                      Documented 50+ traditional remedies, created digital preservation system, 
                      supported 12 Indigenous communities.
                    </p>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">Milestone 3 of 4</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Users className="w-5 h-5 mr-2 text-bitcoin-orange" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Our DAO creation experts are here to help you launch successfully.
                </p>
                <Button variant="outline" className="w-full mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}