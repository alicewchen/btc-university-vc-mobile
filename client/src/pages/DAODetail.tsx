import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  Award,
  BookOpen,
  ExternalLink,
  Globe,
  ChevronRight,
  Star,
  PlayCircle,
  FileText,
  Download,
  Eye,
  Link,
  Database,
  Quote,
  MapPin,
  ArrowUpRight
} from "lucide-react";
import type { ResearchDAO, DAOProposal, DAOMilestone, DAOPublication } from "@shared/schema";
import QuickFundButtons from "@/components/investor/QuickFundButtons";

export default function DAODetail() {
  const { daoId } = useParams();

  // Fetch DAO basic info
  const { data: dao, isLoading: daoLoading, error: daoError } = useQuery({
    queryKey: ["/api/research-daos", daoId],
    queryFn: async (): Promise<ResearchDAO> => {
      const response = await fetch(`/api/research-daos/${daoId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch DAO");
      }
      return response.json();
    },
    enabled: !!daoId
  });

  // Fetch DAO proposals
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ["/api/research-daos", daoId, "proposals"],
    queryFn: async (): Promise<DAOProposal[]> => {
      const response = await fetch(`/api/research-daos/${daoId}/proposals`);
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      return response.json();
    },
    enabled: !!daoId
  });

  // Fetch DAO milestones
  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ["/api/research-daos", daoId, "milestones"],
    queryFn: async (): Promise<DAOMilestone[]> => {
      const response = await fetch(`/api/research-daos/${daoId}/milestones`);
      if (!response.ok) {
        throw new Error("Failed to fetch milestones");
      }
      return response.json();
    },
    enabled: !!daoId
  });

  // Fetch DAO publications
  const { data: publications = [], isLoading: publicationsLoading } = useQuery({
    queryKey: ["/api/research-daos", daoId, "publications"],
    queryFn: async (): Promise<DAOPublication[]> => {
      const response = await fetch(`/api/research-daos/${daoId}/publications`);
      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }
      return response.json();
    },
    enabled: !!daoId
  });

  if (daoLoading) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </section>
    );
  }

  if (daoError || !dao) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-600">DAO Not Found</h1>
          <p className="text-gray-500 mt-2">The requested DAO does not exist or could not be loaded.</p>
        </div>
      </section>
    );
  }

  const fundingProgress = (dao.fundingRaised / dao.fundingGoal) * 100;
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Research Programs</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>{dao.category}</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">{dao.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-charcoal mb-4">{dao.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{dao.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Badge className="bg-green-100 text-green-800">{dao.status}</Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700">{dao.tokenSymbol}</Badge>
                {dao.leadResearcher && (
                  <span className="text-sm text-gray-500">Lead: <strong>{dao.leadResearcher}</strong></span>
                )}
                {dao.daoAddress && (
                  <span className="text-sm text-gray-500">DAO Address: <strong className="font-mono">{dao.daoAddress}</strong></span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Vote className="w-4 h-4 mr-2" />
                Join DAO
              </Button>
              <Button variant="outline">
                <Coins className="w-4 h-4 mr-2" />
                Stake {dao.tokenSymbol}
              </Button>
              <Button variant="outline" asChild>
                <a href={dao.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-2xl font-bold text-green-600 mb-1">{Math.round(fundingProgress)}%</div>
              <div className="text-sm text-gray-600">Funding Progress</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(dao.fundingRaised)} / {formatCurrency(dao.fundingGoal)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-blue-600 mb-1">{dao.memberCount}</div>
              <div className="text-sm text-gray-600">DAO Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-2xl font-bold text-purple-600 mb-1">{dao.activeProposals || proposals.length}</div>
              <div className="text-sm text-gray-600">Active Proposals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-2xl font-bold text-bitcoin-orange mb-1">
                {dao.completedMilestones}/{dao.totalMilestones}
              </div>
              <div className="text-sm text-gray-600">Milestones</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Research Objectives */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Research Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dao.objectives && dao.objectives.length > 0 ? (
                      <ul className="space-y-3">
                        {dao.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No research objectives defined yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Treasury & Economics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-green-600" />
                      Treasury & Economics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Treasury Balance</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(dao.treasury)}
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Token Symbol</div>
                        <div className="text-2xl font-bold text-blue-600">{dao.tokenSymbol}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span>{Math.round(fundingProgress)}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Fund Component */}
                <QuickFundButtons 
                  targetType="dao"
                  targetId={daoId!}
                  targetName={dao.name}
                  description="Support this research DAO with one-click funding"
                  currentAmount={dao.fundingRaised}
                  goalAmount={dao.fundingGoal}
                  data-testid="quick-fund-dao"
                />

                {/* DAO Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-purple-600" />
                      DAO Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Governance Model</span>
                      <span className="font-medium">{dao.governanceModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voting Mechanism</span>
                      <span className="font-medium">{dao.votingMechanism}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proposals</span>
                      <span className="font-medium">{dao.proposalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity</span>
                      <span className="font-medium">{dao.lastActivity}</span>
                    </div>
                    {dao.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {dao.location}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Collaborators */}
                {dao.collaborators && dao.collaborators.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-orange-600" />
                        Key Collaborators
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dao.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                            {collaborator}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {dao.tags && dao.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Research Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {dao.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Vote className="w-5 h-5 mr-2 text-blue-600" />
                  Active Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {proposalsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : proposals.length > 0 ? (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{proposal.title}</h3>
                          <Badge variant="outline">{proposal.timeRemaining}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{proposal.description}</p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span>For: {proposal.forVotes}</span>
                          </div>
                          <div className="flex items-center">
                            <XCircle className="w-4 h-4 text-red-600 mr-2" />
                            <span>Against: {proposal.againstVotes}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Quorum: {proposal.quorum}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Proposed by: {proposal.proposer}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active proposals at this time.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Research Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : milestones.length > 0 ? (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{milestone.title}</h3>
                          <Badge 
                            className={
                              milestone.status === "Completed" 
                                ? "bg-green-100 text-green-800"
                                : milestone.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{milestone.description}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {milestone.fundingReleased && (
                            <div className="flex items-center">
                              <Coins className="w-4 h-4 text-green-600 mr-2" />
                              <span>Funding Released: {milestone.fundingReleased}</span>
                            </div>
                          )}
                          {milestone.fundingAllocated && (
                            <div className="flex items-center">
                              <Wallet className="w-4 h-4 text-blue-600 mr-2" />
                              <span>Funding Allocated: {milestone.fundingAllocated}</span>
                            </div>
                          )}
                          {milestone.completedDate && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-purple-600 mr-2" />
                              <span>Completed: {milestone.completedDate}</span>
                            </div>
                          )}
                          {milestone.expectedCompletion && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-orange-600 mr-2" />
                              <span>Expected: {milestone.expectedCompletion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No milestones defined yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Research Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {publicationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : publications.length > 0 ? (
                  <div className="space-y-4">
                    {publications.map((publication) => (
                      <div key={publication.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{publication.title}</h3>
                          <div className="flex gap-2">
                            {publication.openAccess && (
                              <Badge className="bg-green-100 text-green-800">Open Access</Badge>
                            )}
                            <Badge variant="outline">{publication.researchType}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Authors: {publication.authors.join(", ")}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Published in {publication.journal} on {publication.publishedDate}
                        </div>
                        <p className="text-gray-700 mb-4">{publication.abstract}</p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Quote className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Citations: {publication.citationCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-600 mr-2" />
                            <span>Impact Score: {publication.impactScore}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="w-4 h-4 text-purple-600 mr-2" />
                            <span>Downloads: {publication.downloadCount}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          DAO Funding: {publication.daoFunding}
                        </div>
                        {publication.tags && publication.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {publication.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No publications available yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Course integration coming soon. Connect with educational partners to access specialized training programs.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Join the Discussion</h3>
                    <p className="text-gray-600 mb-4">
                      Connect with {dao.memberCount} researchers and contributors working on {dao.category.toLowerCase()} solutions.
                    </p>
                    <Button className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Join Community
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Latest Activity</h3>
                    <p className="text-gray-600">
                      Last activity: {dao.lastActivity}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {dao.proposalCount} total proposals • {dao.memberCount} members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}