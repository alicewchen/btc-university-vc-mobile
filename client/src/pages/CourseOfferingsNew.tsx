import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Clock,
  Users,
  MapPin,
  Globe,
  Laptop,
  Award,
  ChevronRight,
  Target,
  Brain,
  Zap,
  Heart,
  TrendingUp,
  ExternalLink
} from "lucide-react";

const courseCategories = [
  {
    id: "blockchain",
    title: "Blockchain & Web3",
    description: "Master decentralized technologies for research infrastructure",
    icon: Zap,
    color: "blue",
    courseCount: 12,
    difficulty: "Beginner to Advanced",
    featured: [
      { name: "Smart Contract Development", level: "Intermediate", duration: "8 weeks", rating: 4.8 },
      { name: "Zero-Knowledge Proofs", level: "Advanced", duration: "10 weeks", rating: 4.9 },
      { name: "DeFi for Research Funding", level: "Beginner", duration: "6 weeks", rating: 4.7 }
    ]
  },
  {
    id: "conservation",
    title: "Conservation Technology",
    description: "IoT sensors, wildlife tracking, and environmental monitoring",
    icon: Heart,
    color: "green",
    courseCount: 8,
    difficulty: "Intermediate to Expert",
    featured: [
      { name: "IoT Sensor Networks", level: "Intermediate", duration: "10 weeks", rating: 4.8 },
      { name: "Wildlife Tracking Systems", level: "Advanced", duration: "12 weeks", rating: 4.9 },
      { name: "Environmental Data Analysis", level: "Intermediate", duration: "8 weeks", rating: 4.7 }
    ]
  },
  {
    id: "indigenous",
    title: "Indigenous Knowledge Systems",
    description: "Traditional knowledge preservation and cultural protocols",
    icon: Brain,
    color: "purple",
    courseCount: 6,
    difficulty: "All Levels",
    featured: [
      { name: "Traditional Medicine Documentation", level: "Beginner", duration: "8 weeks", rating: 4.9 },
      { name: "Cultural Protocol Design", level: "Intermediate", duration: "10 weeks", rating: 4.8 },
      { name: "Language Preservation Technology", level: "Advanced", duration: "12 weeks", rating: 4.9 }
    ]
  },
  {
    id: "computing",
    title: "High-Performance Computing",
    description: "GPU programming, distributed computing, and genomics",
    icon: TrendingUp,
    color: "orange",
    courseCount: 6,
    difficulty: "Advanced to Expert",
    featured: [
      { name: "GPU Programming for Research", level: "Advanced", duration: "10 weeks", rating: 4.8 },
      { name: "Distributed Genomic Computing", level: "Expert", duration: "14 weeks", rating: 4.9 },
      { name: "Quantum Computing Fundamentals", level: "Advanced", duration: "12 weeks", rating: 4.7 }
    ]
  }
];

const personalizedRecommendations = [
  {
    title: "Smart Contract Development",
    category: "Blockchain & Web3",
    level: "Intermediate",
    duration: "8 weeks",
    rating: 4.8,
    enrolledCount: 234,
    reason: "Matches your interest in decentralized funding",
    nextStart: "February 10, 2025",
    price: "Free with DAO membership"
  },
  {
    title: "Indigenous Knowledge Systems",
    category: "Cultural Studies",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.9,
    enrolledCount: 189,
    reason: "Complements your conservation research",
    nextStart: "February 15, 2025",
    price: "Scholarship available"
  },
  {
    title: "IoT Sensor Networks",
    category: "Conservation Technology",
    level: "Intermediate",
    duration: "10 weeks",
    rating: 4.8,
    enrolledCount: 156,
    reason: "Perfect for wildlife monitoring projects",
    nextStart: "February 20, 2025",
    price: "$299 (50% scholarship)"
  }
];

