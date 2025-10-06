import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { insertAssignmentSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, Award, Clock } from "lucide-react";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";

interface CreateAssignmentModalProps {
  cohortId: number;
  trigger: React.ReactNode;
}

interface AssignmentFormData {
  title: string;
  description: string;
  type: string;
  maxPoints: number;
  dueDate: string;
  instructions?: string;
  resources: string;
  published: boolean;
}

export default function CreateAssignmentModal({ cohortId, trigger }: CreateAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(insertAssignmentSchema.omit({ 
      id: true, 
      cohortId: true, 
      createdAt: true,
      resources: true 
    }).extend({
      resources: insertAssignmentSchema.shape.resources.optional().default([])
        .transform(val => Array.isArray(val) ? val.join('\n') : ''),
      dueDate: insertAssignmentSchema.shape.dueDate.transform(date => 
        date instanceof Date ? date.toISOString().split('T')[0] : ''
      )
    })),
    defaultValues: {
      title: "",
      description: "",
      type: "assignment",
      maxPoints: 100,
      dueDate: "",
      instructions: "",
      resources: "",
      published: false
    }
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: AssignmentFormData) => {
      const assignmentData = {
        ...data,
        cohortId,
        resources: data.resources.split('\n').filter(r => r.trim() !== ''),
        dueDate: new Date(data.dueDate + 'T23:59:59.999Z')
      };
      
      const response = await apiRequest("POST", `/api/cohorts/${cohortId}/assignments`, assignmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "assignments"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Assignment Created",
        description: "The assignment has been successfully created and is available to students."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please check your inputs and try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: AssignmentFormData) => {
    createAssignmentMutation.mutate(data);
  };

  const assignmentTypes = [
    { value: "assignment", label: "Assignment", icon: FileText },
    { value: "quiz", label: "Quiz", icon: Clock },
    { value: "project", label: "Project", icon: Award },
    { value: "discussion", label: "Discussion", icon: FileText }
  ];

  const getTypeIcon = (type: string) => {
    const typeObj = assignmentTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : FileText;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-bitcoin-orange" />
            Create New Assignment
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter assignment title"
                        data-testid="input-assignment-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a brief description of the assignment"
                        className="min-h-[80px]"
                        data-testid="textarea-assignment-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-assignment-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assignmentTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Points</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          max="1000"
                          placeholder="100"
                          data-testid="input-max-points"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="date" 
                          className="pl-10"
                          data-testid="input-due-date"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Students will be able to submit until 11:59 PM on this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Instructions and Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Instructions & Resources</h3>
              
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed instructions for students..."
                        className="min-h-[120px]"
                        data-testid="textarea-instructions"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include specific requirements, formatting guidelines, and submission details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resources & Materials</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resource links, readings, or materials (one per line)..."
                        className="min-h-[80px]"
                        data-testid="textarea-resources"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add links to readings, videos, or other materials. Put each resource on a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Publishing</h3>
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Assignment</FormLabel>
                      <FormDescription>
                        Make this assignment visible to students immediately
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-publish-assignment"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("published") && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Will be published
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Students will be able to see and submit to this assignment immediately after creation.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                type="submit" 
                className="bg-bitcoin-orange hover:bg-orange-600"
                disabled={createAssignmentMutation.isPending}
                data-testid="button-create-assignment"
              >
                {createAssignmentMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Create Assignment
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                data-testid="button-cancel-assignment"
                disabled={createAssignmentMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}