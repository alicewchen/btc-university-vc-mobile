import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInstructorProfileSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInstructorProfile, useCreateInstructorProfile, useUpdateInstructorProfile } from "@/hooks/useInstructorData";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface InstructorProfileProps {
  walletAddress: string;
}

export default function InstructorProfile({ walletAddress }: InstructorProfileProps) {
  const { data: profile, isLoading } = useInstructorProfile(walletAddress);
  const createProfile = useCreateInstructorProfile();
  const updateProfile = useUpdateInstructorProfile(walletAddress);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Update editing state when profile loads
  useEffect(() => {
    if (!isLoading && !profile) {
      setIsEditing(true);
    }
  }, [profile, isLoading]);
  const [newExpertise, setNewExpertise] = useState("");
  const [newLink, setNewLink] = useState("");

  const form = useForm({
    resolver: zodResolver(insertInstructorProfileSchema.omit({ id: true, createdAt: true })),
    defaultValues: {
      walletAddress,
      name: "",
      bio: "",
      title: "",
      institution: "",
      expertise: [],
      externalLinks: [],
      profileImageHash: "",
      verified: false
    }
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        walletAddress,
        name: profile.name || "",
        bio: profile.bio || "",
        title: profile.title || "",
        institution: profile.institution || "",
        expertise: profile.expertise || [],
        externalLinks: profile.externalLinks || [],
        profileImageHash: profile.profileImageHash || "",
        verified: profile.verified || false
      });
    }
  }, [profile, form, walletAddress]);

  const onSubmit = async (data: any) => {
    try {
      if (profile) {
        await updateProfile.mutateAsync(data);
        toast({
          title: "Profile Updated",
          description: "Your instructor profile has been updated successfully."
        });
      } else {
        await createProfile.mutateAsync(data);
        toast({
          title: "Profile Created",
          description: "Your instructor profile has been created successfully."
        });
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      const currentExpertise = form.getValues("expertise");
      form.setValue("expertise", [...currentExpertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    const currentExpertise = form.getValues("expertise");
    form.setValue("expertise", currentExpertise.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLink.trim()) {
      const currentLinks = form.getValues("externalLinks");
      form.setValue("externalLinks", [...currentLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = form.getValues("externalLinks");
    form.setValue("externalLinks", currentLinks.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isEditing && profile) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              {profile.title && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.title}</p>
              )}
              {profile.institution && (
                <p className="text-sm text-gray-500 dark:text-gray-500">{profile.institution}</p>
              )}
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-profile"
            >
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bio && (
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
            </div>
          )}
          
          {profile.expertise.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" data-testid={`badge-expertise-${index}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.externalLinks.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">External Links</h3>
              <div className="space-y-1">
                {profile.externalLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-bitcoin-orange hover:underline block"
                    data-testid={`link-external-${index}`}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? "Edit Profile" : "Create Instructor Profile"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      data-testid="input-instructor-name"
                      placeholder="Dr. Elena Volkov" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      data-testid="input-instructor-title"
                      placeholder="Professor of Sustainable Technology" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input 
                      data-testid="input-instructor-institution"
                      placeholder="Bitcoin University" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea 
                      data-testid="textarea-instructor-bio"
                      placeholder="Tell us about your background and expertise..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Expertise Areas</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("expertise").map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                    data-testid={`badge-expertise-edit-${index}`}
                  >
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeExpertise(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area"
                  data-testid="input-new-expertise"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                />
                <Button 
                  type="button" 
                  onClick={addExpertise}
                  data-testid="button-add-expertise"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>External Links</FormLabel>
              <div className="space-y-1 mb-2">
                {form.watch("externalLinks").map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    data-testid={`item-external-link-${index}`}
                  >
                    <span className="flex-1 text-sm">{link}</span>
                    <X 
                      className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500" 
                      onClick={() => removeLink(index)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://example.com"
                  data-testid="input-new-link"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                />
                <Button 
                  type="button" 
                  onClick={addLink}
                  data-testid="button-add-link"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                data-testid="button-save-profile"
                className="bg-bitcoin-orange hover:bg-orange-600"
                disabled={createProfile.isPending || updateProfile.isPending}
              >
                {createProfile.isPending || updateProfile.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {profile ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  profile ? "Update Profile" : "Create Profile"
                )}
              </Button>
              {profile && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}