import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Trees, 
  Leaf, 
  Monitor, 
  BookOpen, 
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Course, CourseCurriculum } from "@shared/schema";

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner":
      return "bg-green-500";
    case "Intermediate":
      return "bg-emerald-500";
    case "Advanced":
      return "bg-bitcoin-orange";
    case "Expert":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}

// Legacy static course data - now using database
const deprecatedCourseDetails = {
  6: {
    id: 6,
    title: "Sustainable Blockchain Mining",
    description: "Learn renewable energy integration and carbon-neutral mining in our protected ecosystem.",
    level: "Intermediate",
    duration: "8 weeks",
    enrolled: 36,
    rating: 4.7,
    levelColor: "bg-green-600",
    location: "Ethereum Nature Reserve",
    format: "Field studies & environmental research",
    isNatureReserve: true,
    price: 2800,
    nextStartDate: "March 15, 2025",
    capacity: 45,
    instructor: "Dr. Elena Volkov",
    instructorTitle: "Professor of Sustainable Technology",
    overview: "This immersive course combines theoretical knowledge with hands-on experience in our 10,000-acre nature reserve. Students will work directly with renewable energy systems, study environmental impact, and develop carbon-neutral blockchain mining solutions.",
    prerequisites: [
      "Basic understanding of blockchain technology",
      "Elementary knowledge of renewable energy systems",
      "Physical fitness for outdoor field work",
      "Completed Blockchain Fundamentals or equivalent"
    ],
    curriculum: [
      {
        week: 1,
        title: "Introduction to Sustainable Mining",
        topics: ["Environmental impact of traditional mining", "Carbon footprint analysis", "Renewable energy basics"]
      },
      {
        week: 2,
        title: "Solar & Wind Integration",
        topics: ["Solar panel systems for mining", "Wind turbine optimization", "Energy storage solutions"]
      },
      {
        week: 3,
        title: "Hydroelectric Mining Systems",
        topics: ["Micro-hydro installations", "Water flow optimization", "Environmental preservation"]
      },
      {
        week: 4,
        title: "Carbon Capture Technology",
        topics: ["Direct air capture methods", "Carbon offset mechanisms", "Blockchain carbon credits"]
      },
      {
        week: 5,
        title: "Biodiversity Impact Assessment",
        topics: ["Ecosystem monitoring", "Wildlife protection protocols", "Sustainable site planning"]
      },
      {
        week: 6,
        title: "Green Mining Hardware",
        topics: ["Energy-efficient ASIC design", "Cooling system optimization", "Hardware recycling"]
      },
      {
        week: 7,
        title: "Field Implementation Project",
        topics: ["Real-world deployment", "Performance monitoring", "Environmental data collection"]
      },
      {
        week: 8,
        title: "Future of Sustainable Mining",
        topics: ["Emerging technologies", "Policy implications", "Industry transformation"]
      }
    ],
    learningOutcomes: [
      "Design and implement renewable energy systems for blockchain mining",
      "Conduct environmental impact assessments for mining operations",
      "Develop carbon-neutral mining strategies",
      "Apply biodiversity conservation principles to technology deployment",
      "Create sustainable business models for green blockchain infrastructure"
    ],
    materials: [
      "All field equipment and safety gear provided",
      "Access to renewable energy installations",
      "Environmental monitoring tools",
      "Digital course materials and research papers",
      "24/7 access to nature reserve facilities"
    ]
  },
  1: {
    id: 1,
    title: "Smart Contract Development",
    description: "Master Solidity programming and build production-ready smart contracts.",
    level: "Advanced",
    duration: "12 weeks",
    enrolled: 245,
    rating: 4.8,
    levelColor: "bg-bitcoin-orange",
    location: "Online",
    format: "Self-paced with live Q&A sessions",
    isNatureReserve: false,
    price: 1950,
    nextStartDate: "February 20, 2025",
    capacity: 300,
    instructor: "Prof. Sarah Chen",
    instructorTitle: "Senior Blockchain Architect",
    overview: "An intensive deep-dive into Solidity development with real-world projects. Students build production-grade smart contracts while learning security best practices, gas optimization, and advanced programming patterns.",
    prerequisites: [
      "Proficiency in JavaScript or Python",
      "Understanding of blockchain fundamentals",
      "Basic knowledge of cryptography",
      "Completed Blockchain Fundamentals course"
    ],
    curriculum: [
      {
        week: 1,
        title: "Solidity Fundamentals",
        topics: ["Language syntax and structure", "Data types and variables", "Functions and modifiers"]
      },
      {
        week: 2,
        title: "Contract Architecture",
        topics: ["Contract inheritance", "Interface design", "Library implementation"]
      },
      {
        week: 3,
        title: "Security Patterns",
        topics: ["Common vulnerabilities", "Security auditing", "Safe coding practices"]
      },
      {
        week: 4,
        title: "Gas Optimization",
        topics: ["Gas mechanics", "Optimization techniques", "Cost-efficient algorithms"]
      },
      {
        week: 5,
        title: "Testing & Deployment",
        topics: ["Unit testing frameworks", "Integration testing", "Deployment strategies"]
      },
      {
        week: 6,
        title: "DeFi Protocols",
        topics: ["Token standards", "DEX implementation", "Lending protocols"]
      },
      {
        week: 7,
        title: "NFT & Marketplace",
        topics: ["NFT standards", "Marketplace contracts", "Royalty systems"]
      },
      {
        week: 8,
        title: "DAO Governance",
        topics: ["Voting mechanisms", "Proposal systems", "Treasury management"]
      },
      {
        week: 9,
        title: "Layer 2 Solutions",
        topics: ["Rollup integration", "Cross-chain contracts", "Scaling solutions"]
      },
      {
        week: 10,
        title: "Advanced Patterns",
        topics: ["Proxy patterns", "Diamond standard", "Upgradeable contracts"]
      },
      {
        week: 11,
        title: "Production Deployment",
        topics: ["Mainnet deployment", "Monitoring tools", "Incident response"]
      },
      {
        week: 12,
        title: "Capstone Project",
        topics: ["Final project presentation", "Code review", "Industry feedback"]
      }
    ],
    learningOutcomes: [
      "Build secure, gas-optimized smart contracts",
      "Implement complex DeFi protocols and systems",
      "Deploy and maintain production blockchain applications",
      "Conduct thorough security audits and testing",
      "Design scalable blockchain architecture"
    ],
    materials: [
      "Complete development environment setup",
      "Access to testnet and mainnet tools",
      "Code review sessions with industry experts",
      "Library of smart contract templates",
      "Lifetime access to course updates"
    ]
  },
  7: {
    id: 7,
    title: "Biodiversity & Conservation Technology",
    description: "Apply blockchain for environmental monitoring and species protection in the wild.",
    level: "Advanced",
    duration: "10 weeks",
    enrolled: 18,
    rating: 4.8,
    levelColor: "bg-emerald-500",
    location: "Ethereum Nature Reserve",
    format: "Field research & conservation projects",
    isNatureReserve: true,
    price: 3200,
    nextStartDate: "April 8, 2025",
    capacity: 25,
    instructor: "Dr. Maria Santos",
    instructorTitle: "Director of Conservation Technology",
    overview: "This unique program combines cutting-edge blockchain technology with hands-on conservation work in our protected nature reserve. Students develop real-world solutions for wildlife monitoring, habitat preservation, and biodiversity tracking while working directly with endangered species.",
    prerequisites: [
      "Background in biology, environmental science, or computer science",
      "Basic programming skills (Python or JavaScript)",
      "Physical ability for outdoor fieldwork",
      "Passion for environmental conservation"
    ],
    curriculum: [
      {
        week: 1,
        title: "Conservation Technology Fundamentals",
        topics: ["Biodiversity monitoring methods", "IoT sensors for wildlife tracking", "Data collection protocols"]
      },
      {
        week: 2,
        title: "Blockchain for Environmental Data",
        topics: ["Immutable data recording", "Smart contracts for conservation", "Decentralized databases"]
      },
      {
        week: 3,
        title: "Wildlife Tracking Systems",
        topics: ["GPS collar technology", "Camera trap networks", "Real-time monitoring"]
      },
      {
        week: 4,
        title: "Species Identification AI",
        topics: ["Computer vision models", "Audio pattern recognition", "Automated species counting"]
      },
      {
        week: 5,
        title: "Habitat Mapping & Analysis",
        topics: ["Drone surveying", "Satellite imagery analysis", "Ecosystem health metrics"]
      },
      {
        week: 6,
        title: "Carbon Credit Systems",
        topics: ["Forest carbon measurement", "Blockchain verification", "Trading platforms"]
      },
      {
        week: 7,
        title: "Community Engagement Platform",
        topics: ["Citizen science apps", "Educational outreach", "Stakeholder coordination"]
      },
      {
        week: 8,
        title: "Conservation Project Development",
        topics: ["Project planning", "Impact measurement", "Funding strategies"]
      },
      {
        week: 9,
        title: "Field Implementation",
        topics: ["System deployment", "Data validation", "Real-world testing"]
      },
      {
        week: 10,
        title: "Project Presentation & Future Planning",
        topics: ["Results analysis", "Scalability planning", "Publication preparation"]
      }
    ],
    learningOutcomes: [
      "Design blockchain-based systems for environmental monitoring",
      "Implement IoT networks for wildlife conservation",
      "Develop AI models for species identification and tracking",
      "Create carbon credit verification systems",
      "Lead conservation technology projects from conception to deployment"
    ],
    materials: [
      "Professional wildlife tracking equipment",
      "Drone technology for aerial surveys",
      "Access to protected wildlife areas",
      "Blockchain development tools and platforms",
      "Research collaboration with conservation organizations"
    ]
  },
  2: {
    id: 2,
    title: "Blockchain Fundamentals",
    description: "Introduction to distributed systems and cryptocurrency technologies.",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 412,
    rating: 4.9,
    levelColor: "bg-green-500",
    location: "Online",
    format: "Interactive modules with virtual labs",
    isNatureReserve: false,
    price: 850,
    nextStartDate: "February 1, 2025",
    capacity: 500,
    instructor: "Prof. David Wilson",
    instructorTitle: "Blockchain Education Specialist",
    overview: "A comprehensive introduction to blockchain technology designed for beginners. This course covers the fundamental concepts, practical applications, and hands-on experience needed to understand and work with blockchain systems.",
    prerequisites: [
      "Basic computer literacy",
      "High school mathematics",
      "No prior blockchain experience required",
      "Curiosity about decentralized technologies"
    ],
    curriculum: [
      {
        week: 1,
        title: "What is Blockchain?",
        topics: ["History of digital currency", "Centralized vs decentralized systems", "Basic cryptography"]
      },
      {
        week: 2,
        title: "Bitcoin Deep Dive",
        topics: ["Bitcoin whitepaper analysis", "Mining and consensus", "Transaction mechanics"]
      },
      {
        week: 3,
        title: "Ethereum & Smart Contracts",
        topics: ["Ethereum virtual machine", "Smart contract basics", "Gas and transaction fees"]
      },
      {
        week: 4,
        title: "Cryptocurrency Wallets & Security",
        topics: ["Wallet types and security", "Private key management", "Best practices"]
      },
      {
        week: 5,
        title: "Decentralized Finance (DeFi)",
        topics: ["DeFi ecosystem overview", "DEXs and liquidity pools", "Yield farming basics"]
      },
      {
        week: 6,
        title: "NFTs & Digital Assets",
        topics: ["Non-fungible tokens", "Digital ownership", "NFT marketplaces"]
      },
      {
        week: 7,
        title: "Alternative Blockchains",
        topics: ["Proof of stake", "Layer 2 solutions", "Cross-chain technology"]
      },
      {
        week: 8,
        title: "Blockchain Applications & Future",
        topics: ["Real-world use cases", "Industry adoption", "Future developments"]
      }
    ],
    learningOutcomes: [
      "Understand core blockchain concepts and terminology",
      "Explain how Bitcoin and Ethereum work",
      "Set up and use cryptocurrency wallets securely",
      "Identify blockchain applications across industries",
      "Make informed decisions about blockchain investments"
    ],
    materials: [
      "Interactive online learning platform",
      "Virtual blockchain simulators",
      "Cryptocurrency for hands-on practice",
      "Access to major blockchain explorers",
      "Community discussion forums"
    ]
  }
};

