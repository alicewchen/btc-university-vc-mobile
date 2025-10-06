import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  UserPlus,
  Globe,
  Zap,
  Brain,
  Heart,
  Award,
  ChevronRight,
  ExternalLink,
  Mail,
  Calendar,
  Target,
  BookOpen,
  Coins,
  Vote
} from "lucide-react";

const researcherProfiles = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    title: "Climate Data Scientist",
    institution: "Arctic Research Institute",
    location: "Nunavut, Canada",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c96e8d84?w=150&h=150&fit=crop&crop=face",
    expertiseAreas: ["Climate Modeling", "Data Analytics", "Arctic Ecosystems", "Machine Learning"],
    researchInterests: ["Permafrost Monitoring", "Indigenous Knowledge Integration", "Predictive Climate Models"],
    activeDAOs: ["Climate Data Oracle Network", "Arctic Conservation DAO", "Traditional Knowledge Database"],
    tokenHoldings: { "CLIMATE": "15,000", "ARCTIC": "8,500", "TEKDAO": "3,200" },
    collaborationScore: 94,
    availability: "Available",
    timeZone: "EST",
    languages: ["English", "Spanish", "Inuktitut"],
    bio: "Climate scientist specializing in Arctic research with 12 years experience combining traditional knowledge with modern data analysis techniques.",
    recentProjects: [
      { name: "Permafrost Monitoring Network", role: "Lead Scientist", status: "Active" },
      { name: "Indigenous Climate Indicators", role: "Collaborator", status: "Completed" }
    ],
    skills: [
      { name: "Python", level: 95 },
      { name: "R Statistical Computing", level: 90 },
      { name: "Climate Modeling", level: 92 },
      { name: "Indigenous Collaboration", level: 85 }
    ],
    matchReasons: [
      "Active in Climate Data Oracle Network DAO",
      "Expertise in Indigenous knowledge integration",
      "Strong background in data analytics",
      "Available for immediate collaboration"
    ]
  },
  {
    id: 2,
    name: "Joseph Running Bear",
    title: "Traditional Knowledge Keeper",
    institution: "Lakota Nation College",
    location: "South Dakota, USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    expertiseAreas: ["Traditional Ecological Knowledge", "Medicinal Plants", "Cultural Preservation", "Community Governance"],
    researchInterests: ["Sacred Site Protection", "Traditional Medicine Documentation", "Intergenerational Knowledge Transfer"],
    activeDAOs: ["Traditional Medicine DAO", "Sacred Site Mapping", "Indigenous Knowledge Systems"],
    tokenHoldings: { "MEDICINE": "12,000", "SACRED": "18,500", "TEKDAO": "25,000" },
    collaborationScore: 91,
    availability: "Available",
    timeZone: "CST",
    languages: ["English", "Lakota", "Plains Cree"],
    bio: "Traditional knowledge keeper and educator focused on preserving and sharing Indigenous wisdom through respectful collaboration with scientific communities.",
    recentProjects: [
      { name: "Traditional Medicine Blockchain Registry", role: "Cultural Advisor", status: "Active" },
      { name: "Sacred Site Digital Mapping", role: "Lead Elder", status: "Active" }
    ],
    skills: [
      { name: "Traditional Knowledge", level: 98 },
      { name: "Community Engagement", level: 95 },
      { name: "Cultural Protocols", level: 97 },
      { name: "Educational Outreach", level: 88 }
    ],
    matchReasons: [
      "Leading expert in traditional ecological knowledge",
      "Active governance role in multiple Indigenous DAOs",
      "Strong community engagement skills",
      "Experienced in cross-cultural collaboration"
    ]
  },
  {
    id: 3,
    name: "Dr. Quantum Singh",
    title: "Quantum Cryptography Researcher",
    institution: "MIT Quantum Computing Lab",
    location: "Boston, MA, USA",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    expertiseAreas: ["Quantum Computing", "Post-Quantum Cryptography", "Blockchain Security", "Information Theory"],
    researchInterests: ["Quantum-Safe Conservation Data", "Distributed Quantum Networks", "Privacy-Preserving Research"],
    activeDAOs: ["Quantum-Enhanced Crypto DAO", "Privacy Research Network", "Secure Data Consortium"],
    tokenHoldings: { "QUANTUM": "22,000", "PRIVACY": "15,500", "SECURE": "8,800" },
    collaborationScore: 89,
    availability: "Limited - Research Sabbatical",
    timeZone: "EST",
    languages: ["English", "Hindi", "Mandarin"],
    bio: "Quantum computing researcher developing next-generation cryptographic solutions for protecting sensitive research data and Indigenous knowledge.",
    recentProjects: [
      { name: "Quantum-Safe Conservation Data Encryption", role: "Principal Investigator", status: "Active" },
      { name: "Distributed Quantum Key Management", role: "Technical Lead", status: "Planning" }
    ],
    skills: [
      { name: "Quantum Algorithms", level: 96 },
      { name: "Cryptographic Protocols", level: 94 },
      { name: "Blockchain Security", level: 87 },
      { name: "Research Methodology", level: 92 }
    ],
    matchReasons: [
      "Expert in quantum-safe data protection",
      "Experience with sensitive data protocols",
      "Strong theoretical and practical background",
      "Proven track record in collaborative research"
    ]
  },
  {
    id: 4,
    name: "Dr. Aiyana Littlewolf",
    title: "Digital Anthropologist",
    institution: "Indigenous Technologies Institute",
    location: "Vancouver, BC, Canada",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    expertiseAreas: ["Digital Anthropology", "Language Preservation", "Cultural Technology", "Community-Based Research"],
    researchInterests: ["Digital Language Archives", "Cultural Technology Design", "Indigenous Data Sovereignty"],
    activeDAOs: ["Language Preservation Protocol", "Cultural Tech DAO", "Indigenous Data Sovereign"],
    tokenHoldings: { "LANGUAGE": "20,000", "CULTURE": "16,500", "DATA": "12,300" },
    collaborationScore: 93,
    availability: "Available",
    timeZone: "PST",
    languages: ["English", "Cree", "French", "Ojibwe"],
    bio: "Digital anthropologist specializing in culturally appropriate technology design and Indigenous language preservation through innovative digital platforms.",
    recentProjects: [
      { name: "Language Preservation Protocol", role: "Lead Researcher", status: "Active" },
      { name: "Cultural Technology Design Framework", role: "Principal Designer", status: "Active" }
    ],
    skills: [
      { name: "Digital Anthropology", level: 96 },
      { name: "Language Technology", level: 91 },
      { name: "Community Research", level: 94 },
      { name: "Cultural Design", level: 89 }
    ],
    matchReasons: [
      "Expertise in Indigenous language technology",
      "Strong background in community-based research",
      "Active in multiple cultural preservation DAOs",
      "Proven experience in digital platform development"
    ]
  },
  {
    id: 5,
    name: "Dr. Sarah Chen",
    title: "Conservation Technology Engineer",
    institution: "Wildlife Conservation Society",
    location: "Nairobi, Kenya",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c96e8d84?w=150&h=150&fit=crop&crop=face",
    expertiseAreas: ["IoT Systems", "Wildlife Monitoring", "Sensor Networks", "Conservation Engineering"],
    researchInterests: ["Real-time Species Tracking", "Anti-Poaching Technology", "Habitat Monitoring Systems"],
    activeDAOs: ["Wildlife Tracking DAO", "Conservation Tech Alliance", "Anti-Poaching Network"],
    tokenHoldings: { "WILDLIFE": "28,000", "CONSERVE": "19,500", "PROTECT": "14,200" },
    collaborationScore: 96,
    availability: "Available",
    timeZone: "EAT",
    languages: ["English", "Mandarin", "Swahili", "Maasai"],
    bio: "Conservation engineer with extensive field experience developing IoT-based wildlife monitoring systems across African nature reserves.",
    recentProjects: [
      { name: "Wildlife Tracking via IoT-Blockchain Integration", role: "Lead Engineer", status: "Active" },
      { name: "Anti-Poaching Sensor Network", role: "Technical Advisor", status: "Active" }
    ],
    skills: [
      { name: "IoT Development", level: 97 },
      { name: "Sensor Networks", level: 95 },
      { name: "Field Engineering", level: 93 },
      { name: "Wildlife Biology", level: 86 }
    ],
    matchReasons: [
      "Leading the Wildlife Tracking DAO",
      "Extensive field experience in conservation technology",
      "Strong technical skills in IoT and sensors", 
      "Proven collaboration with local communities"
    ]
  }
];

