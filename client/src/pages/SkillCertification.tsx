import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  BookOpen, 
  Users, 
  Target, 
  CheckCircle, 
  Clock, 
  Star,
  TrendingUp,
  Globe,
  Zap,
  FileText,
  ChevronRight,
  Play,
  Download,
  ExternalLink,
  Shield,
  Coins,
  Calendar,
  Brain
} from "lucide-react";

const certificationPrograms = [
  {
    id: 1,
    title: "Blockchain Conservation Technology",
    description: "Master the intersection of blockchain technology and conservation science through hands-on projects across multiple DAOs.",
    level: "Advanced",
    duration: "12 weeks",
    totalModules: 8,
    participatingDAOs: ["Wildlife Tracking DAO", "Climate Data Oracle Network", "Marine Conservation Protocol"],
    skills: ["Smart Contracts", "IoT Integration", "Data Verification", "Conservation Protocols"],
    prerequisites: ["Basic Blockchain Knowledge", "Programming Experience"],
    certification: "Cross-DAO Blockchain Conservation Specialist",
    tokenRewards: "15,000 tokens across 3 DAOs",
    currentEnrollment: 147,
    completionRate: 89,
    modules: [
      {
        id: 1,
        title: "Wildlife Tracking Smart Contracts",
        dao: "Wildlife Tracking DAO",
        duration: "2 weeks",
        skills: ["Solidity", "Wildlife Data Structures", "Real-time Verification"],
        practicalProject: "Deploy IoT-blockchain integration for elephant tracking",
        mentors: ["Dr. Sarah Chen", "Dr. Kanja Mwangi"],
        status: "available"
      },
      {
        id: 2,
        title: "Climate Oracle Development",
        dao: "Climate Data Oracle Network",
        duration: "2 weeks", 
        skills: ["Chainlink Oracles", "Climate Data APIs", "Traditional Knowledge Integration"],
        practicalProject: "Build oracle combining satellite and traditional weather data",
        mentors: ["Dr. Elena Rodriguez", "Elder Thomas Crow Dog"],
        status: "available"
      },
      {
        id: 3,
        title: "Marine Conservation Sensors",
        dao: "Marine Conservation Protocol",
        duration: "1.5 weeks",
        skills: ["Underwater IoT", "Marine Data Collection", "Coral Health Monitoring"],
        practicalProject: "Deploy underwater sensor network for coral reef monitoring",
        mentors: ["Dr. Ocean Martinez", "Dr. Reef Johnson"],
        status: "available"
      }
    ]
  },
  {
    id: 2,
    title: "Indigenous Knowledge Preservation Technologies",
    description: "Learn culturally-sensitive approaches to documenting and preserving traditional knowledge using modern technologies.",
    level: "Intermediate",
    duration: "10 weeks",
    totalModules: 6,
    participatingDAOs: ["Language Preservation Protocol", "Traditional Medicine DAO", "Cultural Heritage Blockchain"],
    skills: ["Cultural Protocols", "Digital Archiving", "Community Engagement", "Ethical AI"],
    prerequisites: ["Cultural Sensitivity Training", "Basic Digital Skills"],
    certification: "Indigenous Knowledge Technology Steward",
    tokenRewards: "12,000 tokens across 3 DAOs",
    currentEnrollment: 89,
    completionRate: 94,
    modules: [
      {
        id: 1,
        title: "Language Documentation Ethics",
        dao: "Language Preservation Protocol",
        duration: "2 weeks",
        skills: ["Recording Protocols", "Community Consent", "Digital Sovereignty"],
        practicalProject: "Create community-controlled language archive system",
        mentors: ["Dr. Aiyana Littlewolf", "Joseph Running Bear"],
        status: "available"
      },
      {
        id: 2,
        title: "Traditional Medicine Database Design",
        dao: "Traditional Medicine DAO",
        duration: "2 weeks",
        skills: ["Medicinal Plant Databases", "Usage Protocols", "Healer Permissions"],
        practicalProject: "Design secure traditional medicine knowledge system",
        mentors: ["Elder Maria Ixchel", "Dr. Roberto Santos"],
        status: "available"
      }
    ]
  },
  {
    id: 3,
    title: "Decentralized Science Infrastructure",
    description: "Build the technical infrastructure for decentralized science including data sharing, peer review, and funding mechanisms.",
    level: "Expert",
    duration: "16 weeks",
    totalModules: 10,
    participatingDAOs: ["Research Funding DAO", "Open Science Protocol", "Peer Review Network"],
    skills: ["DeSci Architecture", "Peer Review Systems", "Funding Mechanisms", "Research DAOs"],
    prerequisites: ["Advanced Blockchain", "Research Experience", "DAO Governance"],
    certification: "Decentralized Science Architect",
    tokenRewards: "25,000 tokens across 4 DAOs",
    currentEnrollment: 56,
    completionRate: 78,
    modules: [
      {
        id: 1,
        title: "DAO Governance for Research",
        dao: "Research Funding DAO",
        duration: "2 weeks",
        skills: ["Research Proposal Systems", "Milestone Tracking", "Token Economics"],
        practicalProject: "Design and deploy research funding DAO",
        mentors: ["Dr. Governance Expert", "Prof. DAO Designer"],
        status: "available"
      }
    ]
  }
];

