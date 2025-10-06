import { useState } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseCohortSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  useCourseCohorts, 
  useCreateCourseCohort, 
  useUpdateCourseCohort,
  useDeleteCourseCohort,
  useToggleCohortEnrollment,
  useInstructorCourses
} from "@/hooks/useInstructorData";
import { 
  Plus, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Edit, 
  Trash2, 
  ToggleLeft,
  ToggleRight,
  Clock,
  BookOpen,
  AlertCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActiveAccount } from "thirdweb/react";
import InstructorErrorBoundary from "@/components/instructor/ErrorBoundary";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";

interface CohortFormData {
  startDate: string;
  endDate: string;
  capacity: number;
  enrollmentOpen: boolean;
}

export default function CohortsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const account = useActiveAccount();
  const { toast } = useToast();
  
  const { data: courses = [] } = useInstructorCourses(account?.address || "");
  const course = courses.find(c => c.id.toString() === courseId);
  
  const { data: cohorts = [], isLoading } = useCourseCohorts(parseInt(courseId || "0"));
  const createCohort = useCreateCourseCohort(parseInt(courseId || "0"));
  const updateCohort = useUpdateCourseCohort();
  const deleteCohort = useDeleteCourseCohort();
  const toggleEnrollment = useToggleCohortEnrollment();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<CohortFormData>({
    resolver: zodResolver(insertCourseCohortSchema.omit({ 
      id: true, 
      courseId: true,
      enrolled: true
    })),
    defaultValues: {
      startDate: "",
      endDate: "",
      capacity: 30,
      enrollmentOpen: true
    }
  });

  const onSubmit = async (data: CohortFormData) => {
    try {
      if (isEditMode && editingCohort) {
        await updateCohort.mutateAsync({ id: editingCohort.id, cohortData: data });
        toast({
          title: "Cohort Updated",
          description: "Cohort has been updated successfully."
        });
        setIsEditMode(false);
        setEditingCohort(null);
      } else {
        await createCohort.mutateAsync(data);
        toast({
          title: "Cohort Created",
          description: "New cohort has been created successfully."
        });
      }
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} cohort. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleEditCohort = (cohort: any) => {
    setEditingCohort(cohort);
    setIsEditMode(true);
    setShowCreateForm(true);
    
    form.reset({
      startDate: cohort.startDate || "",
      endDate: cohort.endDate || "",
      capacity: cohort.capacity || 30,
      enrollmentOpen: cohort.enrollmentOpen ?? true
    });
  };

  const handleDeleteCohort = async (cohortId: number) => {
    if (window.confirm("Are you sure you want to delete this cohort? This action cannot be undone.")) {
      try {
        await deleteCohort.mutateAsync(cohortId);
        toast({
          title: "Cohort Deleted",
          description: "Cohort has been deleted successfully."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete cohort. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleEnrollment = async (cohortId: number, currentStatus: boolean) => {
    try {
      await toggleEnrollment.mutateAsync({ id: cohortId, enrollmentOpen: !currentStatus });
      toast({
        title: "Enrollment Updated",
        description: `Enrollment ${!currentStatus ? 'opened' : 'closed'} for cohort.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingCohort(null);
    setShowCreateForm(false);
    form.reset();
  };

  const getCohortStatus = (cohort: any) => {
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

  const getStatusBadge = (status: string) => {
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

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect your wallet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to manage course cohorts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!courseId || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The course you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <Link href="/teach">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEnrolled = cohorts.reduce((sum, cohort) => sum + cohort.enrolled, 0);
  const activeCohorts = cohorts.filter(cohort => getCohortStatus(cohort) === "active").length;
  const upcomingCohorts = cohorts.filter(cohort => 
    getCohortStatus(cohort) === "upcoming-open" || getCohortStatus(cohort) === "upcoming-closed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/teach">
              <Button variant="outline" size="sm" data-testid="button-back-to-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Course Management
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                Cohorts: {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage enrollment periods and student groups for your course
              </p>
            </div>
            
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cohorts</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : cohorts.length}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : totalEnrolled}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : activeCohorts}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : upcomingCohorts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Cohort Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {isEditMode ? `Edit Cohort` : "Cohort Management"}
              </CardTitle>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-cohort">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Cohort
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? "Edit Cohort" : "Create New Cohort"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode ? "Update cohort details and enrollment settings." : "Create a new cohort for your course with specific dates and capacity."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  data-testid="input-start-date"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  data-testid="input-end-date"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                data-testid="input-capacity"
                                placeholder="30" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enrollmentOpen"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Open Enrollment</FormLabel>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Allow students to enroll in this cohort
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-enrollment-open"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          data-testid={isEditMode ? "button-update-cohort" : "button-submit-cohort"}
                          className="bg-bitcoin-orange hover:bg-orange-600"
                          disabled={createCohort.isPending || updateCohort.isPending}
                        >
                          {createCohort.isPending || updateCohort.isPending ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                          ) : null}
                          {isEditMode ? "Update Cohort" : "Create Cohort"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancelEdit}
                          data-testid="button-cancel-cohort"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Cohorts Grid */}
        <InstructorErrorBoundary>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cohorts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No cohorts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first cohort to start managing course enrollment and scheduling.
                </p>
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-first-cohort">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Cohort
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Your First Cohort</DialogTitle>
                      <DialogDescription>
                        Get started by creating your first cohort with specific dates and capacity.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    data-testid="input-start-date"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    data-testid="input-end-date"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1"
                                  data-testid="input-capacity"
                                  placeholder="30" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="enrollmentOpen"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Open Enrollment</FormLabel>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Allow students to enroll in this cohort
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-enrollment-open"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-2 pt-4">
                          <Button 
                            type="submit" 
                            data-testid="button-submit-cohort"
                            className="bg-bitcoin-orange hover:bg-orange-600"
                            disabled={createCohort.isPending}
                          >
                            {createCohort.isPending ? (
                              <LoadingSpinner size="sm" className="mr-2" />
                            ) : null}
                            Create Cohort
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCancelEdit}
                            data-testid="button-cancel-cohort"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts.map((cohort: any, index: number) => {
                const status = getCohortStatus(cohort);
                const enrollmentProgress = (cohort.enrolled / cohort.capacity) * 100;
                
                return (
                  <Card key={cohort.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(status)}
                          </div>
                          <h3 className="font-semibold text-lg" data-testid={`text-cohort-dates-${index}`}>
                            {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Enrollment Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Enrollment</span>
                            <span className="font-medium" data-testid={`text-enrollment-${index}`}>
                              {cohort.enrolled}/{cohort.capacity}
                            </span>
                          </div>
                          <Progress value={enrollmentProgress} className="h-2" />
                        </div>

                        {/* Enrollment Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Enrollment {cohort.enrollmentOpen ? "Open" : "Closed"}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleEnrollment(cohort.id, cohort.enrollmentOpen)}
                            data-testid={`button-toggle-enrollment-${index}`}
                          >
                            {cohort.enrollmentOpen ? (
                              <ToggleRight className="w-4 h-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/teach/course/${courseId}/cohort/${cohort.id}`}>
                            <Button 
                              size="sm" 
                              className="bg-bitcoin-orange hover:bg-orange-600"
                              data-testid={`button-manage-cohort-${index}`}
                            >
                              <Settings className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          </Link>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditCohort(cohort)}
                            data-testid={`button-edit-cohort-${index}`}
                            disabled={showCreateForm && editingCohort?.id !== cohort.id}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteCohort(cohort.id)}
                            data-testid={`button-delete-cohort-${index}`}
                            disabled={cohort.enrolled > 0}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>

                        {cohort.enrolled > 0 && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Cannot delete cohort with enrolled students
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </InstructorErrorBoundary>
      </div>
    </div>
  );
}