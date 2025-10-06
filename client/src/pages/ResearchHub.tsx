import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FlaskConical, 
  DollarSign, 
  Award, 
  FileText,
  ChevronRight,
  ExternalLink,
  Users,
  Globe,
  TrendingUp,
  Target,
  Brain,
  Rocket
} from "lucide-react";

const researchSections = [
  {
    id: "programs",
    title: "Research Programs",
    description: "Explore 63 active research DAOs across conservation technology, decentralized science, Indigenous knowledge systems, and quantum cryptography.",
    icon: FlaskConical,
    color: "blue",
    stats: { count: "63", label: "Active DAOs" },
    highlights: [
      "Conservation Technology (18 projects)",
      "Decentralized Science (14 projects)", 
      "Indigenous Knowledge Systems (22 projects)",
      "Quantum-Enhanced Cryptography (9 projects)"
    ],
    href: "/research-programs"
  },
  {
    id: "funding",
    title: "Research Funding",
    description: "Access decentralized funding marketplace with $42.8M total funding available across research DAOs with milestone-based releases.",
    icon: DollarSign,
    color: "green",
    stats: { count: "$42.8M", label: "Available Funding" },
    highlights: [
      "DAO-based funding decisions",
      "Milestone tracking systems",
      "IP-NFT minting integration",
      "Community governance voting"
    ],
    href: "/funding"
  },
  {
    id: "breakthroughs",
    title: "Breakthrough Discoveries",
    description: "Witness real-world conservation breakthroughs achieved through our collaboration platform, from quantum encryption to wildlife tracking.",
    icon: Award,
    color: "purple",
    stats: { count: "5", label: "Major Breakthroughs" },
    highlights: [
      "Quantum-safe traditional knowledge encryption",
      "Continental anti-poaching sensor network",
      "AI-powered endangered language preservation",
      "Decentralized climate data oracle network"
    ],
    href: "/breakthroughs"
  },
  {
    id: "publications",
    title: "Research Publications",
    description: "Open-access research papers, datasets, and outputs from all research DAOs with IPFS storage and community collaboration tracking.",
    icon: FileText,
    color: "orange",
    stats: { count: "17", label: "Published Papers" },
    highlights: [
      "IPFS-stored research datasets",
      "Community collaboration tracking",
      "Open access guarantees",
      "Citation and impact metrics"
    ],
    href: "/publications"
  }
];

export default function ResearchHub() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Research Ecosystem
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore our comprehensive research ecosystem spanning conservation technology, Indigenous knowledge preservation, 
            and decentralized science infrastructure across 63 active research DAOs.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <FlaskConical className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">63</div>
              <div className="text-sm text-gray-600">Active Research DAOs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">$42.8M</div>
              <div className="text-sm text-gray-600">Total Funding Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
              <div className="text-sm text-gray-600">Active Researchers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto text-bitcoin-orange mb-3" />
              <div className="text-3xl font-bold text-bitcoin-orange mb-2">5</div>
              <div className="text-sm text-gray-600">Major Breakthroughs</div>
            </CardContent>
          </Card>
        </div>

        {/* Research Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {researchSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        section.color === "blue" ? "bg-blue-100" :
                        section.color === "green" ? "bg-green-100" :
                        section.color === "purple" ? "bg-purple-100" :
                        "bg-orange-100"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          section.color === "blue" ? "text-blue-600" :
                          section.color === "green" ? "text-green-600" :
                          section.color === "purple" ? "text-purple-600" :
                          "text-orange-600"
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <Badge className={`mt-1 ${
                          section.color === "blue" ? "bg-blue-100 text-blue-800" :
                          section.color === "green" ? "bg-green-100 text-green-800" :
                          section.color === "purple" ? "bg-purple-100 text-purple-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {section.stats.count} {section.stats.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600">{section.description}</p>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Key Highlights:</h5>
                    <ul className="space-y-1">
                      {section.highlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full bg-bitcoin-orange hover:bg-orange-600"
                      onClick={() => window.location.href = section.href}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore {section.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Research Areas Overview */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Target className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Research Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Conservation Technology</h4>
                <p className="text-sm text-gray-600">IoT sensors, wildlife tracking, anti-poaching networks, and ecosystem monitoring systems</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Indigenous Knowledge</h4>
                <p className="text-sm text-gray-600">Language preservation, traditional medicine, cultural protocols, and community sovereignty</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FlaskConical className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Decentralized Science</h4>
                <p className="text-sm text-gray-600">Peer review systems, research funding, data sharing, and open science infrastructure</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Quantum Cryptography</h4>
                <p className="text-sm text-gray-600">Quantum-safe protocols, traditional knowledge encryption, and secure data systems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/research-programs"}>
            <CardContent className="p-6">
              <FlaskConical className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Research Programs</h4>
              <p className="text-sm text-gray-600 mb-3">Explore our 63 active research DAOs</p>
              <Badge className="bg-blue-100 text-blue-800">View All</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/funding"}>
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">Research Funding</h4>
              <p className="text-sm text-gray-600 mb-3">$42.8M available across programs</p>
              <Badge className="bg-green-100 text-green-800">Apply Now</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/create-dao"}>
            <CardContent className="p-6">
              <Rocket className="w-8 h-8 mx-auto text-orange-600 mb-3" />
              <h4 className="font-semibold mb-2">Create Research DAO</h4>
              <p className="text-sm text-gray-600 mb-3">Launch your own research organization</p>
              <Badge className="bg-orange-100 text-orange-800">Start Now</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/ip-nft"}>
            <CardContent className="p-6">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <h4 className="font-semibold mb-2">IP-NFT Minting</h4>
              <p className="text-sm text-gray-600 mb-3">Tokenize your research output</p>
              <Badge className="bg-purple-100 text-purple-800">Mint Now</Badge>
            </CardContent>
          </Card>
        </div>

        {/* IP-NFT Minting Section */}
        <Card className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center">
                  <Award className="w-6 h-6 mr-3" />
                  Mint Your Research IP-NFT
                </h3>
                <p className="text-lg opacity-90 mb-4">
                  Transform your research outputs into blockchain-verified intellectual property with automatic royalty distribution.
                </p>
                <div className="flex items-center space-x-6 text-sm opacity-80">
                  <span>✓ IPFS Storage</span>
                  <span>✓ Smart Contract Royalties</span>
                  <span>✓ Community Attribution</span>
                  <span>✓ Open Source Options</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/ip-nft"}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Mint IP-NFT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-bold mb-6">Join the Research Revolution</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Become part of a global research ecosystem that's solving humanity's greatest challenges through 
              decentralized collaboration, Indigenous wisdom, and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.location.href = "/research-programs"}
              >
                <Search className="w-5 h-5 mr-2" />
                Browse All Programs
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Users className="w-5 h-5 mr-2" />
                Find Collaborators
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <DollarSign className="w-5 h-5 mr-2" />
                Apply for Funding
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}