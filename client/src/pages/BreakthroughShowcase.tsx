import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink,
  FileText,
  Target,
  Globe,
  Heart,
  Zap,
  BookOpen,
  Database,
  ChevronRight,
  Star
} from "lucide-react";

const breakthroughProjects = [
  {
    id: 1,
    title: "Quantum-Safe Traditional Knowledge Encryption",
    description: "Revolutionary quantum-resistant cryptography specifically designed to protect Indigenous knowledge while enabling authorized research collaboration.",
    collaborators: ["Dr. Quantum Singh (MIT)", "Dr. Elena Rodriguez (Arctic Research Institute)", "Elder Mary Crow Feather (Lakota Nation)"],
    timeline: "January 2024 - December 2024",
    status: "Completed",
    impact: {
      technicalAchievements: ["First quantum-safe protocol for Indigenous data", "99.7% encryption efficiency", "Cultural protocol compliance framework"],
      researchOutputs: ["3 peer-reviewed papers", "1 patent application", "Open-source protocol library"],
      realWorldImpact: ["12 tribal nations adopting protocol", "500+ traditional knowledge records secured", "Research collaboration framework used by 8 universities"],
      funding: "127,000 tokens across 3 DAOs"
    },
    metrics: {
      collaborationScore: 98,
      timeToDeployment: "8 months",
      adoptionRate: "89%",
      communityFeedback: 4.9
    },
    location: "Global - MIT, Arctic Research Centers, Lakota Territory",
    nextPhase: "Expanding to traditional medicine databases and sacred site protection systems"
  },
  {
    id: 2,
    title: "AI-Powered Endangered Language Preservation",
    description: "Culturally-sensitive AI models that preserve endangered languages while respecting Indigenous protocols and community ownership.",
    collaborators: ["Dr. Aiyana Littlewolf (Indigenous Tech Institute)", "Joseph Running Bear (Lakota Nation College)", "Dr. Kenji Nakamura (Tokyo Language AI Lab)"],
    timeline: "March 2024 - Ongoing",
    status: "In Progress",
    impact: {
      technicalAchievements: ["Cultural protocol-aware AI training", "Real-time language learning apps", "Community-controlled data governance"],
      researchOutputs: ["2 published papers", "Mobile app framework", "Community training curriculum"],
      realWorldImpact: ["5 endangered languages documented", "200+ community members trained", "3 schools implementing curriculum"],
      funding: "95,000 tokens from Language Preservation DAO"
    },
    metrics: {
      collaborationScore: 94,
      timeToDeployment: "12 months (projected)",
      adoptionRate: "73%",
      communityFeedback: 4.8
    },
    location: "North America - Indigenous Communities, Tech Centers",
    nextPhase: "Expanding to Pacific Island languages and developing elder knowledge transfer protocols"
  },
  {
    id: 3,
    title: "Continental Anti-Poaching Sensor Network",
    description: "Massive IoT sensor deployment across 6 countries creating the world's largest wildlife protection network with real-time threat detection.",
    collaborators: ["Dr. Sarah Chen (Wildlife Conservation Society)", "Dr. Peter Kimani (Kenya Wildlife Service)", "12 researchers across 6 countries"],
    timeline: "June 2023 - December 2024",
    status: "Active Deployment",
    impact: {
      technicalAchievements: ["2,400 autonomous sensors deployed", "Real-time threat AI detection", "Blockchain-verified incident reporting"],
      researchOutputs: ["4 conservation papers", "Open sensor hardware designs", "Threat prediction algorithms"],
      realWorldImpact: ["67% reduction in poaching incidents", "23 endangered species protected", "$2.3M in prevented wildlife crimes"],
      funding: "340,000 tokens from Wildlife Protection DAO"
    },
    metrics: {
      collaborationScore: 96,
      timeToDeployment: "18 months",
      adoptionRate: "91%",
      communityFeedback: 4.9
    },
    location: "Africa - Kenya, Tanzania, Botswana, South Africa, Zambia, Zimbabwe",
    nextPhase: "Expanding to South American rainforests and Asian tiger reserves"
  },
  {
    id: 4,
    title: "Decentralized Climate Data Oracle Network",
    description: "Blockchain-based climate monitoring system combining satellite data, IoT sensors, and traditional ecological indicators for unprecedented accuracy.",
    collaborators: ["Dr. Elena Rodriguez (Arctic Research)", "Dr. Amara Okafor (Climate Analytics Africa)", "Traditional Weather Keepers Council"],
    timeline: "April 2024 - March 2025",
    status: "Pilot Testing",
    impact: {
      technicalAchievements: ["Global sensor integration platform", "Traditional knowledge validation algorithms", "Real-time climate prediction models"],
      researchOutputs: ["Climate data API", "Traditional indicator database", "Prediction accuracy studies"],
      realWorldImpact: ["15% improvement in climate predictions", "8 Arctic communities using system", "Policy recommendations to 12 governments"],
      funding: "180,000 tokens from Climate Oracle DAO"
    },
    metrics: {
      collaborationScore: 92,
      timeToDeployment: "11 months",
      adoptionRate: "78%",
      communityFeedback: 4.7
    },
    location: "Arctic Circle, Sub-Saharan Africa, Pacific Islands",
    nextPhase: "Integration with global weather services and UN climate reporting systems"
  },
  {
    id: 5,
    title: "Regenerative Agriculture Blockchain Certification",
    description: "Smart contract-based certification system for regenerative farming practices, connecting Indigenous agricultural knowledge with modern sustainability metrics.",
    collaborators: ["Dr. Maria Santos (Sustainable Agriculture Institute)", "Carlos Mendoza (Andean Farmers Collective)", "Dr. Lisa Thompson (Soil Science Lab)"],
    timeline: "August 2024 - June 2025",
    status: "Community Testing",
    impact: {
      technicalAchievements: ["Soil carbon smart contracts", "Traditional practice verification", "Supply chain transparency protocols"],
      researchOutputs: ["Regenerative metrics framework", "Farmer training materials", "Carbon credit algorithms"],
      realWorldImpact: ["500 farms certified", "30% soil carbon increase", "$1.2M in carbon credits generated"],
      funding: "145,000 tokens from Regenerative Agriculture DAO"
    },
    metrics: {
      collaborationScore: 89,
      timeToDeployment: "10 months",
      adoptionRate: "85%",
      communityFeedback: 4.8
    },
    location: "South America - Peru, Ecuador, Colombia, Brazil",
    nextPhase: "Scaling to smallholder farms globally and developing crop insurance protocols"
  }
];

