import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCredentialTemplateSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInstructorCourses, useCredentialTemplates, useCreateCredentialTemplate } from "@/hooks/useInstructorData";
import { Plus, Award, FileCheck, Trophy, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CredentialManagementProps {
  walletAddress: string;
}

const credentialTypes = [
  { value: "certificate", label: "Certificate", icon: FileCheck },
  { value: "badge", label: "Badge", icon: Trophy },
  { value: "sbt", label: "Soul Bound Token", icon: Shield }
];

export default function CredentialManagement({ walletAddress }: CredentialManagementProps) {
  const { data: courses = [] } = useInstructorCourses(walletAddress);
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  
  // Use actual API calls instead of local state
  const { data: credentials = [], isLoading: credentialsLoading } = useCredentialTemplates(selectedCourse || 0);
  const createTemplate = useCreateCredentialTemplate(selectedCourse || 0);

  const form = useForm({
    resolver: zodResolver(insertCredentialTemplateSchema.omit({ 
      id: true, 
      courseId: true 
    })),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      requirements: [],
      contractAddress: "",
      templateHash: ""
    }
  });

  const onSubmit = async (data: any) => {
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTemplate.mutateAsync(data);
      
      toast({
        title: "Credential Template Created", 
        description: "Your credential template has been created successfully."
      });
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create credential template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    const credType = credentialTypes.find(t => t.value === type);
    if (!credType) return <Award className="w-4 h-4" />;
    const Icon = credType.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "certificate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "badge": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "sbt": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // credentials are already filtered by courseId from the API
  const courseCredentials = selectedCourse ? credentials : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Credential Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Course
              </label>
              <Select 
                onValueChange={(value) => setSelectedCourse(parseInt(value))}
                value={selectedCourse?.toString() || ""}
              >
                <SelectTrigger data-testid="select-credential-course">
                  <SelectValue placeholder="Choose a course to manage credentials" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCourse && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage credentials for:{" "}
                  <span className="font-medium">
                    {courses.find((c: any) => c.id === selectedCourse)?.title}
                  </span>
                </p>
                <Button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  data-testid="button-toggle-credential-form"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showCreateForm ? "Cancel" : "Create Template"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCreateForm && selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Create Credential Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credential Name</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-credential-name"
                            placeholder="Course Completion Certificate" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credential Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-credential-type">
                              <SelectValue placeholder="Select credential type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {credentialTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4" />
                                  {type.label}
                                </div>
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
                          data-testid="textarea-credential-description"
                          placeholder="Description of what this credential represents..." 
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
                    name="contractAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Address (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-contract-address"
                            placeholder="0x..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="templateHash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Hash (IPFS)</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-template-hash"
                            placeholder="Qm..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  data-testid="button-create-credential-template"
                  className="bg-bitcoin-orange hover:bg-orange-600"
                  disabled={createTemplate.isPending}
                >
                  {createTemplate.isPending ? "Creating..." : "Create Template"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Credential Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {credentialsLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : courseCredentials.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No credentials yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create credential templates to issue to students who complete your course.
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  data-testid="button-create-first-credential"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseCredentials.map((credential, index) => (
                  <Card key={credential.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2" data-testid={`text-credential-name-${index}`}>
                            {credential.name}
                          </h3>
                          <Badge 
                            className={`${getTypeColor(credential.type)} flex items-center gap-1 w-fit`}
                            data-testid={`badge-credential-type-${index}`}
                          >
                            {getTypeIcon(credential.type)}
                            {credentialTypes.find(t => t.value === credential.type)?.label || credential.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {credential.description}
                      </p>
                      
                      {credential.contractAddress && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          <span className="font-medium">Contract:</span> {credential.contractAddress.substring(0, 20)}...
                        </div>
                      )}
                      
                      {credential.templateHash && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                          <span className="font-medium">Template:</span> {credential.templateHash.substring(0, 20)}...
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          data-testid={`button-edit-credential-${index}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          data-testid={`button-issue-credential-${index}`}
                        >
                          Issue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedCourse && courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create a course first to manage credentials.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}