const daoProjectNeeds = [
  {
    id: 1,
    daoName: "Wildlife Tracking DAO",
    daoToken: "WILDLIFE",
    projectTitle: "Real-Time Wildlife Monitoring Using IoT-Blockchain Integration",
    currentPhase: "Sensor Network Expansion",
    urgency: "High",
    fundingAllocated: "45,000 WILDLIFE tokens",
    currentTeam: ["Dr. Sarah Chen (Lead)", "Dr. Kanja Mwangi", "Elder Joseph Maasai"],
    requiredExpertise: [
      {
        role: "IoT Hardware Engineer",
        skills: ["Hardware Design", "Sensor Networks", "Field Deployment", "Solar Power Systems"],
        timeCommitment: "15-20 hours/week",
        duration: "6 months",
        compensation: "18,000 WILDLIFE tokens + hardware ownership stake",
        urgency: "Critical",
        description: "Design and deploy ruggedized IoT sensors for harsh African savanna conditions with 2-year battery life.",
        matchedCandidates: ["Dr. Ahmed Hassan (94% match)", "Prof. Lisa Chen (89% match)"]
      },
      {
        role: "Blockchain Data Architect",
        skills: ["Smart Contracts", "IPFS", "Chainlink Oracles", "Data Verification"],
        timeCommitment: "10-15 hours/week",
        duration: "4 months", 
        compensation: "15,000 WILDLIFE tokens + technical co-authorship",
        urgency: "High",
        description: "Implement immutable data storage and verification protocols for wildlife movement data.",
        matchedCandidates: ["Dr. Quantum Singh (92% match)", "Alex Rodriguez (87% match)"]
      },
      {
        role: "Traditional Knowledge Advisor",
        skills: ["Indigenous Protocols", "Wildlife Tracking", "Community Relations", "Cultural Sensitivity"],
        timeCommitment: "5-8 hours/week",
        duration: "12 months",
        compensation: "12,000 WILDLIFE tokens + advisory board position",
        urgency: "Medium",
        description: "Guide ethical integration of traditional tracking methods with modern sensor technology.",
        matchedCandidates: ["Joseph Running Bear (96% match)", "Elder Mary Littlewolf (93% match)"]
      }
    ],
    nextMilestones: ["Deploy 500 additional sensors", "Complete mobile app beta", "Integrate traditional indicators"],
    communityNeeds: ["Maasai tracker training", "Community reporting system", "Local ranger integration"]
  },
  {
    id: 2,
    daoName: "Language Preservation Protocol",
    daoToken: "LANGUAGE",
    projectTitle: "AI-Powered Endangered Language Documentation",
    currentPhase: "AI Model Training",
    urgency: "Critical",
    fundingAllocated: "65,000 LANGUAGE tokens",
    currentTeam: ["Dr. Aiyana Littlewolf (Lead)", "Joseph Running Bear", "Dr. Kenji Nakamura"],
    requiredExpertise: [
      {
        role: "NLP/AI Specialist",
        skills: ["Natural Language Processing", "Low-Resource Languages", "Ethical AI", "Model Training"],
        timeCommitment: "20+ hours/week",
        duration: "8 months",
        compensation: "25,000 LANGUAGE tokens + AI model ownership",
        urgency: "Critical",
        description: "Develop culturally-sensitive language models for 5 endangered Indigenous languages with <1000 speakers.",
        matchedCandidates: ["Dr. Priya Sharma (95% match)", "Dr. Luis Montenegro (91% match)"]
      },
      {
        role: "Audio Engineering Specialist",
        skills: ["Audio Processing", "Speech Recognition", "Recording Technology", "Field Recording"],
        timeCommitment: "12-15 hours/week",
        duration: "6 months",
        compensation: "18,000 LANGUAGE tokens + equipment access",
        urgency: "High",
        description: "Process and enhance elder recordings, develop mobile recording apps for community use.",
        matchedCandidates: ["Sofia Andersson (93% match)", "Dr. James Wright (88% match)"]
      },
      {
        role: "Community Engagement Coordinator",
        skills: ["Indigenous Relations", "Project Management", "Cross-Cultural Communication", "Community Training"],
        timeCommitment: "10-12 hours/week",
        duration: "12 months",
        compensation: "15,000 LANGUAGE tokens + community leadership role",
        urgency: "Medium",
        description: "Coordinate with tribal elders, manage community consent protocols, train community members.",
        matchedCandidates: ["Maria Gonzalez (97% match)", "Dr. Robert Littlefeather (94% match)"]
      }
    ],
    nextMilestones: ["Complete model training for Lakota", "Deploy community recording app", "Establish elder advisory board"],
    communityNeeds: ["Elder consent protocols", "Youth engagement programs", "Digital sovereignty framework"]
  },
  {
    id: 3,
    daoName: "Climate Data Oracle Network",
    daoToken: "CLIMATE",
    projectTitle: "Decentralized Climate Monitoring with Traditional Indicators",
    currentPhase: "Oracle Integration",
    urgency: "High",
    fundingAllocated: "55,000 CLIMATE tokens",
    currentTeam: ["Dr. Elena Rodriguez (Lead)", "Dr. Amara Okafor", "Traditional Weather Keepers Council"],
    requiredExpertise: [
      {
        role: "Oracle Network Developer",
        skills: ["Chainlink", "Oracle Networks", "API Integration", "Data Feeds"],
        timeCommitment: "18-22 hours/week",
        duration: "5 months",
        compensation: "22,000 CLIMATE tokens + oracle node ownership",
        urgency: "Critical",
        description: "Build decentralized oracle network combining satellite data with traditional climate indicators.",
        matchedCandidates: ["Dr. Pavel Novak (96% match)", "Yuki Tanaka (90% match)"]
      },
      {
        role: "Climate Data Scientist",
        skills: ["Climate Modeling", "Statistical Analysis", "Traditional Knowledge Integration", "Python/R"],
        timeCommitment: "15-18 hours/week",
        duration: "8 months",
        compensation: "20,000 CLIMATE tokens + research publication rights",
        urgency: "High",
        description: "Validate traditional climate indicators against satellite data, develop hybrid prediction models.",
        matchedCandidates: ["Dr. Elena Rodriguez (98% match)", "Dr. Sarah Johnson (92% match)"]
      },
      {
        role: "Indigenous Weather Knowledge Keeper",
        skills: ["Traditional Weather Patterns", "Seasonal Indicators", "Cultural Protocols", "Elder Relations"],
        timeCommitment: "6-8 hours/week",
        duration: "12 months",
        compensation: "16,000 CLIMATE tokens + knowledge keeper status",
        urgency: "Medium",
        description: "Document traditional weather prediction methods, train AI systems on cultural climate knowledge.",
        matchedCandidates: ["Elder Thomas Crow Dog (99% match)", "Maria Ixchel (95% match)"]
      }
    ],
    nextMilestones: ["Launch oracle network testnet", "Integrate 20 traditional indicators", "Deploy prediction API"],
    communityNeeds: ["Traditional knowledge documentation", "Community weather stations", "Elder training programs"]
  }
];