const allCourses = [
  // Blockchain & Web3 Courses
  { id: 1, title: "Smart Contract Development", category: "blockchain", level: "Intermediate", duration: "8 weeks", rating: 4.8, price: "Free", delivery: "Online" },
  { id: 2, title: "Zero-Knowledge Proofs", category: "blockchain", level: "Advanced", duration: "10 weeks", rating: 4.9, price: "$599", delivery: "Online" },
  { id: 3, title: "DeFi for Research Funding", category: "blockchain", level: "Beginner", duration: "6 weeks", rating: 4.7, price: "Free", delivery: "Online" },
  { id: 4, title: "Blockchain Infrastructure", category: "blockchain", level: "Advanced", duration: "12 weeks", rating: 4.8, price: "$799", delivery: "Hybrid" },
  { id: 5, title: "Web3 Game Development", category: "blockchain", level: "Intermediate", duration: "10 weeks", rating: 4.6, price: "$699", delivery: "Online" },
  
  // Conservation Technology Courses  
  { id: 6, title: "IoT Sensor Networks", category: "conservation", level: "Intermediate", duration: "10 weeks", rating: 4.8, price: "$499", delivery: "In-Person" },
  { id: 7, title: "Wildlife Tracking Systems", category: "conservation", level: "Advanced", duration: "12 weeks", rating: 4.9, price: "$899", delivery: "In-Person" },
  { id: 8, title: "Environmental Data Analysis", category: "conservation", level: "Intermediate", duration: "8 weeks", rating: 4.7, price: "$399", delivery: "Online" },
  { id: 9, title: "Anti-Poaching Technology", category: "conservation", level: "Advanced", duration: "14 weeks", rating: 4.9, price: "$1099", delivery: "In-Person" },
  { id: 10, title: "Climate Monitoring Systems", category: "conservation", level: "Intermediate", duration: "9 weeks", rating: 4.8, price: "$599", delivery: "Hybrid" },
  
  // Indigenous Knowledge Courses
  { id: 11, title: "Traditional Medicine Documentation", category: "indigenous", level: "Beginner", duration: "8 weeks", rating: 4.9, price: "Free", delivery: "In-Person" },
  { id: 12, title: "Cultural Protocol Design", category: "indigenous", level: "Intermediate", duration: "10 weeks", rating: 4.8, price: "Scholarship", delivery: "In-Person" },
  { id: 13, title: "Language Preservation Technology", category: "indigenous", level: "Advanced", duration: "12 weeks", rating: 4.9, price: "Scholarship", delivery: "Hybrid" },
  { id: 14, title: "Indigenous Data Sovereignty", category: "indigenous", level: "Intermediate", duration: "6 weeks", rating: 4.8, price: "Free", delivery: "Online" },
  { id: 15, title: "Traditional Ecological Knowledge", category: "indigenous", level: "Beginner", duration: "8 weeks", rating: 4.9, price: "Free", delivery: "In-Person" },
  
  // High-Performance Computing Courses
  { id: 16, title: "GPU Programming for Research", category: "computing", level: "Advanced", duration: "10 weeks", rating: 4.8, price: "$799", delivery: "In-Person" },
  { id: 17, title: "Distributed Genomic Computing", category: "computing", level: "Expert", duration: "14 weeks", rating: 4.9, price: "$1299", delivery: "In-Person" },
  { id: 18, title: "Quantum Computing Fundamentals", category: "computing", level: "Advanced", duration: "12 weeks", rating: 4.7, price: "$999", delivery: "Hybrid" },
  { id: 19, title: "Parallel Processing for Climate Data", category: "computing", level: "Advanced", duration: "10 weeks", rating: 4.8, price: "$699", delivery: "Online" },
  { id: 20, title: "Blockchain-Enhanced Genomics", category: "computing", level: "Expert", duration: "16 weeks", rating: 4.9, price: "$1499", delivery: "In-Person" }
];

const learningPaths = [
  {
    title: "Conservation Researcher Track",
    description: "Complete program for environmental scientists",
    courses: 4,
    duration: "6 months",
    skillsGained: ["IoT Development", "Data Analysis", "Traditional Knowledge"],
    completion: 68
  },
  {
    title: "Blockchain Developer Track",
    description: "Master decentralized application development",
    courses: 5,
    duration: "8 months",
    skillsGained: ["Smart Contracts", "DeFi", "Zero-Knowledge Proofs"],
    completion: 24
  },
  {
    title: "Indigenous Knowledge Guardian",
    description: "Preserve and protect cultural heritage",
    courses: 3,
    duration: "4 months",
    skillsGained: ["Cultural Protocols", "Language Tech", "Community Governance"],
    completion: 0
  }
];

