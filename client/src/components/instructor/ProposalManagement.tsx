import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInstructorProposalSchema, ResearchDAO } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInstructorProposals, useCreateInstructorProposal, useInstructorCourses } from "@/hooks/useInstructorData";
import { Plus, FileText, DollarSign, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ProposalManagementProps {
  walletAddress: string;
}

const proposalTypes = [
  { value: "funding", label: "Funding Request" },
  { value: "revenue_split", label: "Revenue Sharing" },
  { value: "course_listing", label: "Course Listing" }
];

export default function ProposalManagement({ walletAddress }: ProposalManagementProps) {
  const { data: proposals = [], isLoading } = useInstructorProposals(walletAddress);
  const { data: instructorCourses = [] } = useInstructorCourses(walletAddress);
  const createProposal = useCreateInstructorProposal(walletAddress);
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch available DAOs
  const { data: daos = [] } = useQuery<ResearchDAO[]>({
    queryKey: ["/api/research-daos"]
  });

  const form = useForm({
    resolver: zodResolver(insertInstructorProposalSchema.omit({ 
      id: true, 
      instructorWallet: true, 
      createdAt: true 
    })),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      daoId: "",
      courseId: null,
      requestedAmount: "",
      revenueSharePercentage: "",
      status: "draft"
    }
  });

  const selectedType = form.watch("type");

  const onSubmit = async (data: any) => {
    try {
      // Convert courseId to number if provided
      const submitData = {
        ...data,
        courseId: data.courseId ? parseInt(data.courseId) : null
      };
      
      await createProposal.mutateAsync(submitData);
      toast({
        title: "Proposal Created",
        description: "Your proposal has been created successfully."
      });
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "submitted": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "funding": return <DollarSign className="w-4 h-4" />;
      case "revenue_split": return <Percent className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
              <FileText className="w-5 h-5" />
              DAO Proposals
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              data-testid="button-toggle-proposal-form"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCreateForm ? "Cancel" : "Create Proposal"}
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
                        <FormLabel>Proposal Title</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-proposal-title"
                            placeholder="Funding for Advanced Blockchain Course" 
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
                        <FormLabel>Proposal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-proposal-type">
                              <SelectValue placeholder="Select proposal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {proposalTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    name="daoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target DAO</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-target-dao">
                              <SelectValue placeholder="Select a DAO" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daos.map((dao: any) => (
                              <SelectItem key={dao.id} value={dao.id}>
                                {dao.name}
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
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Course (optional)</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))} 
                          defaultValue={field.value ? field.value.toString() : "none"}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-related-course">
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No related course</SelectItem>
                            {instructorCourses.map((course: any) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedType === "funding" && (
                    <FormField
                      control={form.control}
                      name="requestedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requested Amount</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-requested-amount"
                              placeholder="5000.00" 
                              type="number"
                              step="0.01"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedType === "revenue_split" && (
                    <FormField
                      control={form.control}
                      name="revenueSharePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue Share (%)</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-revenue-share"
                              placeholder="20.00" 
                              type="number"
                              step="0.01"
                              max="100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          data-testid="textarea-proposal-description"
                          placeholder="Detailed description of your proposal..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  data-testid="button-create-proposal"
                  className="bg-bitcoin-orange hover:bg-orange-600"
                  disabled={createProposal.isPending}
                >
                  {createProposal.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Proposal"
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
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading proposals...</span>
            </div>
          </CardContent>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No proposals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create proposals to request funding or partnerships with DAOs.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              data-testid="button-create-first-proposal"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Proposal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal: any, index: number) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-proposal-title-${index}`}>
                      {proposal.title}
                    </h3>
                    <div className="flex gap-2 mb-2">
                      <Badge 
                        className={`${getStatusColor(proposal.status)} flex items-center gap-1`}
                        data-testid={`badge-proposal-status-${index}`}
                      >
                        {getTypeIcon(proposal.type)}
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline">
                        {proposalTypes.find(t => t.value === proposal.type)?.label || proposal.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {proposal.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {proposal.requestedAmount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>Requested: ${proposal.requestedAmount}</span>
                    </div>
                  )}
                  {proposal.revenueSharePercentage && (
                    <div className="flex items-center gap-2 text-sm">
                      <Percent className="w-4 h-4" />
                      <span>Revenue Share: {proposal.revenueSharePercentage}%</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    DAO: {proposal.daoId}
                  </div>
                  {proposal.onChainTxHash && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                      Tx: {proposal.onChainTxHash.substring(0, 20)}...
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    data-testid={`button-view-proposal-${index}`}
                  >
                    View Details
                  </Button>
                  {proposal.status === "draft" && (
                    <Button 
                      size="sm"
                      data-testid={`button-submit-proposal-${index}`}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}