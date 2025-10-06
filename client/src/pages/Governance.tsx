import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Vote, 
  Coins, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp,
  Wallet,
  Target,
  Calendar,
  Award
} from "lucide-react";

const governanceStats = {
  totalSupply: "100,000,000",
  circulatingSupply: "65,000,000",
  marketCap: "$12.5M",
  holders: "8,247",
  totalProposals: 47,
  activeProposals: 8,
  passedProposals: 32,
  rejectedProposals: 7
};

const activeProposals = [
  {
    id: "BU-P-001",
    title: "Expand Research Funding for Indigenous Knowledge Systems",
    description: "Allocate additional 2M BITUNI tokens from treasury to support Indigenous-led research projects across all nature reserves.",
    proposer: "Dr. Angela Crow Feather",
    proposalType: "Treasury",
    votingPower: "2,450,000 BITUNI",
    forVotes: "1,890,000",
    againstVotes: "180,000",
    abstainVotes: "45,000",
    quorum: "85%",
    timeRemaining: "3 days, 14 hours",
    status: "Active",
    category: "Funding"
  },
  {
    id: "BU-P-002", 
    title: "Implement Carbon Credit Trading Protocol",
    description: "Deploy smart contracts for automated carbon credit verification and trading across all ETH Nature Reserve sites.",
    proposer: "Conservation Tech DAO",
    proposalType: "Protocol",
    votingPower: "1,820,000 BITUNI",
    forVotes: "1,200,000",
    againstVotes: "320,000",
    abstainVotes: "85,000",
    quorum: "72%",
    timeRemaining: "1 day, 8 hours",
    status: "Active",
    category: "Technology"
  },
  {
    id: "BU-P-003",
    title: "Partnership with Global Indigenous Council",
    description: "Establish formal partnership and allocate 500K BITUNI for collaborative governance with Indigenous communities worldwide.",
    proposer: "Elder Mary Crow Dog",
    proposalType: "Partnership",
    votingPower: "1,650,000 BITUNI",
    forVotes: "1,450,000",
    againstVotes: "95,000",
    abstainVotes: "105,000",
    quorum: "92%",
    timeRemaining: "5 days, 22 hours",
    status: "Active",
    category: "Governance"
  },
  {
    id: "BU-P-004",
    title: "Quantum Research Lab Equipment Upgrade",
    description: "Purchase advanced quantum computing hardware for cryptography research program - 1.5M BITUNI allocation.",
    proposer: "Quantum-Enhanced Crypto DAO",
    proposalType: "Treasury",
    votingPower: "980,000 BITUNI",
    forVotes: "720,000",
    againstVotes: "180,000",
    abstainVotes: "80,000",
    quorum: "68%",
    timeRemaining: "2 days, 16 hours",
    status: "Active",
    category: "Research"
  }
];

const recentProposals = [
  {
    id: "BU-P-045",
    title: "Establish DeSci Publication Platform",
    result: "Passed",
    finalVotes: "3.2M BITUNI",
    passRate: "78%",
    implementedDate: "January 28, 2025"
  },
  {
    id: "BU-P-044",
    title: "Biodiversity Token Standards (ERC-1155)",
    result: "Passed", 
    finalVotes: "2.8M BITUNI",
    passRate: "84%",
    implementedDate: "January 25, 2025"
  },
  {
    id: "BU-P-043",
    title: "Increase Platform Fee to 1.5%",
    result: "Rejected",
    finalVotes: "2.1M BITUNI", 
    passRate: "32%",
    implementedDate: "January 22, 2025"
  }
];

const treasuryInfo = {
  totalTreasury: "25,000,000 BITUNI",
  allocatedFunds: "18,500,000 BITUNI",
  availableFunds: "6,500,000 BITUNI",
  monthlyBurn: "450,000 BITUNI",
  reserveRatio: "26%"
};

const stakingInfo = {
  totalStaked: "32,000,000 BITUNI",
  stakingAPY: "8.5%",
  averageStakingPeriod: "180 days",
  totalStakers: "3,247",
  minimumStake: "1,000 BITUNI"
};