export default function CourseOfferingsNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 mr-3 text-bitcoin-orange" />
            Course Offerings
          </h1>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses, skills, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Target className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Recommended for You
            </CardTitle>
            <p className="text-gray-600">Based on your research interests and career goals</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {personalizedRecommendations.map((course, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {course.reason}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {course.enrolledCount} enrolled
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-600">
                        <strong>Next Start:</strong> {course.nextStart}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Price:</strong> {course.price}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-bitcoin-orange hover:bg-orange-600"
                      onClick={() => window.location.href = `/courses/${index + 1}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtered Course Results */}
        {showAllCourses && selectedCategory && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center">
                  <Filter className="w-6 h-6 mr-3 text-bitcoin-orange" />
                  {selectedCategory === "blockchain" ? "Blockchain & Web3 Courses" :
                   selectedCategory === "conservation" ? "Conservation Technology Courses" :
                   selectedCategory === "indigenous" ? "Indigenous Knowledge Courses" :
                   selectedCategory === "computing" ? "High-Performance Computing Courses" :
                   selectedCategory === "online" ? "Online Courses" :
                   selectedCategory === "in-person" ? "In-Person Courses" :
                   selectedCategory === "scholarship" ? "Scholarship Supported Courses" : "All Courses"}
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAllCourses(false);
                    setSelectedCategory(null);
                  }}
                >
                  Show All Categories
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses
                  .filter(course => {
                    if (selectedCategory === "blockchain" || selectedCategory === "conservation" || 
                        selectedCategory === "indigenous" || selectedCategory === "computing") {
                      return course.category === selectedCategory;
                    }
                    if (selectedCategory === "online") return course.delivery === "Online";
                    if (selectedCategory === "in-person") return course.delivery === "In-Person";
                    if (selectedCategory === "scholarship") return course.price === "Free" || course.price === "Scholarship";
                    return true;
                  })
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/courses/${course.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={`text-xs ${
                            course.level === "Beginner" ? "bg-green-100 text-green-800" :
                            course.level === "Intermediate" ? "bg-blue-100 text-blue-800" :
                            course.level === "Advanced" ? "bg-orange-100 text-orange-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {course.level}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{course.rating}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{course.title}</h4>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {course.delivery}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-bitcoin-orange">{course.price}</span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Categories */}
        {!showAllCourses && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
          {courseCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        category.color === "blue" ? "bg-blue-100" :
                        category.color === "green" ? "bg-green-100" :
                        category.color === "purple" ? "bg-purple-100" :
                        "bg-orange-100"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          category.color === "blue" ? "text-blue-600" :
                          category.color === "green" ? "text-green-600" :
                          category.color === "purple" ? "text-purple-600" :
                          "text-orange-600"
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <Badge className={`mt-1 ${
                          category.color === "blue" ? "bg-blue-100 text-blue-800" :
                          category.color === "green" ? "bg-green-100 text-green-800" :
                          category.color === "purple" ? "bg-purple-100 text-purple-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {category.courseCount} Courses
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600">{category.description}</p>
                  <div className="text-sm text-gray-500">
                    <strong>Difficulty:</strong> {category.difficulty}
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Featured Courses:</h5>
                    <div className="space-y-2">
                      {category.featured.map((course, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => window.location.href = `/courses/${index + 1}`}
                        >
                          <div>
                            <div className="font-medium text-sm">{course.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                              <Star className="w-3 h-3 ml-2 mr-1 text-yellow-400 fill-current" />
                              {course.rating}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowAllCourses(true);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Browse All {category.title} Courses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}

        {/* Learning Paths */}
        {!showAllCourses && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Award className="w-6 h-6 mr-3 text-bitcoin-orange" />
              Structured Learning Paths
            </CardTitle>
            <p className="text-gray-600">Complete career-focused programs with guided progression</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <Card key={index} className="border-2 border-dashed border-gray-200 hover:border-bitcoin-orange transition-colors">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">{path.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Courses:</span>
                        <span className="font-medium">{path.courses} courses</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{path.duration}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Skills Gained:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.skillsGained.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {path.completion > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-bitcoin-orange h-2 rounded-full" 
                              style={{ width: `${path.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{path.completion}% complete</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant={path.completion > 0 ? "default" : "outline"} 
                      className="w-full"
                    >
                      {path.completion > 0 ? "Continue Path" : "Start Learning Path"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Quick Access */}
        {!showAllCourses && (
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedCategory("online");
              setShowAllCourses(true);
            }}
          >
            <CardContent className="p-6">
              <Globe className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Online Courses</h4>
              <p className="text-sm text-gray-600 mb-3">{allCourses.filter(c => c.delivery === "Online").length} available courses</p>
              <Badge className="bg-blue-100 text-blue-800">Self-paced</Badge>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedCategory("in-person");
              setShowAllCourses(true);
            }}
          >
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">In-Person</h4>
              <p className="text-sm text-gray-600 mb-3">{allCourses.filter(c => c.delivery === "In-Person").length} intensive programs</p>
              <Badge className="bg-green-100 text-green-800">Campus-based</Badge>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = "/certifications"}
          >
            <CardContent className="p-6">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <h4 className="font-semibold mb-2">Certifications</h4>
              <p className="text-sm text-gray-600 mb-3">Blockchain-verified</p>
              <Badge className="bg-purple-100 text-purple-800">NFT Badges</Badge>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedCategory("scholarship");
              setShowAllCourses(true);
            }}
          >
            <CardContent className="p-6">
              <Heart className="w-8 h-8 mx-auto text-red-600 mb-3" />
              <h4 className="font-semibold mb-2">Scholarships</h4>
              <p className="text-sm text-gray-600 mb-3">{allCourses.filter(c => c.price === "Free" || c.price === "Scholarship").length} supported courses</p>
              <Badge className="bg-red-100 text-red-800">Apply now</Badge>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join a community of researchers, conservationists, and innovators building 
              sustainable technology solutions for our planet's greatest challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Target className="w-5 h-5 mr-2" />
                Take Skill Assessment
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <Users className="w-5 h-5 mr-2" />
                Talk to Advisor
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <Award className="w-5 h-5 mr-2" />
                Apply for Scholarship
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}