const skillBadges = [
  {
    id: 1,
    name: "IoT Conservation Specialist",
    description: "Deployed sensor networks for wildlife or environmental monitoring",
    earningCriteria: "Complete 3 IoT deployment projects across 2 DAOs",
    rarity: "Rare",
    holdersCount: 23,
    tokenValue: "5,000 tokens",
    verifyingDAOs: ["Wildlife Tracking DAO", "Climate Data Oracle Network", "Marine Conservation Protocol"],
    requiredSkills: ["Hardware Deployment", "Sensor Networks", "Field Operations", "Data Collection"],
    earned: true
  },
  {
    id: 2,
    name: "Traditional Knowledge Guardian",
    description: "Demonstrated expertise in ethical preservation of Indigenous knowledge",
    earningCriteria: "Complete cultural sensitivity training + 2 community projects",
    rarity: "Epic",
    holdersCount: 12,
    tokenValue: "8,000 tokens",
    verifyingDAOs: ["Language Preservation Protocol", "Traditional Medicine DAO", "Cultural Heritage Blockchain"],
    requiredSkills: ["Cultural Protocols", "Community Relations", "Ethical Documentation", "Digital Sovereignty"],
    earned: false
  },
  {
    id: 3,
    name: "Quantum Conservation Cryptographer",
    description: "Implemented quantum-safe encryption for sensitive conservation data",
    earningCriteria: "Deploy quantum-resistant protocols protecting traditional knowledge",
    rarity: "Legendary",
    holdersCount: 5,
    tokenValue: "15,000 tokens",
    verifyingDAOs: ["Quantum Security DAO", "Wildlife Tracking DAO", "Language Preservation Protocol"],
    requiredSkills: ["Quantum Cryptography", "Data Security", "Traditional Knowledge Protection", "Protocol Development"],
    earned: true
  },
  {
    id: 4,
    name: "Cross-DAO Collaborator",
    description: "Successfully contributed to projects across 5+ different research DAOs",
    earningCriteria: "Complete meaningful contributions to 5 different DAO projects",
    rarity: "Epic",
    holdersCount: 18,
    tokenValue: "10,000 tokens",
    verifyingDAOs: ["All participating DAOs"],
    requiredSkills: ["Multi-domain Expertise", "Collaboration", "Project Management", "Cross-team Communication"],
    earned: false
  },
  {
    id: 5,
    name: "Indigenous AI Ethics Specialist",
    description: "Developed culturally-sensitive AI systems respecting Indigenous protocols",
    earningCriteria: "Build AI systems with community consent and cultural compliance",
    rarity: "Epic",
    holdersCount: 8,
    tokenValue: "12,000 tokens",
    verifyingDAOs: ["Language Preservation Protocol", "AI Ethics Council", "Traditional Medicine DAO"],
    requiredSkills: ["Ethical AI", "Cultural Sensitivity", "Community Consent Protocols", "Indigenous Relations"],
    earned: true
  }
];