export default function CourseDetail() {
  const [location] = useLocation();
  const courseId = parseInt(location.split('/').pop() || '0');
  
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    queryFn: () => fetch(`/api/courses/${courseId}`).then(res => {
      if (!res.ok) throw new Error('Course not found');
      return res.json();
    }),
  });

  const { data: curriculum, isLoading: curriculumLoading } = useQuery<CourseCurriculum[]>({
    queryKey: ["/api/courses", courseId, "curriculum"],
    queryFn: () => fetch(`/api/courses/${courseId}/curriculum`).then(res => res.json()),
    enabled: !!course,
  });

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-bitcoin-orange" />
          <span className="text-lg text-gray-600">Loading course details...</span>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Course Not Found</h1>
          <Link href="/courses">
            <Button className="bg-bitcoin-orange hover:bg-orange-600">
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    console.log(`Enrolling in ${course.title}...`);
    // TODO: Integrate with BUFeeRouter.sol for payment processing
  };

  const completionPercentage = (course.enrolled / course.capacity) * 100;
  const levelColor = getLevelColor(course.level);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/courses">
            <Button variant="ghost" className="mb-4 text-bitcoin-orange hover:text-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={`h-64 ${course.isNatureReserve ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-bitcoin-orange to-orange-600'} relative`}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex items-center justify-center text-center text-white p-8">
                <div>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Badge className={`${levelColor} text-white text-lg px-4 py-2`}>
                      {course.level}
                    </Badge>
                    {course.isNatureReserve && (
                      <Badge variant="outline" className="border-white text-white bg-white bg-opacity-20 text-lg px-4 py-2">
                        <Trees className="w-4 h-4 mr-2" />
                        Nature Reserve
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                  <p className="text-xl opacity-90 max-w-2xl">{course.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-bitcoin-orange" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {course.isNatureReserve ? (
                    <Trees className="w-5 h-5 text-green-600" />
                  ) : (
                    <Monitor className="w-5 h-5 text-bitcoin-orange" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{course.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-bitcoin-orange" />
                  <div>
                    <p className="text-sm text-gray-600">Enrolled</p>
                    <p className="font-semibold">{course.enrolled}/{course.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{course.rating}/5.0</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Course Capacity</span>
                  <span className="text-sm font-medium">{completionPercentage.toFixed(0)}% Full</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{course.overview}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="space-y-4">
                {curriculumLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-bitcoin-orange" />
                    <span className="ml-2 text-gray-600">Loading curriculum...</span>
                  </div>
                ) : curriculum && curriculum.length > 0 ? (
                  curriculum.map((week) => (
                    <Card key={week.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Week {week.week}: {week.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {week.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-bitcoin-orange" />
                              <span className="text-gray-700">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 text-center">Curriculum information will be available soon.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="outcomes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Award className="w-5 h-5 text-bitcoin-orange mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="materials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials & Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.materials.map((material, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{material}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className={course.isNatureReserve ? 'border-green-200' : 'border-orange-200'}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-charcoal mb-2">
                    ${parseFloat(course.price).toLocaleString()}
                  </div>
                  <p className="text-gray-600">Full course tuition</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next Start Date</span>
                    <span className="font-medium">{course.nextStartDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-medium">{course.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Spots Available</span>
                    <span className="font-medium text-green-600">{course.capacity - course.enrolled}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleEnroll}
                  className={`w-full ${course.isNatureReserve ? 'bg-green-600 hover:bg-green-700' : 'bg-bitcoin-orange hover:bg-orange-600'} text-lg py-3`}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Enroll Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment processed through BUFeeRouter.sol (1% platform fee)
                </p>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-20 h-20 bg-bitcoin-orange rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg">{course.instructor}</h3>
                  <p className="text-gray-600 text-sm">{course.instructorTitle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-medium">{course.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}