const collaborationRequests = [
  {
    id: 1,
    title: "Seeking Quantum Security Expert for Climate Data Protection",
    requester: "Dr. Elena Rodriguez",
    daoProject: "Climate Data Oracle Network",
    urgency: "High",
    skills: ["Quantum Cryptography", "Data Security", "Privacy Protection"],
    description: "Need collaboration on implementing quantum-safe encryption for sensitive climate research data from Arctic monitoring stations.",
    timeCommitment: "10-15 hours/week",
    duration: "3 months",
    compensation: "5,000 CLIMATE tokens + research co-authorship",
    deadline: "2025-02-15",
    matchScore: 94
  },
  {
    id: 2,
    title: "Traditional Knowledge Integration for Conservation Tech",
    requester: "Dr. Sarah Chen",
    daoProject: "Wildlife Tracking DAO",
    urgency: "Medium",
    skills: ["Traditional Ecological Knowledge", "Community Engagement", "Cultural Protocols"],
    description: "Seeking Indigenous knowledge keeper to guide ethical integration of traditional tracking methods with IoT sensor networks.",
    timeCommitment: "5-8 hours/week",
    duration: "6 months",
    compensation: "8,000 WILDLIFE tokens + advisory position",
    deadline: "2025-02-28",
    matchScore: 91
  },
  {
    id: 3,
    title: "Digital Platform Developer for Language Preservation",
    requester: "Joseph Running Bear",
    daoProject: "Language Preservation Protocol",
    urgency: "High",
    skills: ["Web Development", "Database Design", "Audio Processing", "Cultural Sensitivity"],
    description: "Building secure digital archive for endangered languages with community-controlled access and cultural protocols.",
    timeCommitment: "20+ hours/week",
    duration: "4 months", 
    compensation: "12,000 LANGUAGE tokens + platform ownership stake",
    deadline: "2025-02-10",
    matchScore: 88
  }
];