const knowledgeTransferPrograms = [
  {
    id: 1,
    title: "Wildlife-to-Marine Conservation Tech Transfer",
    sourceDAO: "Wildlife Tracking DAO",
    targetDAO: "Marine Conservation Protocol",
    focus: "Adapting terrestrial IoT tracking for underwater marine life monitoring",
    participants: 24,
    startDate: "2025-02-01",
    duration: "6 weeks",
    skills: ["Sensor Adaptation", "Underwater Technology", "Cross-environment Data"],
    outcomes: ["Underwater elephant seal tracking system", "Coral reef health monitoring", "Marine migration patterns"],
    leadExperts: ["Dr. Sarah Chen", "Dr. Ocean Martinez"],
    status: "Enrolling"
  },
  {
    id: 2,
    title: "Traditional Weather to Climate Oracle Integration",
    sourceDAO: "Climate Data Oracle Network",
    targetDAO: "Traditional Medicine DAO",
    focus: "Incorporating traditional weather indicators into medicinal plant harvesting calendars",
    participants: 18,
    startDate: "2025-01-15",
    duration: "8 weeks",
    skills: ["Traditional Indicators", "Oracle Integration", "Seasonal Medicine"],
    outcomes: ["Medicinal plant harvest optimization", "Traditional weather prediction validation", "Community health calendars"],
    leadExperts: ["Elder Thomas Crow Dog", "Dr. Elena Rodriguez"],
    status: "Active"
  },
  {
    id: 3,
    title: "Language AI to Wildlife Communication Analysis",
    sourceDAO: "Language Preservation Protocol",
    targetDAO: "Wildlife Tracking DAO",
    focus: "Applying language processing techniques to animal communication patterns",
    participants: 31,
    startDate: "2025-02-15",
    duration: "10 weeks",
    skills: ["Natural Language Processing", "Animal Communication", "Pattern Recognition"],
    outcomes: ["Elephant communication decoder", "Bird song analysis system", "Primate social structure mapping"],
    leadExperts: ["Dr. Aiyana Littlewolf", "Dr. Animal Communications"],
    status: "Upcoming"
  }
];

