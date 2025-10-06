import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { insertCohortContentSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Calendar, Video, FileText, Link, Download } from "lucide-react";
import LoadingSpinner from "@/components/instructor/LoadingSpinner";

interface AddContentModalProps {
  cohortId: number;
  trigger: React.ReactNode;
}

interface ContentFormData {
  title: string;
  description: string;
  contentType: string;
  week: number;
  availableFrom: string;
  content: string;
  materials: string;
  published: boolean;
}

export default function AddContentModal({ cohortId, trigger }: AddContentModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertCohortContentSchema.omit({ 
      id: true, 
      cohortId: true, 
      createdAt: true,
      materials: true,
      availableFrom: true,
      dueDate: true 
    }).extend({
      materials: insertCohortContentSchema.shape.materials.optional().default([])
        .transform((val: any) => Array.isArray(val) ? val.join('\n') : ''),
      availableFrom: insertCohortContentSchema.shape.availableFrom.optional()
        .transform((date: any) => date instanceof Date ? date.toISOString().split('T')[0] : '')
    })),
    defaultValues: {
      title: "",
      description: "",
      contentType: "lesson",
      week: 1,
      availableFrom: "",
      content: "",
      materials: "",
      published: false
    }
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const contentData = {
        ...data,
        cohortId,
        materials: data.materials.split('\n').filter(r => r.trim() !== ''),
        availableFrom: new Date(data.availableFrom + 'T00:00:00.000Z')
      };
      
      const response = await apiRequest("POST", `/api/cohorts/${cohortId}/content`, contentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts", cohortId, "content"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Content Added",
        description: "The course content has been successfully added and is available to students."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add content. Please check your inputs and try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContentFormData) => {
    createContentMutation.mutate(data);
  };

  const contentTypes = [
    { value: "lesson", label: "Lesson", icon: BookOpen },
    { value: "video", label: "Video", icon: Video },
    { value: "reading", label: "Reading", icon: FileText },
    { value: "resource", label: "Resource", icon: Download },
    { value: "assignment", label: "Assignment", icon: FileText }
  ];

  const getTypeIcon = (contentType: string) => {
    const typeObj = contentTypes.find(t => t.value === contentType);
    return typeObj ? typeObj.icon : BookOpen;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-bitcoin-orange" />
            Add Course Content
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
                    <FormLabel>Content Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter content title"
                        data-testid="input-content-title"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a brief description of the content"
                        className="min-h-[80px]"
                        data-testid="textarea-content-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-content-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map((type) => {
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
                  name="week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Week Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          max="52"
                          placeholder="1"
                          data-testid="input-week-number"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Date *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="date" 
                            className="pl-10"
                            data-testid="input-available-date"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Content Details</h3>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Body</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the main content, lessons, instructions, or embed codes..."
                        className="min-h-[150px]"
                        data-testid="textarea-content-body"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add the main content, lesson text, video embeds, or detailed instructions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Materials</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter links to additional materials, readings, or resources (one per line)..."
                        className="min-h-[80px]"
                        data-testid="textarea-content-materials"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add supplementary materials, links, or readings. Put each resource on a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Type Preview */}
            {form.watch("contentType") && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = getTypeIcon(form.watch("contentType"));
                    return <Icon className="w-4 h-4 text-bitcoin-orange" />;
                  })()}
                  <span className="font-medium">
                    {contentTypes.find(t => t.value === form.watch("contentType"))?.label} Content
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.watch("contentType") === "lesson" && "Interactive lesson content with text, images, and activities"}
                  {form.watch("contentType") === "video" && "Video content with embedded players or links"}
                  {form.watch("contentType") === "reading" && "Text-based reading materials and documents"}
                  {form.watch("contentType") === "resource" && "Downloadable files, tools, or materials"}
                  {form.watch("contentType") === "assignment" && "Assignment content with instructions and requirements"}
                </p>
              </div>
            )}

            {/* Availability & Publishing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Availability</h3>
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Content</FormLabel>
                      <FormDescription>
                        Make this content visible to students immediately
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-publish-content"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("published") && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Week {form.watch("week")} Content
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Available {form.watch("availableFrom") || 'when date is set'}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Students will be able to access this content starting on the available date.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                type="submit" 
                className="bg-bitcoin-orange hover:bg-orange-600"
                disabled={createContentMutation.isPending}
                data-testid="button-add-content"
              >
                {createContentMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Add Content
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                data-testid="button-cancel-content"
                disabled={createContentMutation.isPending}
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