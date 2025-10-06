import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, BookOpen, FileText, Award, Library, Shield, TrendingUp } from "lucide-react";
import ThirdwebWalletConnection from "@/components/ThirdwebWalletConnection";
import InstructorProfile from "@/components/instructor/InstructorProfile";
import CourseManagement from "@/components/instructor/CourseManagement";
import ProposalManagement from "@/components/instructor/ProposalManagement";
import CredentialManagement from "@/components/instructor/CredentialManagement";
import InstructorResources from "@/components/instructor/InstructorResources";
import InstructorErrorBoundary from "@/components/instructor/ErrorBoundary";
import { useInstructorProfile, useInstructorCourses, useInstructorProposals } from "@/hooks/useInstructorData";

export default function Teach() {
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState("profile");

  // Pre-load instructor data to show comprehensive dashboard stats
  const { data: profile, isLoading: profileLoading } = useInstructorProfile(account?.address || "");
  const { data: courses = [], isLoading: coursesLoading } = useInstructorCourses(account?.address || "");
  const { data: proposals = [], isLoading: proposalsLoading } = useInstructorProposals(account?.address || "");

  const isDataLoading = profileLoading || coursesLoading || proposalsLoading;

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to access the instructor dashboard.
            </p>
            <ThirdwebWalletConnection 
              data-testid="button-connect-wallet"
              variant="default" 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.name ? `Welcome back, ${profile.name}` : "Manage your courses, proposals, and credentials"}
              </p>
            </div>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isDataLoading ? "..." : courses.length}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proposals</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isDataLoading ? "..." : proposals.length}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {profile?.verified ? "Verified" : "Pending"}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {proposals.filter((p: any) => p.status === "submitted" || p.status === "approved").length} Proposals
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <span className="font-medium">Connected wallet:</span> {account.address}
            </p>
          </div>

          {!profile && !profileLoading && (
            <Alert className="mt-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Complete your instructor profile to get started with teaching on Bitcoin University.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2"
              data-testid="tab-profile"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="flex items-center gap-2"
              data-testid="tab-courses"
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="proposals" 
              className="flex items-center gap-2"
              data-testid="tab-proposals"
            >
              <FileText className="w-4 h-4" />
              Proposals
            </TabsTrigger>
            <TabsTrigger 
              value="credentials" 
              className="flex items-center gap-2"
              data-testid="tab-credentials"
            >
              <Award className="w-4 h-4" />
              Credentials
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="flex items-center gap-2"
              data-testid="tab-resources"
            >
              <Library className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <InstructorErrorBoundary>
              <InstructorProfile walletAddress={account.address} />
            </InstructorErrorBoundary>
          </TabsContent>

          <TabsContent value="courses">
            <InstructorErrorBoundary>
              <CourseManagement walletAddress={account.address} />
            </InstructorErrorBoundary>
          </TabsContent>

          <TabsContent value="proposals">
            <InstructorErrorBoundary>
              <ProposalManagement walletAddress={account.address} />
            </InstructorErrorBoundary>
          </TabsContent>

          <TabsContent value="credentials">
            <InstructorErrorBoundary>
              <CredentialManagement walletAddress={account.address} />
            </InstructorErrorBoundary>
          </TabsContent>

          <TabsContent value="resources">
            <InstructorErrorBoundary>
              <InstructorResources />
            </InstructorErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}