export default function SkillCertification() {
  const earnedBadges = skillBadges.filter(badge => badge.earned);
  const availableBadges = skillBadges.filter(badge => !badge.earned);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Award className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Cross-DAO Knowledge Transfer & Certification
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Gain verified skills across research DAOs, transfer knowledge between projects, and earn 
            blockchain-verified certifications that unlock new collaboration opportunities.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Certification Programs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Skill Badges Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">292</div>
              <div className="text-sm text-gray-600">Active Learners</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-3xl font-bold text-bitcoin-orange mb-2">3</div>
              <div className="text-sm text-gray-600">Knowledge Transfer Programs</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="certifications" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certifications">Certification Programs</TabsTrigger>
            <TabsTrigger value="badges">Skill Badges</TabsTrigger>
            <TabsTrigger value="transfer">Knowledge Transfer</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* Certification Programs Tab */}
          <TabsContent value="certifications" className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Cross-DAO Certification Programs</h3>
              <Badge variant="outline" className="text-sm">
                {certificationPrograms.length} programs available
              </Badge>
            </div>
            <p className="text-gray-600">
              Comprehensive learning paths that span multiple DAOs, teaching you to work across 
              conservation technologies, Indigenous knowledge systems, and decentralized science infrastructure.
            </p>

            <div className="space-y-8">
              {certificationPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`${
                            program.level === "Expert" ? "bg-red-100 text-red-800" : 
                            program.level === "Advanced" ? "bg-orange-100 text-orange-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {program.level}
                          </Badge>
                          <Badge variant="outline">{program.duration}</Badge>
                          <Badge variant="outline">{program.totalModules} modules</Badge>
                        </div>
                        <CardTitle className="text-2xl mb-3">{program.title}</CardTitle>
                        <p className="text-gray-600 text-lg mb-4">{program.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Enrolled: <strong>{program.currentEnrollment}</strong></span>
                          <span>Completion: <strong>{program.completionRate}%</strong></span>
                          <span>Rewards: <strong className="text-green-600">{program.tokenRewards}</strong></span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Participating DAOs */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Participating DAOs ({program.participatingDAOs.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.participatingDAOs.map((dao, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dao}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Skills Covered */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Core Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Prerequisites
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-700">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sample Modules */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Featured Modules
                      </h5>
                      <div className="space-y-3">
                        {program.modules.slice(0, 3).map((module) => (
                          <Card key={module.id} className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h6 className="font-semibold">{module.title}</h6>
                                  <p className="text-sm text-gray-600">{module.dao} • {module.duration}</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {module.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{module.practicalProject}</p>
                              <div className="flex flex-wrap gap-1">
                                {module.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Certification Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h6 className="font-semibold text-green-800 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Upon Completion: {program.certification}
                      </h6>
                      <p className="text-green-700 text-sm mb-3">
                        Blockchain-verified certification recognized across all participating DAOs with voting rights and project access privileges.
                      </p>
                      <div className="flex space-x-2">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Play className="w-3 h-3 mr-1" />
                          Enroll Now
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          View Syllabus
                        </Button>
                        <Button variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          Meet Instructors
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skill Badges Tab */}
          <TabsContent value="badges" className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Cross-DAO Skill Badges</h3>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm">
                  {earnedBadges.length}/{skillBadges.length} earned
                </Badge>
                <Badge className="bg-green-100 text-green-800 text-sm">
                  {skillBadges.reduce((sum, badge) => sum + (badge.earned ? parseInt(badge.tokenValue.replace(/[^\d]/g, '')) : 0), 0).toLocaleString()} tokens earned
                </Badge>
              </div>
            </div>

            {/* Earned Badges */}
            <div>
              <h4 className="text-xl font-semibold text-charcoal mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-bitcoin-orange" />
                Your Earned Badges ({earnedBadges.length})
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {earnedBadges.map((badge) => (
                  <Card key={badge.id} className="border-2 border-green-300 bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg">{badge.name}</h5>
                            <Badge className={`${
                              badge.rarity === "Legendary" ? "bg-purple-100 text-purple-800" :
                              badge.rarity === "Epic" ? "bg-orange-100 text-orange-800" :
                              "bg-blue-100 text-blue-800"
                            } text-xs`}>
                              {badge.rarity}
                            </Badge>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white">EARNED</Badge>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">{badge.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Token Value:</span>
                          <span className="font-medium text-green-600">{badge.tokenValue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Holders:</span>
                          <span className="font-medium">{badge.holdersCount} worldwide</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs text-gray-500 mb-2">Required Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {badge.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Download Certificate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Verify on Blockchain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Available Badges */}
            <div>
              <h4 className="text-xl font-semibold text-charcoal mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-gray-500" />
                Available Badges ({availableBadges.length})
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {availableBadges.map((badge) => (
                  <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <Award className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg">{badge.name}</h5>
                            <Badge className={`${
                              badge.rarity === "Legendary" ? "bg-purple-100 text-purple-800" :
                              badge.rarity === "Epic" ? "bg-orange-100 text-orange-800" :
                              "bg-blue-100 text-blue-800"
                            } text-xs`}>
                              {badge.rarity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">{badge.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-xs text-gray-500 mb-1">Earning Criteria:</div>
                        <div className="text-sm font-medium">{badge.earningCriteria}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Potential Reward:</span>
                          <span className="font-medium text-green-600">{badge.tokenValue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Holders:</span>
                          <span className="font-medium">{badge.holdersCount} researchers</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs text-gray-500 mb-2">Required Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {badge.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button className="flex-1 bg-bitcoin-orange hover:bg-orange-600">
                          <Target className="w-3 h-3 mr-1" />
                          Start Working Toward Badge
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Transfer Tab */}
          <TabsContent value="transfer" className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Cross-DAO Knowledge Transfer Programs</h3>
              <Badge variant="outline" className="text-sm">
                {knowledgeTransferPrograms.length} active programs
              </Badge>
            </div>
            <p className="text-gray-600">
              Specialized programs that transfer successful techniques and innovations between different 
              research DAOs, accelerating cross-domain breakthroughs and collaborative innovation.
            </p>

            <div className="space-y-6">
              {knowledgeTransferPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`${
                            program.status === "Active" ? "bg-green-100 text-green-800" :
                            program.status === "Enrolling" ? "bg-blue-100 text-blue-800" :
                            "bg-orange-100 text-orange-800"
                          }`}>
                            {program.status}
                          </Badge>
                          <Badge variant="outline">{program.duration}</Badge>
                          <Badge variant="outline">{program.participants} participants</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                        <p className="text-gray-600 mb-4">{program.focus}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Start: <strong>{program.startDate}</strong></span>
                          <span>From: <strong>{program.sourceDAO}</strong></span>
                          <span>To: <strong>{program.targetDAO}</strong></span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Skills and Outcomes */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Brain className="w-4 h-4 mr-2" />
                          Skills Transferred
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {program.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Expected Outcomes
                        </h5>
                        <ul className="space-y-1">
                          {program.outcomes.map((outcome, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Lead Experts */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Lead Experts
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.leadExperts.map((expert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {expert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-semibold text-blue-800">
                            {program.status === "Enrolling" ? "Join This Knowledge Transfer" : 
                             program.status === "Active" ? "Program In Progress" : "Coming Soon"}
                          </h6>
                          <p className="text-blue-700 text-sm">
                            {program.status === "Enrolling" ? "Limited spots available for this innovative cross-DAO program" :
                             program.status === "Active" ? "Following progress and documenting knowledge transfer outcomes" :
                             "Enrollment opens soon for this exciting collaboration opportunity"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {program.status === "Enrolling" && (
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Users className="w-3 h-3 mr-1" />
                              Enroll Now
                            </Button>
                          )}
                          {program.status === "Upcoming" && (
                            <Button variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              Get Notified
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-charcoal">Your Learning Progress</h3>
              <Badge variant="outline" className="text-sm">
                Level 3 Cross-DAO Researcher
              </Badge>
            </div>

            {/* Progress Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 mx-auto text-bitcoin-orange mb-4" />
                  <div className="text-2xl font-bold text-bitcoin-orange mb-2">3</div>
                  <div className="text-sm text-gray-600 mb-2">Badges Earned</div>
                  <Progress value={60} className="w-full" />
                  <div className="text-xs text-gray-500 mt-1">3/5 available badges</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <div className="text-2xl font-bold text-green-600 mb-2">1</div>
                  <div className="text-sm text-gray-600 mb-2">Certifications Completed</div>
                  <Progress value={33} className="w-full" />
                  <div className="text-xs text-gray-500 mt-1">1/3 programs completed</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Coins className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                  <div className="text-2xl font-bold text-purple-600 mb-2">38K</div>
                  <div className="text-sm text-gray-600 mb-2">Tokens Earned</div>
                  <div className="text-xs text-gray-500 mt-1">Across 6 different DAOs</div>
                </CardContent>
              </Card>
            </div>

            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Current Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Indigenous Knowledge Preservation Technologies</h5>
                      <p className="text-sm text-gray-600">Module 4 of 6 • Language Preservation Protocol</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">67% Complete</div>
                      <Progress value={67} className="w-24 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Wildlife-to-Marine Conservation Tech Transfer</h5>
                      <p className="text-sm text-gray-600">Week 2 of 6 • Knowledge Transfer Program</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">33% Complete</div>
                      <Progress value={33} className="w-24 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <Target className="w-6 h-6 text-bitcoin-orange mt-1" />
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">Cross-DAO Collaborator Badge</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        You've contributed to 3/5 required DAOs. Join Climate Data Oracle Network to get closer to this Epic badge.
                      </p>
                      <Button size="sm" className="bg-bitcoin-orange hover:bg-orange-600">
                        Find Climate Projects
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">Decentralized Science Infrastructure</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        Based on your blockchain experience, this Expert-level certification would be a great next challenge.
                      </p>
                      <Button size="sm" variant="outline">
                        View Prerequisites
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-6">Become a Cross-DAO Expert</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Master the skills needed to work across conservation technologies, Indigenous knowledge systems, 
              and decentralized science. Earn blockchain-verified certifications that unlock new collaboration 
              opportunities and higher-impact research roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Programs
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Award className="w-5 h-5 mr-2" />
                View My Recommendations
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Users className="w-5 h-5 mr-2" />
                Join Study Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}