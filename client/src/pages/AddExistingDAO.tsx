import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Database, 
  ChevronLeft, 
  Plus, 
  X, 
  Users, 
  Coins, 
  Globe, 
  MapPin,
  Target,
  CheckCircle,
  Loader2
} from "lucide-react";
import { z } from "zod";
import { insertResearchDAOSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Form schema for the frontend (with string inputs that will be transformed)
const addExistingDAOFormSchema = z.object({
  id: z.string().min(1, "DAO ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  location: z.string().optional(),
  website: z.string().optional(),
  leadResearcher: z.string().optional(),
  collaborators: z.string().optional(),
  governanceModel: z.string().min(1, "Governance model is required"),
  votingMechanism: z.string().min(1, "Voting mechanism is required"),
  tokenSymbol: z.string().optional(),
  memberCount: z.number().min(0),
  daoAddress: z.string().optional(),
  fundingRaised: z.number().min(0),
  fundingGoal: z.number().min(1),
  treasury: z.number().min(0),
  objectives: z.string().optional(),
  tags: z.string().optional(),
  completedMilestones: z.number().min(0),
  totalMilestones: z.number().min(1),
  image: z.string().optional(),
  lastActivity: z.string().optional(),
  proposalCount: z.number().optional(),
  activeProposals: z.number().optional()
});

type AddExistingDAOForm = z.infer<typeof addExistingDAOFormSchema>;

const categories = [
  "Conservation Technology", 
  "Quantum Computing", 
  "Climate Science", 
  "Indigenous Knowledge", 
  "Biotechnology", 
  "Renewable Energy", 
  "Space Technology", 
  "Neurotechnology", 
  "Materials Science", 
  "Educational Technology", 
  "Healthcare Technology"
];

const statuses = ["Active", "Funding", "Planning", "Completed"];
const governanceModels = ["Token-based", "Reputation-based", "Hybrid", "Multi-sig"];
const votingMechanisms = ["Quadratic Voting", "Simple Majority", "Conviction Voting", "Weighted Voting"];

export default function AddExistingDAO() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<AddExistingDAOForm>({
    resolver: zodResolver(addExistingDAOFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      category: "",
      status: "Active",
      location: "",
      website: "",
      leadResearcher: "",
      collaborators: "",
      governanceModel: "Token-based",
      votingMechanism: "Simple Majority",
      tokenSymbol: "",
      memberCount: 0,
      daoAddress: "",
      fundingRaised: 0,
      fundingGoal: 1000000,
      treasury: 0,
      objectives: "",
      tags: "",
      completedMilestones: 0,
      totalMilestones: 1,
      image: "",
      lastActivity: "",
      proposalCount: 0,
      activeProposals: 0
    }
  });

  const addDAOMutation = useMutation({
    mutationFn: async (data: AddExistingDAOForm) => {
      // Transform form data to match the database schema
      const transformedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        objectives: data.objectives ? data.objectives.split('\n').map(obj => obj.trim()).filter(Boolean) : [],
        collaborators: data.collaborators ? data.collaborators.split(',').map(collab => collab.trim()).filter(Boolean) : [],
        lastActivity: data.lastActivity || new Date().toISOString().split('T')[0],
        image: data.image || "/api/placeholder/400/300"
      };
      
      const response = await fetch("/api/research-daos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transformedData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to add DAO");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Research DAO has been added successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/research-daos"] });
      setLocation("/research-programs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add DAO. Please try again.",
        variant: "destructive"
      });
      console.error("Add DAO error:", error);
    }
  });

  const onSubmit = (data: AddExistingDAOForm) => {
    addDAOMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/research-programs")}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Research Programs
        </Button>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-bitcoin-orange/10 rounded-full">
              <Database className="w-8 h-8 text-bitcoin-orange" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Add an Existing Research DAO
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Register your existing research DAO with Bitcoin University to join our collaborative network and gain access to our platform features.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DAO ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="dao-your-org-name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for your DAO (e.g., dao-climate-research)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DAO Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Research Organization Name" {...field} />
                        </FormControl>
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your research DAO's mission, goals, and current projects..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Global, USA, Europe, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Contact & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourdao.org" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leadResearcher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Researcher</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="collaborators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Collaborators</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="University of Science, Research Institute, Tech Company (comma-separated)"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        List major institutional collaborators, separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Governance & Economics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Governance & Economics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="governanceModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Governance Model *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {governanceModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
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
                    name="votingMechanism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voting Mechanism *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {votingMechanisms.map((mechanism) => (
                              <SelectItem key={mechanism} value={mechanism}>
                                {mechanism}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="tokenSymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="RCH" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="memberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="150"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="daoAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DAO Contract Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Funding Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-600" />
                  Funding Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="fundingRaised"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Raised (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="500000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1000000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treasury"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treasury Balance (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="750000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Research Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Research Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Objectives</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter each objective on a new line..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        List your main research objectives, one per line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AI, Climate, Sustainability, Machine Learning (comma-separated)"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add relevant tags to help others discover your research, separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="completedMilestones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completed Milestones</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="3"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalMilestones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Milestones</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-bitcoin-orange hover:bg-bitcoin-orange/90 text-white px-12 py-3 text-lg font-semibold"
                disabled={addDAOMutation.isPending}
              >
                {addDAOMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding DAO...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Research DAO
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}