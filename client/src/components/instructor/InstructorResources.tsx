import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  BookOpen, 
  Users, 
  Database, 
  Cpu, 
  Leaf, 
  Brain,
  FileText,
  Settings,
  HelpCircle
} from "lucide-react";
import { Link } from "wouter";

const resourceCategories = [
  {
    title: "Course Development",
    description: "Tools and resources for creating engaging courses",
    icon: BookOpen,
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    resources: [
      {
        name: "Curriculum Planning Guide",
        description: "Best practices for structuring blockchain education",
        type: "Guide",
        link: "#"
      },
      {
        name: "Video Production Tools",
        description: "Recommended tools for creating course videos",
        type: "Tools",
        link: "#"
      },
      {
        name: "Assessment Templates",
        description: "Pre-built templates for quizzes and assignments",
        type: "Templates",
        link: "#"
      }
    ]
  },
  {
    title: "Research Facilities",
    description: "Access to computational and research infrastructure",
    icon: Cpu,
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    resources: [
      {
        name: "High-Performance Computing",
        description: "GPU clusters for blockchain research and AI training",
        type: "Infrastructure",
        link: "/research-facilities"
      },
      {
        name: "Nature Reserve Labs",
        description: "Field research facilities in protected ecosystems",
        type: "Facilities",
        link: "/nature-reserve"
      },
      {
        name: "Quantum Computing Access",
        description: "Early access to quantum computing resources",
        type: "Infrastructure",
        link: "/research-facilities"
      }
    ]
  },
  {
    title: "DAO Governance",
    description: "Participate in platform governance and decision-making",
    icon: Users,
    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    resources: [
      {
        name: "Research DAOs",
        description: "Join or create research-focused DAOs",
        type: "Platform",
        link: "/research-programs"
      },
      {
        name: "Governance Proposals",
        description: "Submit proposals for platform improvements",
        type: "Participation",
        link: "/governance"
      },
      {
        name: "Token Economics",
        description: "Understanding platform token distribution",
        type: "Documentation",
        link: "#"
      }
    ]
  },
  {
    title: "Publication Platform",
    description: "Publish and share your research through IPNFTs",
    icon: FileText,
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    resources: [
      {
        name: "IPNFT Minting",
        description: "Mint your research as intellectual property NFTs",
        type: "Platform",
        link: "/ipnft-minting"
      },
      {
        name: "Publication Guidelines",
        description: "Standards for academic publication on the platform",
        type: "Guidelines",
        link: "#"
      },
      {
        name: "Peer Review Network",
        description: "Connect with reviewers in your field",
        type: "Network",
        link: "#"
      }
    ]
  },
  {
    title: "Indigenous Knowledge",
    description: "Resources for incorporating traditional knowledge systems",
    icon: Brain,
    color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    resources: [
      {
        name: "Cultural Protocol Guidelines",
        description: "Best practices for respectful knowledge sharing",
        type: "Guidelines",
        link: "#"
      },
      {
        name: "Traditional Knowledge Database",
        description: "Curated collection of traditional practices",
        type: "Database",
        link: "#"
      },
      {
        name: "Elder Council Network",
        description: "Connect with Indigenous knowledge keepers",
        type: "Network",
        link: "#"
      }
    ]
  },
  {
    title: "Conservation Technology",
    description: "Tools and resources for environmental research",
    icon: Leaf,
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    resources: [
      {
        name: "IoT Sensor Networks",
        description: "Deploy environmental monitoring systems",
        type: "Hardware",
        link: "#"
      },
      {
        name: "Wildlife Tracking Tools",
        description: "GPS and behavior monitoring equipment",
        type: "Equipment",
        link: "#"
      },
      {
        name: "Environmental Data APIs",
        description: "Access to real-time environmental datasets",
        type: "Data",
        link: "#"
      }
    ]
  }
];

const quickActions = [
  {
    title: "Platform Documentation",
    description: "Complete guide to using Bitcoin University",
    icon: HelpCircle,
    link: "#",
    color: "bg-blue-500"
  },
  {
    title: "Instructor Community",
    description: "Connect with other educators on the platform",
    icon: Users,
    link: "#",
    color: "bg-green-500"
  },
  {
    title: "Technical Support",
    description: "Get help with platform features and tools",
    icon: Settings,
    link: "#",
    color: "bg-orange-500"
  }
];

export default function InstructorResources() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                asChild
                data-testid={`button-quick-action-${index}`}
              >
                <a href={action.link} className="flex flex-col items-start space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${action.color} text-white`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                    {action.description}
                  </p>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resourceCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className={`${category.color} hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="w-5 h-5" />
                {category.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.resources.map((resource, resourceIndex) => (
                  <div 
                    key={resourceIndex}
                    className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                    data-testid={`resource-item-${categoryIndex}-${resourceIndex}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{resource.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {resource.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 p-1 h-auto"
                      asChild
                      data-testid={`button-resource-${categoryIndex}-${resourceIndex}`}
                    >
                      {resource.link.startsWith('/') ? (
                        <Link href={resource.link}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      ) : (
                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Complete your instructor profile",
              "Create your first course",
              "Set up course curriculum and materials",
              "Join relevant research DAOs",
              "Explore available research facilities",
              "Create credential templates for your courses",
              "Submit your first DAO proposal"
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded"
                data-testid={`checklist-item-${index}`}
              >
                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}