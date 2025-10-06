import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  InstructorProfile, 
  InsertInstructorProfile, 
  InstructorCourse, 
  InsertInstructorCourse,
  InstructorProposal,
  InsertInstructorProposal,
  CourseCohort,
  InsertCourseCohort,
  CredentialTemplate,
  InsertCredentialTemplate
} from "@shared/schema";

// Instructor Profile hooks
export function useInstructorProfile(walletAddress: string) {
  return useQuery<InstructorProfile>({
    queryKey: ["/api/instructors", walletAddress],
    enabled: !!walletAddress
  });
}

export function useCreateInstructorProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: InsertInstructorProfile) => {
      const response = await apiRequest("POST", "/api/instructors", profileData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", data.walletAddress] });
    }
  });
}

export function useUpdateInstructorProfile(walletAddress: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: Partial<InsertInstructorProfile>) => {
      const response = await apiRequest("PATCH", `/api/instructors/${walletAddress}`, profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", walletAddress] });
    }
  });
}

// Instructor Courses hooks
export function useInstructorCourses(walletAddress: string) {
  return useQuery<InstructorCourse[]>({
    queryKey: ["/api/instructors", walletAddress, "courses"],
    enabled: !!walletAddress
  });
}

export function useCreateInstructorCourse(walletAddress: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseData: Omit<InsertInstructorCourse, 'instructorWallet'>) => {
      const response = await apiRequest("POST", `/api/instructors/${walletAddress}/courses`, courseData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", walletAddress, "courses"] });
    }
  });
}

export function useUpdateInstructorCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, courseData }: { id: number; courseData: Partial<InsertInstructorCourse> }) => {
      const response = await apiRequest("PATCH", `/api/instructor-courses/${id}`, courseData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", data.instructorWallet, "courses"] });
    }
  });
}

// Instructor Proposals hooks
export function useInstructorProposals(walletAddress: string) {
  return useQuery<InstructorProposal[]>({
    queryKey: ["/api/instructors", walletAddress, "proposals"],
    enabled: !!walletAddress
  });
}

export function useCreateInstructorProposal(walletAddress: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (proposalData: Omit<InsertInstructorProposal, 'instructorWallet'>) => {
      const response = await apiRequest("POST", `/api/instructors/${walletAddress}/proposals`, proposalData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", walletAddress, "proposals"] });
    }
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, txHash }: { id: number; status: string; txHash?: string }) => {
      const response = await apiRequest("PATCH", `/api/instructor-proposals/${id}/status`, { status, txHash });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructors", data.instructorWallet, "proposals"] });
    }
  });
}

// Course Cohorts hooks
export function useCourseCohorts(courseId: number) {
  return useQuery<CourseCohort[]>({
    queryKey: ["/api/instructor-courses", courseId, "cohorts"],
    enabled: !!courseId
  });
}

export function useCreateCourseCohort(courseId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cohortData: Omit<InsertCourseCohort, 'courseId'>) => {
      const response = await apiRequest("POST", `/api/instructor-courses/${courseId}/cohorts`, cohortData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor-courses", courseId, "cohorts"] });
    }
  });
}

export function useUpdateCourseCohort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, cohortData }: { id: number; cohortData: Partial<InsertCourseCohort> }) => {
      const response = await apiRequest("PATCH", `/api/course-cohorts/${id}`, cohortData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor-courses", data.courseId, "cohorts"] });
    }
  });
}

export function useDeleteCourseCohort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/course-cohorts/${id}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor-courses", data.courseId, "cohorts"] });
    }
  });
}

export function useToggleCohortEnrollment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, enrollmentOpen }: { id: number; enrollmentOpen: boolean }) => {
      const response = await apiRequest("PATCH", `/api/course-cohorts/${id}`, { enrollmentOpen });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor-courses", data.courseId, "cohorts"] });
    }
  });
}

// Credential Templates hooks
export function useCredentialTemplates(courseId: number) {
  return useQuery<CredentialTemplate[]>({
    queryKey: ["/api/instructor-courses", courseId, "credentials"],
    enabled: !!courseId
  });
}

export function useCreateCredentialTemplate(courseId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: Omit<InsertCredentialTemplate, 'courseId'>) => {
      const response = await apiRequest("POST", `/api/instructor-courses/${courseId}/credentials`, templateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor-courses", courseId, "credentials"] });
    }
  });
}