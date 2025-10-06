import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useActiveAccount } from "thirdweb/react";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  MessageSquare, 
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import StudentRoster from "@/components/cohort/StudentRoster";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";
import CreateAssignmentModal from "@/components/cohort/CreateAssignmentModal";
import AddContentModal from "@/components/cohort/AddContentModal";
import AddAnnouncementModal from "@/components/cohort/AddAnnouncementModal";

interface CohortData {
  id: number;
  courseId: number;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  enrollmentOpen: boolean;
  courseName: string;
}

type TabValue = "overview" | "students" | "assignments" | "content" | "announcements" | "analytics";

export default function CohortManagement() {
  const { courseId, cohortId } = useParams<{ courseId: string; cohortId: string }>();
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  // Fetch cohort data
  const { data: cohort, isLoading: cohortLoading } = useQuery<CohortData>({
    queryKey: ["/api/course-cohorts", parseInt(cohortId || "0")],
    enabled: !!cohortId,
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/course-cohorts/${cohortId}`);
      return response.json();
    }
  });

  // Fetch enrollments count
  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ["/api/cohorts", parseInt(cohortId || "0"), "enrollments"],
    enabled: !!cohortId
  });

  // Fetch assignments count
  const { data: assignments = [] } = useQuery<any[]>({
    queryKey: ["/api/cohorts", parseInt(cohortId || "0"), "assignments"],
    enabled: !!cohortId
  });

  // Fetch announcements count
  const { data: announcements = [] } = useQuery<any[]>({
    queryKey: ["/api/cohorts", parseInt(cohortId || "0"), "announcements"],
    enabled: !!cohortId
  });

  // Fetch content count
  const { data: content = [] } = useQuery<any[]>({
    queryKey: ["/api/cohorts", parseInt(cohortId || "0"), "content"],
    enabled: !!cohortId
  });

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect your wallet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to manage this cohort.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cohortLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Cohort not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The cohort you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <Link href={`/teach/course/${courseId}/cohorts`}>
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cohorts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCohortStatus = () => {
    const now = new Date();
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);
    
    if (now < startDate) {
      return cohort.enrollmentOpen ? "upcoming-open" : "upcoming-closed";
    } else if (now >= startDate && now <= endDate) {
      return "active";
    } else {
      return "completed";
    }
  };

  const getStatusBadge = () => {
    const status = getCohortStatus();
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case "upcoming-open":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming - Open</Badge>;
      case "upcoming-closed":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Upcoming - Closed</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sidebarNavItems = [
    {
      value: "overview",
      label: "Dashboard",
      icon: BarChart3,
      badge: null
    },
    {
      value: "students",
      label: "Students",
      icon: Users,
      badge: enrollments.length
    },
    {
      value: "assignments",
      label: "Assignments",
      icon: FileText,
      badge: assignments.length
    },
    {
      value: "content",
      label: "Content",
      icon: BookOpen,
      badge: content.length
    },
    {
      value: "announcements",
      label: "Announcements",
      icon: MessageSquare,
      badge: announcements.filter((a: any) => a.published).length
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href={`/teach/course/${courseId}/cohorts`}>
                <Button variant="outline" size="sm" data-testid="button-back-to-cohorts">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cohorts
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button variant="outline" size="sm" data-testid="button-cohort-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                Cohort Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)} • Capacity: {cohort.capacity}
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-charcoal dark:text-white">{enrollments.length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-charcoal dark:text-white">{cohort.capacity - enrollments.length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarNavItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setActiveTab(item.value as TabValue)}
                      data-testid={`nav-${item.value}`}
                      className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                        activeTab === item.value
                          ? "bg-bitcoin-orange text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <Badge 
                          variant={activeTab === item.value ? "secondary" : "outline"}
                          className="ml-2"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Cohort Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-charcoal dark:text-white">{enrollments.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Students Enrolled</p>
                        </div>
                        
                        <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-charcoal dark:text-white">{assignments.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Assignments</p>
                        </div>
                        
                        <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-charcoal dark:text-white">{content.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Content Items</p>
                        </div>
                        
                        <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-charcoal dark:text-white">{announcements.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Announcements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <Users className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Student enrollment opened</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Students can now join this cohort</p>
                          </div>
                        </div>
                        
                        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Activity feed will appear here as the cohort becomes active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "students" && (
                <StudentRoster cohortId={parseInt(cohortId || "0")} />
              )}

              {activeTab === "assignments" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Assignments & Grading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Assignment Management
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create assignments, manage submissions, and handle grading here.
                      </p>
                      <CreateAssignmentModal 
                        cohortId={parseInt(cohortId || "0")}
                        trigger={
                          <Button data-testid="button-create-assignment">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Assignment
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "content" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Content Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Course Content
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Organize weekly content, materials, and resources for students here.
                      </p>
                      <AddContentModal 
                        cohortId={parseInt(cohortId || "0")}
                        trigger={
                          <Button data-testid="button-add-content">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Content
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "announcements" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Announcement Center
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Post announcements and communicate with your cohort here.
                      </p>
                      <AddAnnouncementModal 
                        cohortId={parseInt(cohortId || "0")}
                        trigger={
                          <Button data-testid="button-create-announcement">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Announcement
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Progress Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Student Analytics
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Track student progress, grades, and engagement metrics here.
                      </p>
                      <Button data-testid="button-view-analytics">
                        <Eye className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}