export default function BreakthroughShowcase() {
  const completedProjects = breakthroughProjects.filter(p => p.status === "Completed");
  const activeProjects = breakthroughProjects.filter(p => p.status !== "Completed");

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Award className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Breakthrough Discoveries Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Witness how our collaboration matching system accelerates breakthrough discoveries by connecting 
            brilliant researchers across disciplines, cultures, and continents to solve humanity's greatest challenges.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">887K</div>
              <div className="text-sm text-gray-600">Total DAO Tokens Deployed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">17</div>
              <div className="text-sm text-gray-600">Research Papers Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">23</div>
              <div className="text-sm text-gray-600">Countries Impacted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-3xl font-bold text-bitcoin-orange mb-2">47</div>
              <div className="text-sm text-gray-600">Research Collaborators</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Breakthrough Projects */}
        <div className="space-y-12">
          {breakthroughProjects.map((project, index) => (
            <Card key={project.id} className="hover:shadow-xl transition-shadow overflow-hidden">
              <div className={`h-2 ${
                project.status === "Completed" ? "bg-green-500" : 
                project.status === "In Progress" ? "bg-blue-500" : 
                project.status === "Active Deployment" ? "bg-purple-500" :
                "bg-orange-500"
              }`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={`${
                        project.status === "Completed" ? "bg-green-100 text-green-800" : 
                        project.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                        project.status === "Active Deployment" ? "bg-purple-100 text-purple-800" :
                        "bg-orange-100 text-orange-800"
                      }`}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{project.timeline}</span>
                    </div>
                    <CardTitle className="text-2xl mb-3">{project.title}</CardTitle>
                    <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold">{project.metrics.collaborationScore}</span>
                    </div>
                    <div className="text-xs text-gray-500">Collaboration Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Collaborators */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Key Collaborators
                  </h4>
                  <div className="space-y-2">
                    {project.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-bitcoin-orange rounded-full"></div>
                        <span className="text-sm">{collaborator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Metrics Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Technical Achievements
                    </h4>
                    <ul className="space-y-1">
                      {project.impact.technicalAchievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Research Outputs
                    </h4>
                    <ul className="space-y-1">
                      {project.impact.researchOutputs.map((output, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Real-World Impact
                    </h4>
                    <ul className="space-y-1">
                      {project.impact.realWorldImpact.map((impact, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Project Metrics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time to Deployment:</span>
                        <span className="font-medium">{project.metrics.timeToDeployment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Adoption Rate:</span>
                        <span className="font-medium">{project.metrics.adoptionRate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Community Feedback:</span>
                        <span className="font-medium">{project.metrics.communityFeedback}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location and Funding */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">Geographic Scope</div>
                        <div className="text-sm text-gray-600">{project.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Database className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">DAO Funding</div>
                        <div className="text-sm text-green-600 font-medium">{project.impact.funding}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Phase */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Next Phase Development
                  </h4>
                  <p className="text-blue-700 text-sm">{project.nextPhase}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Research Papers
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Meet Team
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Project Details
                  </Button>
                  <Button className="flex-1 bg-bitcoin-orange hover:bg-orange-600">
                    <Target className="w-4 h-4 mr-2" />
                    Join Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl font-bold mb-6">Ready to Create the Next Breakthrough?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              These discoveries represent just the beginning. Our collaboration platform connects brilliant minds 
              across disciplines and cultures to tackle humanity's greatest challenges. Your expertise could be 
              the missing piece for the next conservation breakthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Find Research Partners
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <FileText className="w-5 h-5 mr-2" />
                Submit Research Proposal
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn Conservation Tech
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}