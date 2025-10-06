import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertAnnouncementSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Calendar, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";

interface AddAnnouncementModalProps {
  cohortId: number;
  trigger: React.ReactNode;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
  publishedAt: string;
  published: boolean;
}

export default function AddAnnouncementModal({ cohortId, trigger }: AddAnnouncementModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const announcementFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"), 
    priority: z.enum(["low", "normal", "high", "urgent"]),
    publishedAt: z.string().optional(),
    published: z.boolean()
  });

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "normal",
      publishedAt: new Date().toISOString().split('T')[0],
      published: false
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const announcementData = {
        ...data,
        cohortId,
        publishedAt: data.publishedAt ? new Date(data.publishedAt + 'T00:00:00.000Z') : undefined
      };
      
      const response = await apiRequest("POST", `/api/cohorts/${cohortId}/announcements`, announcementData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "announcements"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Announcement Posted",
        description: "The announcement has been successfully posted and is available to students."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post announcement. Please check your inputs and try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: AnnouncementFormData) => {
    createAnnouncementMutation.mutate(data);
  };

  const priorityLevels = [
    { value: "low", label: "Low Priority", icon: Info, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
    { value: "normal", label: "Normal Priority", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
    { value: "high", label: "High Priority", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" },
    { value: "urgent", label: "Urgent", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" }
  ];

  const getPriorityInfo = (priority: string) => {
    return priorityLevels.find(p => p.value === priority) || priorityLevels[1];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-bitcoin-orange" />
            Add Announcement
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Announcement Details</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Announcement Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter announcement title"
                        data-testid="input-announcement-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Keep it clear and concise - this will appear in the announcement list
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Announcement Content *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your announcement message..."
                        className="min-h-[120px]"
                        data-testid="textarea-announcement-content"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information that students need to know
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-announcement-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityLevels.map((priority) => {
                            const Icon = priority.icon;
                            return (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className={`w-4 h-4 ${priority.color}`} />
                                  {priority.label}
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
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="date" 
                            className="pl-10"
                            data-testid="input-publish-date"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        When this announcement should be visible to students
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Priority Preview */}
            {form.watch("priority") && (
              <div className={`p-4 rounded-lg border ${getPriorityInfo(form.watch("priority")).bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const priorityInfo = getPriorityInfo(form.watch("priority"));
                    const Icon = priorityInfo.icon;
                    return <Icon className={`w-4 h-4 ${priorityInfo.color}`} />;
                  })()}
                  <span className="font-medium">
                    {getPriorityInfo(form.watch("priority")).label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.watch("priority") === "low" && "Students will see this as a general information announcement"}
                  {form.watch("priority") === "normal" && "Students will see this as an important announcement"}
                  {form.watch("priority") === "high" && "Students will see this as a high-priority announcement with emphasis"}
                  {form.watch("priority") === "urgent" && "Students will see this as an urgent announcement that requires immediate attention"}
                </p>
              </div>
            )}

            {/* Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Publishing</h3>
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Announcement</FormLabel>
                      <FormDescription>
                        Make this announcement visible to students immediately
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-publish-announcement"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("published") && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityInfo(form.watch("priority")).bg} border-0 text-black dark:text-white`}>
                      {getPriorityInfo(form.watch("priority")).label}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Publishing {form.watch("publishedAt") || 'when date is set'}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Students will see this announcement in their dashboard and receive notifications.
                  </p>
                </div>
              )}
            </div>

            {/* Announcement Examples */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Announcement Tips</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Assignment Updates:</strong> "Assignment 2 deadline extended to Friday"</li>
                <li>• <strong>Class Changes:</strong> "Today's lecture moved to virtual format"</li>
                <li>• <strong>Resources:</strong> "New study materials available in Week 3"</li>
                <li>• <strong>Reminders:</strong> "Midterm exam next Tuesday - review sessions this week"</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                type="submit" 
                className="bg-bitcoin-orange hover:bg-orange-600"
                disabled={createAnnouncementMutation.isPending}
                data-testid="button-post-announcement"
              >
                {createAnnouncementMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Post Announcement
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                data-testid="button-cancel-announcement"
                disabled={createAnnouncementMutation.isPending}
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