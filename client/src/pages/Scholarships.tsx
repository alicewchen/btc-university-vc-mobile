import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Users, 
  Clock, 
  Target,
  GraduationCap,
  FileText,
  DollarSign,
  CalendarDays,
  BookOpen,
  Globe
} from "lucide-react";
import QuickFundButtons from "@/components/investor/QuickFundButtons";
import type { Scholarship } from "@shared/schema";

export default function Scholarships() {
  // Fetch scholarships from API
  const { data: scholarships = [], isLoading: scholarshipsLoading } = useQuery({
    queryKey: ["/api/scholarships"],
    queryFn: async (): Promise<Scholarship[]> => {
      const response = await fetch("/api/scholarships");
      if (!response.ok) {
        throw new Error("Failed to fetch scholarships");
      }
      return response.json();
    }
  });

  // Mock scholarships for demonstration
  const mockScholarships: Scholarship[] = [
    {
      id: 1,
      title: "Indigenous Knowledge Preservation Fellowship",
      description: "Supporting Indigenous students studying traditional ecological knowledge, language preservation, and cultural conservation technologies.",
      amount: "25000",
      fundingGoal: "50000",
      fundingRaised: "32000",
      recipient: null,
      criteria: ["Indigenous heritage", "Conservation studies", "Community engagement", "Language preservation focus"],
      category: "graduate",
      deadline: new Date("2025-03-15"),
      status: "open",
      createdBy: "0xfund1...2er3",
      createdAt: new Date("2024-12-01")
    },
    {
      id: 2,
      title: "Climate Science Research Scholarship",
      description: "Full funding for graduate students researching climate adaptation strategies and renewable energy solutions in developing nations.",
      amount: "40000",
      fundingGoal: "80000",
      fundingRaised: "24000",
      recipient: null,
      criteria: ["Graduate level", "Climate science focus", "Developing nations research", "Community impact plan"],
      category: "graduate",
      deadline: new Date("2025-04-01"),
      status: "open",
      createdBy: "0xclim1...2te4",
      createdAt: new Date("2024-11-15")
    },
    {
      id: 3,
      title: "Blockchain for Conservation Undergraduate Program",
      description: "Undergraduate scholarship for students developing blockchain solutions for wildlife tracking, anti-poaching, and conservation funding.",
      amount: "15000",
      fundingGoal: "45000",
      fundingRaised: "38000",
      recipient: null,
      criteria: ["Undergraduate level", "Computer science background", "Conservation interest", "Blockchain development"],
      category: "undergraduate",
      deadline: new Date("2025-02-28"),
      status: "open",
      createdBy: "0xtech1...2ch5",
      createdAt: new Date("2024-10-20")
    },
    {
      id: 4,
      title: "Diversity in Quantum Computing Fellowship",
      description: "Fellowship for underrepresented students in quantum computing research, with focus on quantum cryptography for traditional knowledge protection.",
      amount: "35000",
      fundingGoal: "70000",
      fundingRaised: "55000",
      recipient: null,
      criteria: ["Underrepresented background", "Quantum computing focus", "Research experience", "Traditional knowledge applications"],
      category: "research",
      deadline: new Date("2025-05-15"),
      status: "open",
      createdBy: "0xquan1...2um6",
      createdAt: new Date("2024-11-01")
    }
  ];

  const displayScholarships = scholarships.length > 0 ? scholarships : mockScholarships;

  const stats = {
    totalFunded: "$2.1M",
    activeScholarships: displayScholarships.length,
    recipientsSupported: "147"
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return `${Math.ceil(diffDays / 30)} months`;
    } else if (diffDays > 0) {
      return `${diffDays} days`;
    } else {
      return "Expired";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'undergraduate': return 'bg-blue-100 text-blue-800';
      case 'graduate': return 'bg-green-100 text-green-800'; 
      case 'research': return 'bg-purple-100 text-purple-800';
      case 'diversity': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (scholarshipsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-orange mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Research Scholarships
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fund the next generation of researchers and innovators working on conservation technology, 
            Indigenous knowledge preservation, and cutting-edge science.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalFunded}</div>
              <div className="text-sm text-gray-600">Total Funded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.activeScholarships}</div>
              <div className="text-sm text-gray-600">Active Scholarships</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.recipientsSupported}</div>
              <div className="text-sm text-gray-600">Recipients Supported</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Scholarships List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-charcoal mb-6">Available Scholarships</h3>
            {displayScholarships.map((scholarship) => {
              const progress = Math.round((parseFloat(scholarship.fundingRaised) / parseFloat(scholarship.fundingGoal)) * 100);
              const timeRemaining = scholarship.deadline ? formatDeadline(scholarship.deadline) : "No deadline";
              
              return (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-charcoal">{scholarship.title}</h4>
                              <Badge className={getCategoryColor(scholarship.category)}>
                                {scholarship.category.charAt(0).toUpperCase() + scholarship.category.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{scholarship.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                Amount: ${parseFloat(scholarship.amount).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {timeRemaining} remaining
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Eligibility Criteria */}
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-800 mb-2">Eligibility Criteria:</h5>
                          <div className="flex flex-wrap gap-1">
                            {scholarship.criteria.map((criterion, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {criterion}
                              </Badge>
                            ))}
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
                            ${parseFloat(scholarship.fundingRaised).toLocaleString()} / ${parseFloat(scholarship.fundingGoal).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Fund Section */}
                      <div className="lg:w-80">
                        <QuickFundButtons 
                          targetType="scholarship"
                          targetId={scholarship.id.toString()}
                          targetName={scholarship.title}
                          description="Support this scholarship"
                          currentAmount={parseFloat(scholarship.fundingRaised)}
                          goalAmount={parseFloat(scholarship.fundingGoal)}
                          className="w-full"
                          data-testid={`quick-fund-scholarship-${scholarship.id}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <div className="text-center mt-8">
              <Button className="bg-bitcoin-orange hover:bg-orange-600">
                <FileText className="w-4 h-4 mr-2" />
                View All Scholarships
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-light-orange sticky top-6">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-charcoal mb-4">Create Scholarship</h3>
                <p className="text-gray-600 mb-6">
                  Help fund the next generation of researchers by creating new scholarship opportunities.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    Global accessibility
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Community funding
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Milestone tracking
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="w-4 h-4 mr-2" />
                    Impact measurement
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-bitcoin-orange hover:bg-orange-600"
                  data-testid="button-create-scholarship"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Create Scholarship
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}