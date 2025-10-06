import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInstructorCourseSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInstructorCourses, useCreateInstructorCourse, useUpdateInstructorCourse } from "@/hooks/useInstructorData";
import { Plus, BookOpen, Users, Clock, DollarSign, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CourseManagementProps {
  walletAddress: string;
}

const courseCategories = [
  { value: "blockchain", label: "Blockchain & Web3" },
  { value: "conservation", label: "Conservation Technology" },
  { value: "indigenous", label: "Indigenous Knowledge Systems" },
  { value: "computing", label: "High-Performance Computing" }
];

const courseLevels = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" }
];

const deliveryMethods = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" }
];

export default function CourseManagement({ walletAddress }: CourseManagementProps) {
  const { data: courses = [], isLoading } = useInstructorCourses(walletAddress);
  const createCourse = useCreateInstructorCourse(walletAddress);
  const updateCourse = useUpdateInstructorCourse();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertInstructorCourseSchema.omit({ 
      id: true, 
      instructorWallet: true, 
      createdAt: true 
    })),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      level: "",
      duration: "",
      price: "",
      deliveryMethod: "",
      daoId: "",
      status: "draft"
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode && editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse.id, courseData: data });
        toast({
          title: "Course Updated",
          description: "Your course has been updated successfully."
        });
        setIsEditMode(false);
        setEditingCourse(null);
      } else {
        await createCourse.mutateAsync(data);
        toast({
          title: "Course Created",
          description: "Your course has been created successfully."
        });
      }
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} course. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setShowCreateForm(true);
    
    // Populate form with existing course data
    form.reset({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "",
      duration: course.duration || "",
      price: course.price || "",
      deliveryMethod: course.deliveryMethod || "",
      daoId: course.daoId || "",
      status: course.status || "draft"
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingCourse(null);
    setShowCreateForm(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {isEditMode ? `Edit Course: ${editingCourse?.title}` : "Course Management"}
            </CardTitle>
            <Button 
              onClick={() => {
                if (showCreateForm) {
                  handleCancelEdit();
                } else {
                  setShowCreateForm(true);
                  setIsEditMode(false);
                  setEditingCourse(null);
                }
              }}
              data-testid="button-toggle-course-form"
            >
              {showCreateForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-course-title"
                            placeholder="Advanced Smart Contract Development" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-course-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-course-level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-course-duration"
                            placeholder="8 weeks" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-course-price"
                            placeholder="299.99" 
                            type="number"
                            step="0.01"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-delivery-method">
                              <SelectValue placeholder="Select delivery method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deliveryMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          data-testid="textarea-course-description"
                          placeholder="Comprehensive course description..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  data-testid={isEditMode ? "button-update-course" : "button-create-course"}
                  className="bg-bitcoin-orange hover:bg-orange-600"
                  disabled={createCourse.isPending || updateCourse.isPending}
                >
                  {createCourse.isPending || updateCourse.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {isEditMode ? "Update Course" : "Create Course"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bitcoin-orange"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading courses...</span>
            </div>
          </CardContent>
        </Card>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first course to start teaching on Bitcoin University.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              data-testid="button-create-first-course"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any, index: number) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-course-title-${index}`}>
                      {course.title}
                    </h3>
                    <Badge 
                      className={`${getStatusColor(course.status)} mb-2`}
                      data-testid={`badge-course-status-${index}`}
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    {course.price && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${course.price}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Delivery: {course.deliveryMethod}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditCourse(course)}
                    data-testid={`button-edit-course-${index}`}
                    disabled={showCreateForm && editingCourse?.id !== course.id}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation(`/teach/course/${course.id}/cohorts`)}
                    data-testid={`button-manage-cohorts-${index}`}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Cohorts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}