export default function CollaborationMatching() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("discover");

  const expertiseOptions = [
    "Traditional Ecological Knowledge", "Climate Modeling", "IoT Systems", "Quantum Computing",
    "Language Preservation", "Data Analytics", "Blockchain Security", "Conservation Engineering",
    "Digital Anthropology", "Community Engagement", "Machine Learning", "Cultural Protocols"
  ];

  const filteredResearchers = researcherProfiles.filter(researcher => {
    const matchesSearch = searchQuery === "" || 
      researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      researcher.expertiseAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      researcher.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise.length === 0 ||
      selectedExpertise.some(expertise => researcher.expertiseAreas.includes(expertise));
    
    const matchesAvailability = availabilityFilter === "all" ||
      (availabilityFilter === "available" && researcher.availability === "Available") ||
      (availabilityFilter === "limited" && researcher.availability.includes("Limited"));

    return matchesSearch && matchesExpertise && matchesAvailability;
  });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Research Collaboration Matching
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with researchers across our global network. Find collaboration partners, join research teams, 
            and contribute to groundbreaking conservation and Indigenous knowledge projects.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === "discover" ? "default" : "ghost"}
              onClick={() => setActiveTab("discover")}
              className={activeTab === "discover" ? "bg-bitcoin-orange text-white" : ""}
            >
              <Search className="w-4 h-4 mr-2" />
              Discover Researchers
            </Button>
            <Button
              variant={activeTab === "dao-projects" ? "default" : "ghost"}
              onClick={() => setActiveTab("dao-projects")}
              className={activeTab === "dao-projects" ? "bg-bitcoin-orange text-white" : ""}
            >
              <Target className="w-4 h-4 mr-2" />
              DAO Project Needs
            </Button>
            <Button
              variant={activeTab === "requests" ? "default" : "ghost"}
              onClick={() => setActiveTab("requests")}
              className={activeTab === "requests" ? "bg-bitcoin-orange text-white" : ""}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Collaboration Requests
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              onClick={() => setActiveTab("create")}
              className={activeTab === "create" ? "bg-bitcoin-orange text-white" : ""}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Post Request
            </Button>
          </div>
        </div>

        {/* Discover Researchers Tab */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="md:col-span-1">
                    <Input
                      placeholder="Search by name, expertise, or institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Availability</option>
                      <option value="available">Available Now</option>
                      <option value="limited">Limited Availability</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                </div>

                {/* Expertise Filter Tags */}
                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((expertise) => (
                    <Badge
                      key={expertise}
                      variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedExpertise.includes(expertise) 
                          ? "bg-bitcoin-orange text-white" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (selectedExpertise.includes(expertise)) {
                          setSelectedExpertise(selectedExpertise.filter(e => e !== expertise));
                        } else {
                          setSelectedExpertise([...selectedExpertise, expertise]);
                        }
                      }}
                    >
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-charcoal">
                {filteredResearchers.length} Researcher{filteredResearchers.length !== 1 ? 's' : ''} Found
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>Global Research Network</span>
              </div>
            </div>

            {/* Researcher Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredResearchers.map((researcher) => (
                <Card key={researcher.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <img
                        src={researcher.avatar}
                        alt={researcher.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{researcher.name}</CardTitle>
                            <p className="text-gray-600">{researcher.title}</p>
                            <p className="text-sm text-gray-500">{researcher.institution}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{researcher.collaborationScore}</span>
                            </div>
                            <Badge 
                              className={`mt-1 text-xs ${
                                researcher.availability === "Available" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {researcher.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{researcher.bio}</p>

                    {/* Expertise Areas */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Expertise Areas:</div>
                      <div className="flex flex-wrap gap-1">
                        {researcher.expertiseAreas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {researcher.expertiseAreas.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{researcher.expertiseAreas.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Active DAOs */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Active in DAOs:</div>
                      <div className="flex flex-wrap gap-1">
                        {researcher.activeDAOs.slice(0, 2).map((dao, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dao}
                          </Badge>
                        ))}
                        {researcher.activeDAOs.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{researcher.activeDAOs.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-blue-800 mb-2">Why this is a good match:</div>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {researcher.matchReasons.slice(0, 2).map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Profile
                      </Button>
                      <Button className="flex-1 bg-bitcoin-orange hover:bg-orange-600" size="sm">
                        <UserPlus className="w-3 h-3 mr-1" />
                        Collaborate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* DAO Project Needs Tab */}
        {activeTab === "dao-projects" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Active DAO Project Requirements</h3>
              <Badge variant="outline" className="text-sm">
                {daoProjectNeeds.length} DAOs seeking expertise
              </Badge>
            </div>
            <p className="text-gray-600">
              Current research DAOs actively seeking specific expertise to advance their projects. 
              Each project has defined roles with clear compensation and time commitments.
            </p>

            <div className="space-y-8">
              {daoProjectNeeds.map((daoProject) => (
                <Card key={daoProject.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            {daoProject.daoToken}
                          </Badge>
                          <Badge className={`${
                            daoProject.urgency === "Critical" ? "bg-red-100 text-red-800" : 
                            daoProject.urgency === "High" ? "bg-orange-100 text-orange-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {daoProject.urgency} Priority
                          </Badge>
                          <span className="text-sm text-gray-500">Phase: {daoProject.currentPhase}</span>
                        </div>
                        <CardTitle className="text-xl mb-2">{daoProject.daoName}</CardTitle>
                        <h4 className="text-lg font-medium text-gray-700 mb-3">{daoProject.projectTitle}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Funding: <strong className="text-green-600">{daoProject.fundingAllocated}</strong></span>
                          <span>Team: <strong>{daoProject.currentTeam.length} members</strong></span>
                          <span>Roles: <strong>{daoProject.requiredExpertise.length} open positions</strong></span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Current Team */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Current Team
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {daoProject.currentTeam.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Required Expertise */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Open Positions ({daoProject.requiredExpertise.length})
                      </h5>
                      
                      <div className="space-y-4">
                        {daoProject.requiredExpertise.map((role, index) => (
                          <Card key={index} className="bg-gray-50 border-l-4 border-l-bitcoin-orange">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h6 className="font-semibold text-lg">{role.role}</h6>
                                  <p className="text-gray-600 text-sm mt-1">{role.description}</p>
                                </div>
                                <Badge className={`${
                                  role.urgency === "Critical" ? "bg-red-100 text-red-800" : 
                                  role.urgency === "High" ? "bg-orange-100 text-orange-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {role.urgency}
                                </Badge>
                              </div>

                              {/* Skills Required */}
                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-1">Required Skills:</div>
                                <div className="flex flex-wrap gap-1">
                                  {role.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Role Details */}
                              <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                                <div>
                                  <div className="text-gray-500">Time Commitment</div>
                                  <div className="font-medium">{role.timeCommitment}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Duration</div>
                                  <div className="font-medium">{role.duration}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Compensation</div>
                                  <div className="font-medium text-green-600">{role.compensation}</div>
                                </div>
                              </div>

                              {/* Matched Candidates */}
                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-2">Top Matched Researchers:</div>
                                <div className="flex flex-wrap gap-2">
                                  {role.matchedCandidates.map((candidate, candidateIndex) => (
                                    <Badge key={candidateIndex} variant="outline" className="text-xs border-green-300 text-green-700">
                                      {candidate}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                <Button size="sm" className="flex-1 bg-bitcoin-orange hover:bg-orange-600">
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  Apply for Role
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Contact Team
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Next Milestones & Community Needs */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Next Milestones
                        </h5>
                        <ul className="space-y-1">
                          {daoProject.nextMilestones.map((milestone, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          Community Needs
                        </h5>
                        <ul className="space-y-1">
                          {daoProject.communityNeeds.map((need, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                              {need}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* DAO Summary Actions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-semibold text-blue-800">Ready to Join This DAO?</h6>
                          <p className="text-blue-700 text-sm">Multiple collaboration opportunities available with clear funding and roles.</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Vote className="w-3 h-3 mr-1" />
                            Join DAO
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/dao/${daoProject.daoName.toLowerCase().replace(/\s+/g, '-')}`}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            DAO Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Active Collaboration Requests</h3>
              <Badge variant="outline" className="text-sm">
                {collaborationRequests.length} open requests
              </Badge>
            </div>

            <div className="space-y-4">
              {collaborationRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Posted by: <strong>{request.requester}</strong></span>
                          <span>•</span>
                          <span>{request.daoProject}</span>
                          <span>•</span>
                          <Badge 
                            className={`text-xs ${
                              request.urgency === "High" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.urgency} Priority
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{request.matchScore}% Match</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{request.description}</p>

                    {/* Required Skills */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Required Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {request.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Time Commitment</div>
                        <div className="font-medium">{request.timeCommitment}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-medium">{request.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Compensation</div>
                        <div className="font-medium text-green-600">{request.compensation}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Deadline</div>
                        <div className="font-medium">{request.deadline}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-bitcoin-orange hover:bg-orange-600">
                        <Mail className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ask Questions
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Post Request Tab */}
        {activeTab === "create" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Post a Collaboration Request</CardTitle>
                <p className="text-gray-600">
                  Describe your research project and the type of collaboration you're seeking. 
                  Our matching algorithm will help connect you with suitable partners.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <Input placeholder="Brief, descriptive title for your collaboration request" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Associated DAO</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Select your research DAO...</option>
                      <option>Wildlife Tracking DAO</option>
                      <option>Climate Data Oracle Network</option>
                      <option>Traditional Medicine DAO</option>
                      <option>Language Preservation Protocol</option>
                      <option>Quantum-Enhanced Crypto DAO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <Textarea 
                    placeholder="Provide a detailed description of your research project, objectives, and what you hope to achieve through collaboration..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Commitment</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>1-5 hours/week</option>
                      <option>5-10 hours/week</option>
                      <option>10-20 hours/week</option>
                      <option>20+ hours/week</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Duration</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>1-3 months</option>
                      <option>3-6 months</option>
                      <option>6-12 months</option>
                      <option>12+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Urgency Level</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Required Skills & Expertise</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expertiseOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {skill} +
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add custom skills or search existing ones..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compensation & Incentives</label>
                  <Textarea 
                    placeholder="Describe compensation (DAO tokens, co-authorship, advisory positions, etc.)..."
                    rows={2}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1 bg-bitcoin-orange hover:bg-orange-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Post Collaboration Request
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Stories Section */}
        <div className="mt-16 mb-12">
          <h3 className="text-2xl font-bold text-charcoal text-center mb-8">Recent Breakthrough Collaborations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Recently Completed</Badge>
                </div>
                <h4 className="font-semibold text-lg mb-2">Quantum-Safe Conservation Data Protocol</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Dr. Quantum Singh (MIT) + Dr. Elena Rodriguez (Arctic Research) collaborated through our platform 
                  to develop quantum-resistant encryption for sensitive Indigenous knowledge data.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Collaboration Duration:</span>
                  <span className="font-medium">4 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Research Output:</span>
                  <span className="font-medium">3 papers, 1 patent</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">DAO Funding:</span>
                  <span className="font-medium text-green-600">127K tokens</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-orange-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">In Progress</Badge>
                </div>
                <h4 className="font-semibold text-lg mb-2">Indigenous Language AI Preservation</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Dr. Aiyana Littlewolf (Indigenous Tech) + Joseph Running Bear (Lakota Nation) are building 
                  AI models that respect cultural protocols while preserving endangered languages.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Started:</span>
                  <span className="font-medium">3 months ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress:</span>
                  <span className="font-medium">68% complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Community Impact:</span>
                  <span className="font-medium text-purple-600">5 languages</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">High Impact</Badge>
                </div>
                <h4 className="font-semibold text-lg mb-2">Anti-Poaching Sensor Network Expansion</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Dr. Sarah Chen (Wildlife Conservation) matched with 12 researchers across 6 countries 
                  to deploy IoT monitoring systems protecting endangered species.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Network Size:</span>
                  <span className="font-medium">2,400 sensors</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Species Protected:</span>
                  <span className="font-medium">23 endangered</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Poaching Incidents:</span>
                  <span className="font-medium text-orange-600">-67% reduction</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI-Powered Matching Insights */}
        <Card className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">AI-Powered Research Matching</h3>
                <p className="text-lg opacity-90 mb-6">
                  Our intelligent algorithm analyzes research interests, skills, DAO participation, 
                  and project compatibility to create perfect research partnerships across the global conservation network.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-200" />
                    <span>Semantic analysis of research papers and interests</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-blue-200" />
                    <span>Skill complementarity assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-200" />
                    <span>Geographic and timezone optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-blue-200" />
                    <span>Cultural compatibility and protocols respect</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">94.7%</div>
                  <div className="text-sm opacity-80 mb-4">Average Match Success Rate</div>
                  <div className="text-2xl font-bold mb-2">2.3 days</div>
                  <div className="text-sm opacity-80">Average Time to First Collaboration</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-sm text-gray-600">Active Researchers</div>
              <div className="text-xs text-gray-500 mt-1">+18% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">342</div>
              <div className="text-sm text-gray-600">Successful Matches</div>
              <div className="text-xs text-gray-500 mt-1">+12 this week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <div className="text-sm text-gray-600">Active Collaborations</div>
              <div className="text-xs text-gray-500 mt-1">Across 23 DAOs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-3xl font-bold text-bitcoin-orange mb-2">47</div>
              <div className="text-sm text-gray-600">Countries Represented</div>
              <div className="text-xs text-gray-500 mt-1">6 continents</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}