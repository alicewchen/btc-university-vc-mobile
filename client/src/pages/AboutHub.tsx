import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  MapPin, 
  FlaskConical, 
  Users,
  Globe,
  Heart,
  ChevronRight,
  ExternalLink,
  Shield,
  Award,
  BookOpen,
  Target
} from "lucide-react";

const aboutSections = [
  {
    id: "nature-reserve",
    title: "Global Nature Reserve Network",
    description: "Explore our global network of 15 protected conservation sites dedicated to open education, scientific research, and Indigenous community access.",
    icon: Leaf,
    color: "green",
    stats: { count: "15", label: "Protected Sites" },
    highlights: [
      "Protected conservation sites across 6 continents",
      "Indigenous community ancestral land access",
      "Open education and scientific research facilities",
      "Sustainable technology research centers"
    ],
    href: "/nature-reserve"
  },
  {
    id: "campuses",
    title: "Global Research Campuses",
    description: "Visit our research centers and campuses around the world, from Arctic research stations to tropical conservation labs.",
    icon: MapPin,
    color: "blue",
    stats: { count: "23", label: "Global Locations" },
    highlights: [
      "Arctic research stations in Nunavut",
      "Tropical conservation labs in Costa Rica",
      "Desert ecology centers in Morocco",
      "Marine research facilities in New Zealand"
    ],
    href: "/campuses"
  },
  {
    id: "facilities",
    title: "Research Facilities",
    description: "State-of-the-art laboratories, computing centers, and field research equipment for conservation technology development.",
    icon: FlaskConical,
    color: "purple",
    stats: { count: "12", label: "Research Labs" },
    highlights: [
      "High-performance computing clusters",
      "Genomics and biotechnology laboratories",
      "IoT sensor development facilities",
      "Traditional knowledge documentation centers"
    ],
    href: "/facilities"
  }
];

const missionValues = [
  {
    title: "Indigenous Knowledge Preservation",
    description: "Respectfully documenting and preserving traditional knowledge while ensuring community sovereignty and consent protocols.",
    icon: Heart,
    color: "red"
  },
  {
    title: "Open Science Infrastructure",
    description: "Building decentralized research systems that prioritize transparency, collaboration, and community governance.",
    icon: BookOpen,
    color: "blue"
  },
  {
    title: "Conservation Technology",
    description: "Developing innovative technologies for wildlife protection, ecosystem monitoring, and environmental sustainability.",
    icon: Shield,
    color: "green"
  },
  {
    title: "Global Collaboration",
    description: "Connecting researchers across cultures and continents to tackle humanity's greatest environmental challenges.",
    icon: Globe,
    color: "purple"
  }
];

export default function AboutHub() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <Leaf className="w-8 h-8 mr-3 text-bitcoin-orange" />
            About Bitcoin University
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">A decentralized research institution bridging conservation sites and research facilities dedicated to advancing scientific research through cutting-edge technology and decentralized collaboration for the future of humanity.</p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Build a comprehensive Web3 research and development marketplace that functions as a "Research-Institution-as-a-Service" 
                  dApp centered around a global network of protected conservation sites. We facilitate collaboration between scientists, 
                  funders, students, and Indigenous communities on cutting-edge blockchain research projects while ensuring access 
                  to Indigenous communities with ancestral connections to protected lands.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {aboutSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      section.color === "green" ? "bg-green-100" :
                      section.color === "blue" ? "bg-blue-100" :
                      "bg-purple-100"
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        section.color === "green" ? "text-green-600" :
                        section.color === "blue" ? "text-blue-600" :
                        "text-purple-600"
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <Badge className={`${
                        section.color === "green" ? "bg-green-100 text-green-800" :
                        section.color === "blue" ? "bg-blue-100 text-blue-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {section.stats.count} {section.stats.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600">{section.description}</p>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Features:</h5>
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
                      variant="outline" 
                      className="w-full"
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

        {/* Core Values */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Heart className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Our Core Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {missionValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      value.color === "red" ? "bg-red-100" :
                      value.color === "blue" ? "bg-blue-100" :
                      value.color === "green" ? "bg-green-100" :
                      "bg-purple-100"
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        value.color === "red" ? "text-red-600" :
                        value.color === "blue" ? "text-blue-600" :
                        value.color === "green" ? "text-green-600" :
                        "text-purple-600"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{value.title}</h4>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Impact Numbers */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Award className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Global Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                <div className="text-sm text-gray-600">Protected Conservation Sites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">63</div>
                <div className="text-sm text-gray-600">Active Research DAOs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
                <div className="text-sm text-gray-600">Global Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bitcoin-orange mb-2">23</div>
                <div className="text-sm text-gray-600">Countries Represented</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Partnerships */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Users className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Indigenous Partnerships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We work respectfully with Indigenous communities worldwide, ensuring that traditional knowledge 
              is preserved with proper protocols, consent, and community sovereignty. Our partnerships are 
              built on mutual respect, shared benefits, and cultural understanding.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Community Consent Protocols</h5>
                <p className="text-sm text-green-700">Every project follows strict community consent and data sovereignty frameworks.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Traditional Knowledge Protection</h5>
                <p className="text-sm text-blue-700">Quantum-safe encryption protects sensitive traditional knowledge and cultural information.</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-800 mb-2">Shared Benefits</h5>
                <p className="text-sm text-purple-700">Communities receive fair compensation and retain ownership of their traditional knowledge.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <Leaf className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl font-bold mb-6">Join Our Global Conservation Network</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Become part of a respectful, innovative research ecosystem that's protecting our planet while 
              honoring Indigenous wisdom and advancing scientific knowledge for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <MapPin className="w-5 h-5 mr-2" />
                Visit Campuses
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <FlaskConical className="w-5 h-5 mr-2" />
                Tour Facilities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}