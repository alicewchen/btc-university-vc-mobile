import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Target, Clock } from "lucide-react";
import QuickFundButtons from "@/components/investor/QuickFundButtons";

const activeGrants = [
  { 
    id: "grant-1",
    name: "Quantum Blockchain Research", 
    amount: "$250K",
    raised: 180000,
    goal: 250000,
    description: "Advancing quantum-resistant blockchain protocols",
    deadline: "Dec 2025"
  },
  { 
    id: "grant-2",
    name: "DeFi Security Protocols", 
    amount: "$180K",
    raised: 120000,
    goal: 180000,
    description: "Next-generation smart contract security frameworks",
    deadline: "Jan 2026"
  },
  { 
    id: "grant-3",
    name: "Green Mining Solutions", 
    amount: "$320K",
    raised: 75000,
    goal: 320000,
    description: "Sustainable cryptocurrency mining infrastructure",
    deadline: "Mar 2026"
  }
];

const stats = {
  totalFunded: "$2.4M",
  activeProjects: 47,
  successRate: "84%"
};

export default function ResearchFunding() {
  const handleSubmitProposal = () => {
    // TODO: Route through BUFeeRouter.sol with 1% fee
    console.log("Submitting research proposal through BUFeeRouter...");
  };

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Research Funding</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access decentralized funding opportunities through our smart contract-powered marketplace.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Active Grants */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-charcoal mb-6">Active Research Grants</h3>
            {activeGrants.map((grant) => {
              const progress = Math.round((grant.raised / grant.goal) * 100);
              return (
                <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-charcoal mb-2">{grant.name}</h4>
                            <p className="text-gray-600 mb-3">{grant.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                Goal: {grant.amount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {grant.deadline}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Funding Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Funding Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-gray-500 text-center">
                            ${grant.raised.toLocaleString()} / ${grant.goal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Fund Section */}
                      <div className="lg:w-80">
                        <QuickFundButtons 
                          targetType="grant"
                          targetId={grant.id}
                          targetName={grant.name}
                          description="Support this research grant"
                          currentAmount={grant.raised}
                          goalAmount={grant.goal}
                          className="w-full"
                          data-testid={`quick-fund-grant-${grant.id}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <div className="text-center mt-8">
              <Button className="bg-bitcoin-orange hover:bg-orange-600">
                View All Grants
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-light-orange sticky top-6">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-charcoal mb-4">Funding Stats</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Funded</span>
                      <span className="font-bold text-charcoal">{stats.totalFunded}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Active Projects</span>
                      <span className="font-bold text-charcoal">{stats.activeProjects}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-bold text-charcoal">{stats.successRate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleSubmitProposal}
                    className="w-full bg-bitcoin-orange hover:bg-orange-600"
                    data-testid="button-submit-proposal"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
