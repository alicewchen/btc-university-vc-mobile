import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp,
  Target,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Globe,
  Zap,
  Brain
} from "lucide-react";

const learningPaths = [
  {
    id: "courses",
    title: "Course Offerings",
    description: "Comprehensive online and in-person courses covering Web3, blockchain development, conservation technology, and Indigenous knowledge systems.",
    icon: BookOpen,
    color: "blue",
    stats: { count: "32", label: "Available Courses" },
    highlights: [
      "25 Online Courses (Zero-Knowledge Proofs, Web3 Game Dev)",
      "7 In-Person Courses (High-Performance Computing, Genomics)",
      "Advanced filtering by delivery method and facilities",
      "Scholarship support and flexible pricing options"
    ],
    href: "/course-offerings",
    featured: [
      { name: "Blockchain Fundamentals", level: "Beginner", duration: "6 weeks" },
      { name: "Indigenous Knowledge Systems", level: "Intermediate", duration: "8 weeks" },
      { name: "Quantum Computing for Cryptography", level: "Advanced", duration: "12 weeks" }
    ]
  },
  {
    id: "certifications",
    title: "Cross-DAO Certification",
    description: "Gain blockchain-verified expertise across multiple research DAOs through comprehensive certification programs and skill badges.",
    icon: Award,
    color: "purple",
    stats: { count: "3", label: "Certification Programs" },
    highlights: [
      "Multi-DAO collaboration requirements",
      "Blockchain-verified skill badges (Rare to Legendary)",
      "Token rewards from 12K-25K across participating DAOs",
      "Knowledge transfer between conservation domains"
    ],
    href: "/certifications",
    featured: [
      { name: "Blockchain Conservation Technology", level: "Advanced", duration: "12 weeks" },
      { name: "Indigenous Knowledge Preservation", level: "Intermediate", duration: "10 weeks" },
      { name: "Decentralized Science Infrastructure", level: "Expert", duration: "16 weeks" }
    ]
  }
];

const skillBadges = [
  { name: "IoT Conservation Specialist", rarity: "Rare", holders: 23 },
  { name: "Traditional Knowledge Guardian", rarity: "Epic", holders: 12 },
  { name: "Quantum Conservation Cryptographer", rarity: "Legendary", holders: 5 },
  { name: "Cross-DAO Collaborator", rarity: "Epic", holders: 18 },
  { name: "Indigenous AI Ethics Specialist", rarity: "Epic", holders: 8 }
];

export default function LearnHub() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Learning Ecosystem
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Master conservation technologies, Indigenous knowledge systems, and decentralized science through 
            comprehensive courses and cross-DAO certification programs.
          </p>
        </div>

        {/* Learning Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">32</div>
              <div className="text-sm text-gray-600">Available Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Skill Badges</div>
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
              <div className="text-sm text-gray-600">Certification Programs</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {learningPaths.map((path) => {
            const IconComponent = path.icon;
            return (
              <Card key={path.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        path.color === "blue" ? "bg-blue-100" : "bg-purple-100"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          path.color === "blue" ? "text-blue-600" : "text-purple-600"
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                        <Badge className={`mt-1 ${
                          path.color === "blue" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}>
                          {path.stats.count} {path.stats.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600">{path.description}</p>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Key Features:</h5>
                    <ul className="space-y-1">
                      {path.highlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Featured Programs:</h5>
                    <div className="space-y-2">
                      {path.featured.map((program, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{program.name}</div>
                            <div className="text-xs text-gray-500">{program.duration}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {program.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full bg-bitcoin-orange hover:bg-orange-600"
                      onClick={() => window.location.href = path.id === "courses" ? "/course-offerings" : path.href}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore {path.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skill Badges Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Award className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Blockchain-Verified Skill Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Earn rare and exclusive skill badges that verify your expertise across multiple research DAOs. 
              Each badge is blockchain-verified and comes with token rewards.
            </p>
            
            <div className="grid md:grid-cols-5 gap-4">
              {skillBadges.map((badge, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    badge.rarity === "Legendary" ? "bg-purple-100" :
                    badge.rarity === "Epic" ? "bg-orange-100" :
                    "bg-blue-100"
                  }`}>
                    <Award className={`w-6 h-6 ${
                      badge.rarity === "Legendary" ? "text-purple-600" :
                      badge.rarity === "Epic" ? "text-orange-600" :
                      "text-blue-600"
                    }`} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <Badge className={`text-xs mb-1 ${
                    badge.rarity === "Legendary" ? "bg-purple-100 text-purple-800" :
                    badge.rarity === "Epic" ? "bg-orange-100 text-orange-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {badge.rarity}
                  </Badge>
                  <div className="text-xs text-gray-500">{badge.holders} holders</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Approach */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Target className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Our Learning Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Hands-On Learning</h4>
                <p className="text-sm text-gray-600">Real-world projects with conservation technology, Indigenous communities, and research DAOs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Community Mentorship</h4>
                <p className="text-sm text-gray-600">Learn from Indigenous knowledge keepers, DAO leaders, and expert researchers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Verified Credentials</h4>
                <p className="text-sm text-gray-600">Blockchain-verified certificates and badges that unlock collaboration opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl font-bold mb-6">Start Your Learning Journey</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Master the skills needed to contribute to groundbreaking conservation research while respecting 
              Indigenous knowledge and advancing decentralized science infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => window.location.href = "/course-offerings"}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Courses
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Award className="w-5 h-5 mr-2" />
                View Certifications
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Star className="w-5 h-5 mr-2" />
                My Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}