export default function Governance() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-blue-100 text-blue-800";
      case "Passed": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Funding": return "bg-green-50 text-green-700 border-green-200";
      case "Technology": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Governance": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Research": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Coins className="w-8 h-8 text-bitcoin-orange" />
            <h1 className="text-4xl font-bold text-charcoal">Bitcoin University Governance</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participate in decentralized governance of Bitcoin University through BITUNI token voting. 
            Shape the future of conservation research, education, and Indigenous partnerships.
          </p>
        </div>

        {/* BITUNI Token Overview */}
        <Card className="mb-12 bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Coins className="w-8 h-8 mr-3" />
                  BITUNI Token
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  The native governance token of Bitcoin University, enabling community-driven 
                  decision making for research funding, partnerships, and platform development.
                </p>
                <div className="flex space-x-4">
                  <Button variant="secondary" className="bg-white text-bitcoin-orange hover:bg-gray-100">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-bitcoin-orange">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Chart
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{governanceStats.totalSupply}</div>
                  <div className="text-sm opacity-80">Total Supply</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{governanceStats.marketCap}</div>
                  <div className="text-sm opacity-80">Market Cap</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{governanceStats.holders}</div>
                  <div className="text-sm opacity-80">Token Holders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{governanceStats.totalProposals}</div>
                  <div className="text-sm opacity-80">Total Proposals</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Vote className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{governanceStats.activeProposals}</div>
              <div className="text-sm text-gray-600">Active Proposals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">{governanceStats.passedProposals}</div>
              <div className="text-sm text-gray-600">Passed Proposals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">{stakingInfo.totalStakers}</div>
              <div className="text-sm text-gray-600">Active Voters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-3xl font-bold text-bitcoin-orange mb-2">{stakingInfo.stakingAPY}</div>
              <div className="text-sm text-gray-600">Staking APY</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Governance Interface */}
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
            <TabsTrigger value="history">Proposal History</TabsTrigger>
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
          </TabsList>

          {/* Active Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-charcoal">Active Proposals</h3>
              <Button className="bg-bitcoin-orange hover:bg-orange-600">
                <Vote className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </div>

            <div className="space-y-6">
              {activeProposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={`text-xs ${getCategoryColor(proposal.category)}`}>
                            {proposal.category}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </Badge>
                          <span className="text-sm text-gray-500">#{proposal.id}</span>
                        </div>
                        <CardTitle className="text-xl font-semibold">{proposal.title}</CardTitle>
                        <p className="text-gray-600">{proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Proposed by: <strong>{proposal.proposer}</strong></span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {proposal.timeRemaining}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Voting Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Voting Progress</span>
                        <span className="font-medium">Quorum: {proposal.quorum}</span>
                      </div>
                      
                      {/* For Votes */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">For</span>
                          <span className="font-medium">{proposal.forVotes} BITUNI</span>
                        </div>
                        <Progress 
                          value={(parseInt(proposal.forVotes.replace(',', '')) / parseInt(proposal.votingPower.replace(',', '').replace(' BITUNI', ''))) * 100} 
                          className="h-2 bg-gray-200"
                        />
                      </div>

                      {/* Against Votes */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-red-600">Against</span>
                          <span className="font-medium">{proposal.againstVotes} BITUNI</span>
                        </div>
                        <Progress 
                          value={(parseInt(proposal.againstVotes.replace(',', '')) / parseInt(proposal.votingPower.replace(',', '').replace(' BITUNI', ''))) * 100} 
                          className="h-2 bg-gray-200"
                        />
                      </div>

                      {/* Abstain Votes */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Abstain</span>
                          <span className="font-medium">{proposal.abstainVotes} BITUNI</span>
                        </div>
                        <Progress 
                          value={(parseInt(proposal.abstainVotes.replace(',', '')) / parseInt(proposal.votingPower.replace(',', '').replace(' BITUNI', ''))) * 100} 
                          className="h-2 bg-gray-200"
                        />
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <Button variant="outline" className="flex-1 text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Vote For
                      </Button>
                      <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-2" />
                        Vote Against
                      </Button>
                      <Button variant="outline" className="flex-1 text-gray-600 border-gray-600 hover:bg-gray-50">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Abstain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Proposal History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h3 className="text-2xl font-bold text-charcoal">Recent Proposal Results</h3>
            
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">#{proposal.id}</span>
                          <Badge className={`text-xs ${getStatusColor(proposal.result)}`}>
                            {proposal.result}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-semibold">{proposal.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Final Votes: <strong>{proposal.finalVotes}</strong></span>
                          <span>Pass Rate: <strong>{proposal.passRate}</strong></span>
                          <span>Implemented: <strong>{proposal.implementedDate}</strong></span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="space-y-6">
            <h3 className="text-2xl font-bold text-charcoal">Treasury Management</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Treasury Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Treasury:</span>
                    <span className="font-semibold">{treasuryInfo.totalTreasury}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allocated Funds:</span>
                    <span className="font-semibold">{treasuryInfo.allocatedFunds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Funds:</span>
                    <span className="font-semibold text-green-600">{treasuryInfo.availableFunds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Burn:</span>
                    <span className="font-semibold">{treasuryInfo.monthlyBurn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reserve Ratio:</span>
                    <span className="font-semibold">{treasuryInfo.reserveRatio}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Treasury Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Research Funding</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Indigenous Partnerships</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Platform Development</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Emergency Reserve</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <h3 className="text-2xl font-bold text-charcoal">BITUNI Staking</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-bitcoin-orange" />
                    Staking Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Staked:</span>
                    <span className="font-semibold">{stakingInfo.totalStaked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current APY:</span>
                    <span className="font-semibold text-green-600">{stakingInfo.stakingAPY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Period:</span>
                    <span className="font-semibold">{stakingInfo.averageStakingPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Stakers:</span>
                    <span className="font-semibold">{stakingInfo.totalStakers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Stake:</span>
                    <span className="font-semibold">{stakingInfo.minimumStake}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stake BITUNI Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stake Amount</label>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        placeholder="Enter BITUNI amount"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <Button variant="outline" size="sm">Max</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Staking Period</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>30 days (6% APY)</option>
                      <option>90 days (7.5% APY)</option>
                      <option>180 days (8.5% APY)</option>
                      <option>365 days (10% APY)</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Estimated Rewards:</span>
                      <span className="font-semibold">0 BITUNI</span>
                    </div>
                  </div>
                  <Button className="w-full bg-bitcoin-orange hover:bg-orange-600">
                    <Award className="w-4 h-4 mr-2" />
                    Stake Tokens
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}