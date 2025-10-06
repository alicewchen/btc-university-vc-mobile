import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { insertCohortEnrollmentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Trash2,
  Edit,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  UserCheck,
  UserX
} from "lucide-react";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";

interface CohortEnrollment {
  id: number;
  cohortId: number;
  userId: number;
  enrolledAt: string;
  status: string;
  progress: number;
  lastActiveAt: string;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
}

interface StudentRosterProps {
  cohortId: number;
}

export default function StudentRoster({ cohortId }: StudentRosterProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch enrollments
  const { data: enrollments = [], isLoading, error } = useQuery<CohortEnrollment[]>({
    queryKey: ["/api/cohorts", cohortId, "enrollments"],
    enabled: !!cohortId
  });

  // Add student form
  const form = useForm({
    resolver: zodResolver(insertCohortEnrollmentSchema.omit({ 
      id: true, 
      cohortId: true,
      enrolledAt: true,
      lastActiveAt: true
    })),
    defaultValues: {
      userId: 0,
      status: "active",
      progress: 0
    }
  });

  // Mutations
  const addStudentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/cohorts/${cohortId}/enrollments`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "enrollments"] });
      setShowAddDialog(false);
      form.reset();
      toast({
        title: "Student Added",
        description: "Student has been successfully enrolled in the cohort."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CohortEnrollment> }) => {
      const response = await apiRequest("PATCH", `/api/enrollments/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "enrollments"] });
      toast({
        title: "Student Updated",
        description: "Student enrollment has been updated."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive"
      });
    }
  });

  const removeStudentMutation = useMutation({
    mutationFn: async (enrollmentId: number) => {
      const response = await apiRequest("DELETE", `/api/enrollments/${enrollmentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "enrollments"] });
      toast({
        title: "Student Removed",
        description: "Student has been removed from the cohort."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove student. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: any) => {
    addStudentMutation.mutate(data);
  };

  const handleStatusChange = (enrollmentId: number, newStatus: string) => {
    updateEnrollmentMutation.mutate({ 
      id: enrollmentId, 
      data: { status: newStatus } 
    });
  };

  const handleRemoveStudent = (enrollmentId: number) => {
    if (window.confirm("Are you sure you want to remove this student from the cohort?")) {
      removeStudentMutation.mutate(enrollmentId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Completed</Badge>;
      case "withdrawn":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Withdrawn</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = !searchTerm || 
      (enrollment.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       enrollment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load student roster. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Roster
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-student">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student to Cohort</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter student user ID"
                              data-testid="input-student-id"
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-student-status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={addStudentMutation.isPending}
                        data-testid="button-submit-add-student"
                      >
                        {addStudentMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                        Add Student
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddDialog(false)}
                        data-testid="button-cancel-add-student"
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-charcoal dark:text-white">{enrollments.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {enrollments.filter(e => e.status === "active").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {enrollments.filter(e => e.status === "completed").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {enrollments.filter(e => e.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-students"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-filter-status">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {enrollments.length === 0 ? "No students enrolled yet" : "No students match your search"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {enrollments.length === 0 
                  ? "Add students to start building your cohort."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment, index) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-bitcoin-orange text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {enrollment.user?.username.charAt(0).toUpperCase() || enrollment.userId.toString().charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-student-name-${index}`}>
                            {enrollment.user?.username || `User ${enrollment.userId}`}
                          </p>
                          {enrollment.user?.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {enrollment.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={enrollment.status}
                        onValueChange={(value) => handleStatusChange(enrollment.id, value)}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-student-status-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-bitcoin-orange h-2 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(enrollment.enrolledAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(enrollment.lastActiveAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveStudent(enrollment.id)}
                          data-testid={`button-remove-student-${index}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}