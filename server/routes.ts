import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { ethers } from "ethers";
import { storage } from "./storage";
import { insertCourseSchema, insertCourseCurriculumSchema, insertEnrollmentSchema, insertResearchDAOSchema, insertDAOProposalSchema, insertDAOMilestoneSchema, insertDAOPublicationSchema, insertDAOCourseSchema, insertInstructorProfileSchema, insertInstructorCourseSchema, insertCourseCohortSchema, insertInstructorProposalSchema, insertCredentialTemplateSchema, insertCohortEnrollmentSchema, insertAssignmentSchema, insertSubmissionSchema, insertAnnouncementSchema, insertCohortContentSchema, insertInvestorSchema, insertInvestorPreferencesSchema, insertInvestmentSchema, insertPregeneratedWalletSchema } from "@shared/schema";
import chatRouter from "./routes/chat";

// Extend Request interface to include verified wallet
declare module 'express-serve-static-core' {
  interface Request {
    verifiedWallet?: string;
  }
}

// Wallet signature verification middleware
const verifyWalletSignature = async (req: any, res: any, next: any) => {
  try {
    const { walletAddress, signature, message, timestamp } = req.body;
    
    if (!walletAddress || !signature || !message || !timestamp) {
      return res.status(401).json({ error: "Missing authentication parameters" });
    }
    
    // Check timestamp is recent (within 5 minutes)
    const now = Date.now();
    const messageTime = parseInt(timestamp);
    if (now - messageTime > 5 * 60 * 1000) {
      return res.status(401).json({ error: "Authentication message expired" });
    }
    
    // Verify the signature
    const expectedMessage = `Authenticate with Bitcoin University: ${timestamp}`;
    if (message !== expectedMessage) {
      return res.status(401).json({ error: "Invalid authentication message" });
    }
    
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    
    // Store verified wallet address for use in route handlers
    req.verifiedWallet = walletAddress.toLowerCase();
    next();
  } catch (error) {
    console.error("Signature verification error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Simple wallet ownership verification (for routes that just check wallet matches params)
const verifyWalletOwnership = async (req: any, res: any, next: any) => {
  try {
    const paramWallet = req.params.walletAddress || req.params.wallet;
    const { walletAddress } = req.body;
    
    if (!paramWallet) {
      return res.status(400).json({ error: "Wallet address required in URL" });
    }
    
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required in request body" });
    }
    
    if (paramWallet.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({ error: "Cannot access another wallet's resources" });
    }
    
    next();
  } catch (error) {
    console.error("Wallet ownership verification error:", error);
    return res.status(500).json({ error: "Authentication verification failed" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Use chat router
  app.use("/api", chatRouter);
  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ error: "Failed to create course" });
    }
  });

  // Course curriculum routes
  app.get("/api/courses/:id/curriculum", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const curriculum = await storage.getCourseCurriculum(courseId);
      res.json(curriculum);
    } catch (error) {
      console.error("Error fetching curriculum:", error);
      res.status(500).json({ error: "Failed to fetch curriculum" });
    }
  });

  app.post("/api/courses/:id/curriculum", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const curriculumData = insertCourseCurriculumSchema.parse({
        ...req.body,
        courseId
      });
      const curriculum = await storage.createCourseCurriculum(curriculumData);
      res.status(201).json(curriculum);
    } catch (error) {
      console.error("Error creating curriculum:", error);
      res.status(400).json({ error: "Failed to create curriculum" });
    }
  });

  // Enrollment routes
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const enrollments = await storage.getCourseEnrollments(courseId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching course enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(400).json({ error: "Failed to create enrollment" });
    }
  });

  // Research DAO routes
  app.get("/api/research-daos", async (req, res) => {
    try {
      const daos = await storage.getAllResearchDAOs();
      res.json(daos);
    } catch (error) {
      console.error("Error fetching research DAOs:", error);
      res.status(500).json({ error: "Failed to fetch research DAOs" });
    }
  });

  app.get("/api/research-daos/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const dao = await storage.getResearchDAO(id);
      if (!dao) {
        return res.status(404).json({ error: "Research DAO not found" });
      }
      res.json(dao);
    } catch (error) {
      console.error("Error fetching research DAO:", error);
      res.status(500).json({ error: "Failed to fetch research DAO" });
    }
  });

  // DAO Proposals endpoints
  app.get("/api/research-daos/:id/proposals", async (req, res) => {
    try {
      const daoId = req.params.id;
      const proposals = await storage.getDAOProposals(daoId);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching DAO proposals:", error);
      res.status(500).json({ error: "Failed to fetch DAO proposals" });
    }
  });

  // DAO Milestones endpoints
  app.get("/api/research-daos/:id/milestones", async (req, res) => {
    try {
      const daoId = req.params.id;
      const milestones = await storage.getDAOMilestones(daoId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching DAO milestones:", error);
      res.status(500).json({ error: "Failed to fetch DAO milestones" });
    }
  });

  // DAO Publications endpoints
  app.get("/api/research-daos/:id/publications", async (req, res) => {
    try {
      const daoId = req.params.id;
      const publications = await storage.getDAOPublications(daoId);
      res.json(publications);
    } catch (error) {
      console.error("Error fetching DAO publications:", error);
      res.status(500).json({ error: "Failed to fetch DAO publications" });
    }
  });

  app.post("/api/research-daos", async (req, res) => {
    try {
      const daoData = insertResearchDAOSchema.parse(req.body);
      const dao = await storage.createResearchDAO(daoData);
      res.status(201).json(dao);
    } catch (error) {
      console.error("Error creating research DAO:", error);
      res.status(400).json({ error: "Failed to create research DAO" });
    }
  });

  // DAO Proposals routes
  app.get("/api/research-daos/:id/proposals", async (req, res) => {
    try {
      const daoId = req.params.id;
      const proposals = await storage.getDAOProposals(daoId);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching DAO proposals:", error);
      res.status(500).json({ error: "Failed to fetch DAO proposals" });
    }
  });

  app.post("/api/research-daos/:id/proposals", async (req, res) => {
    try {
      const daoId = req.params.id;
      const proposalData = insertDAOProposalSchema.parse({
        ...req.body,
        daoId
      });
      const proposal = await storage.createDAOProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating DAO proposal:", error);
      res.status(400).json({ error: "Failed to create DAO proposal" });
    }
  });

  // DAO Milestones routes
  app.get("/api/research-daos/:id/milestones", async (req, res) => {
    try {
      const daoId = req.params.id;
      const milestones = await storage.getDAOMilestones(daoId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching DAO milestones:", error);
      res.status(500).json({ error: "Failed to fetch DAO milestones" });
    }
  });

  app.post("/api/research-daos/:id/milestones", async (req, res) => {
    try {
      const daoId = req.params.id;
      const milestoneData = insertDAOMilestoneSchema.parse({
        ...req.body,
        daoId
      });
      const milestone = await storage.createDAOMilestone(milestoneData);
      res.status(201).json(milestone);
    } catch (error) {
      console.error("Error creating DAO milestone:", error);
      res.status(400).json({ error: "Failed to create DAO milestone" });
    }
  });

  // DAO Publications routes
  app.get("/api/research-daos/:id/publications", async (req, res) => {
    try {
      const daoId = req.params.id;
      const publications = await storage.getDAOPublications(daoId);
      res.json(publications);
    } catch (error) {
      console.error("Error fetching DAO publications:", error);
      res.status(500).json({ error: "Failed to fetch DAO publications" });
    }
  });

  app.post("/api/research-daos/:id/publications", async (req, res) => {
    try {
      const daoId = req.params.id;
      const publicationData = insertDAOPublicationSchema.parse({
        ...req.body,
        daoId
      });
      const publication = await storage.createDAOPublication(publicationData);
      res.status(201).json(publication);
    } catch (error) {
      console.error("Error creating DAO publication:", error);
      res.status(400).json({ error: "Failed to create DAO publication" });
    }
  });

  // DAO Courses routes
  app.get("/api/research-daos/:id/courses", async (req, res) => {
    try {
      const daoId = req.params.id;
      const courses = await storage.getDAOCourses(daoId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching DAO courses:", error);
      res.status(500).json({ error: "Failed to fetch DAO courses" });
    }
  });

  app.post("/api/research-daos/:id/courses", async (req, res) => {
    try {
      const daoId = req.params.id;
      const courseData = insertDAOCourseSchema.parse({
        ...req.body,
        daoId
      });
      const course = await storage.createDAOCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating DAO course:", error);
      res.status(400).json({ error: "Failed to create DAO course" });
    }
  });

  // Instructor Profile routes
  app.get("/api/instructors/:wallet", async (req, res) => {
    try {
      const profile = await storage.getInstructorProfile(req.params.wallet);
      if (!profile) {
        return res.status(404).json({ error: "Instructor profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching instructor profile:", error);
      res.status(500).json({ error: "Failed to fetch instructor profile" });
    }
  });

  app.post("/api/instructors", async (req, res) => {
    try {
      const profileData = insertInstructorProfileSchema.parse(req.body);
      const profile = await storage.createInstructorProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating instructor profile:", error);
      res.status(400).json({ error: "Failed to create instructor profile" });
    }
  });

  app.patch("/api/instructors/:wallet", async (req, res) => {
    try {
      const walletAddress = req.params.wallet;
      const profileData = insertInstructorProfileSchema.partial().parse(req.body);
      const profile = await storage.updateInstructorProfile(walletAddress, profileData);
      if (!profile) {
        return res.status(404).json({ error: "Instructor profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error updating instructor profile:", error);
      res.status(400).json({ error: "Failed to update instructor profile" });
    }
  });

  // Instructor Courses routes
  app.get("/api/instructors/:wallet/courses", async (req, res) => {
    try {
      const courses = await storage.getInstructorCourses(req.params.wallet);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      res.status(500).json({ error: "Failed to fetch instructor courses" });
    }
  });

  app.post("/api/instructors/:wallet/courses", async (req, res) => {
    try {
      const courseData = insertInstructorCourseSchema.parse({
        ...req.body,
        instructorWallet: req.params.wallet
      });
      const course = await storage.createInstructorCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating instructor course:", error);
      res.status(400).json({ error: "Failed to create instructor course" });
    }
  });

  app.patch("/api/instructor-courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const courseData = insertInstructorCourseSchema.partial().parse(req.body);
      const course = await storage.updateInstructorCourse(id, courseData);
      if (!course) {
        return res.status(404).json({ error: "Instructor course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error updating instructor course:", error);
      res.status(400).json({ error: "Failed to update instructor course" });
    }
  });

  // Course Cohorts routes
  app.get("/api/instructor-courses/:id/cohorts", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const cohorts = await storage.getCourseCohorts(courseId);
      res.json(cohorts);
    } catch (error) {
      console.error("Error fetching course cohorts:", error);
      res.status(500).json({ error: "Failed to fetch course cohorts" });
    }
  });

  app.post("/api/instructor-courses/:id/cohorts", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const cohortData = insertCourseCohortSchema.parse({
        ...req.body,
        courseId
      });
      const cohort = await storage.createCourseCohort(cohortData);
      res.status(201).json(cohort);
    } catch (error) {
      console.error("Error creating course cohort:", error);
      res.status(400).json({ error: "Failed to create course cohort" });
    }
  });

  app.get("/api/course-cohorts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cohort = await storage.getCourseCohort(id);
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      console.error("Error fetching course cohort:", error);
      res.status(500).json({ error: "Failed to fetch course cohort" });
    }
  });

  app.patch("/api/course-cohorts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cohortData = insertCourseCohortSchema.partial().parse(req.body);
      const cohort = await storage.updateCourseCohort(id, cohortData);
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      console.error("Error updating course cohort:", error);
      res.status(400).json({ error: "Failed to update course cohort" });
    }
  });

  app.delete("/api/course-cohorts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cohort = await storage.deleteCourseCohort(id);
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      console.error("Error deleting course cohort:", error);
      res.status(400).json({ error: "Failed to delete course cohort" });
    }
  });

  // Instructor Proposals routes
  app.get("/api/instructors/:wallet/proposals", async (req, res) => {
    try {
      const proposals = await storage.getInstructorProposals(req.params.wallet);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching instructor proposals:", error);
      res.status(500).json({ error: "Failed to fetch instructor proposals" });
    }
  });

  app.post("/api/instructors/:wallet/proposals", async (req, res) => {
    try {
      const proposalData = insertInstructorProposalSchema.parse({
        ...req.body,
        instructorWallet: req.params.wallet
      });
      const proposal = await storage.createInstructorProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating instructor proposal:", error);
      res.status(400).json({ error: "Failed to create instructor proposal" });
    }
  });

  app.patch("/api/instructor-proposals/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, txHash } = req.body;
      const proposal = await storage.updateProposalStatus(id, status, txHash);
      if (!proposal) {
        return res.status(404).json({ error: "Instructor proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error updating proposal status:", error);
      res.status(400).json({ error: "Failed to update proposal status" });
    }
  });

  // Credential Templates routes
  app.get("/api/instructor-courses/:id/credentials", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const templates = await storage.getCourseCredentialTemplates(courseId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching credential templates:", error);
      res.status(500).json({ error: "Failed to fetch credential templates" });
    }
  });

  app.post("/api/instructor-courses/:id/credentials", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const templateData = insertCredentialTemplateSchema.parse({
        ...req.body,
        courseId
      });
      const template = await storage.createCredentialTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating credential template:", error);
      res.status(400).json({ error: "Failed to create credential template" });
    }
  });

  // ============== COHORT MANAGEMENT ROUTES ==============
  
  // Cohort Enrollments (Student Management)
  app.get("/api/cohorts/:cohortId/enrollments", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const enrollments = await storage.getCohortEnrollments(cohortId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching cohort enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/cohorts/:cohortId/enrollments", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const enrollmentData = insertCohortEnrollmentSchema.parse({
        ...req.body,
        cohortId
      });
      const enrollment = await storage.createCohortEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(400).json({ error: "Failed to create enrollment" });
    }
  });

  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const enrollmentData = insertCohortEnrollmentSchema.partial().parse(req.body);
      const enrollment = await storage.updateCohortEnrollment(id, enrollmentData);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating enrollment:", error);
      res.status(400).json({ error: "Failed to update enrollment" });
    }
  });

  app.delete("/api/enrollments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const enrollment = await storage.deleteCohortEnrollment(id);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      res.status(400).json({ error: "Failed to delete enrollment" });
    }
  });

  // Assignments
  app.get("/api/cohorts/:cohortId/assignments", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const assignments = await storage.getCohortAssignments(cohortId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getAssignment(id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ error: "Failed to fetch assignment" });
    }
  });

  app.post("/api/cohorts/:cohortId/assignments", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const assignmentData = insertAssignmentSchema.parse({
        ...req.body,
        cohortId
      });
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(400).json({ error: "Failed to create assignment" });
    }
  });

  app.patch("/api/assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignmentData = insertAssignmentSchema.partial().parse(req.body);
      const assignment = await storage.updateAssignment(id, assignmentData);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(400).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.deleteAssignment(id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(400).json({ error: "Failed to delete assignment" });
    }
  });

  // Submissions and Grading
  app.get("/api/assignments/:assignmentId/submissions", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const submissions = await storage.getAssignmentSubmissions(assignmentId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/assignments/:assignmentId/submissions/:userId", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const userId = parseInt(req.params.userId);
      const submission = await storage.getUserSubmission(assignmentId, userId);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/assignments/:assignmentId/submissions", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const submissionData = insertSubmissionSchema.parse({
        ...req.body,
        assignmentId
      });
      const submission = await storage.createSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(400).json({ error: "Failed to create submission" });
    }
  });

  app.patch("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submissionData = insertSubmissionSchema.partial().parse(req.body);
      const submission = await storage.updateSubmission(id, submissionData);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error updating submission:", error);
      res.status(400).json({ error: "Failed to update submission" });
    }
  });

  // Announcements
  app.get("/api/cohorts/:cohortId/announcements", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const announcements = await storage.getCohortAnnouncements(cohortId);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post("/api/cohorts/:cohortId/announcements", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        cohortId
      });
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(400).json({ error: "Failed to create announcement" });
    }
  });

  app.patch("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcementData = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, announcementData);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(400).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = await storage.deleteAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(400).json({ error: "Failed to delete announcement" });
    }
  });

  // Content Management
  app.get("/api/cohorts/:cohortId/content", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const content = await storage.getCohortContent(cohortId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/cohorts/:cohortId/content/week/:week", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const week = parseInt(req.params.week);
      const content = await storage.getCohortContentByWeek(cohortId, week);
      res.json(content);
    } catch (error) {
      console.error("Error fetching weekly content:", error);
      res.status(500).json({ error: "Failed to fetch weekly content" });
    }
  });

  app.post("/api/cohorts/:cohortId/content", async (req, res) => {
    try {
      const cohortId = parseInt(req.params.cohortId);
      const contentData = insertCohortContentSchema.parse({
        ...req.body,
        cohortId
      });
      const content = await storage.createCohortContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(400).json({ error: "Failed to create content" });
    }
  });

  app.patch("/api/cohort-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contentData = insertCohortContentSchema.partial().parse(req.body);
      const content = await storage.updateCohortContent(id, contentData);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(400).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/cohort-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.deleteCohortContent(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(400).json({ error: "Failed to delete content" });
    }
  });

  // Investor routes
  app.get("/api/investors/leaderboard", async (req, res) => {
    try {
      const sortBy = req.query.sortBy as 'amount' | 'count' || 'amount';
      const orderBy = sortBy === 'amount' ? 'totalInvested' : 'investmentCount';
      const limit = parseInt(req.query.limit as string) || 50;
      
      const leaderboard = await storage.getInvestorLeaderboard(orderBy, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching investor leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch investor leaderboard" });
    }
  });

  app.get("/api/investors/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const investor = await storage.getInvestor(walletAddress);
      if (!investor) {
        return res.status(404).json({ error: "Investor not found" });
      }
      res.json(investor);
    } catch (error) {
      console.error("Error fetching investor:", error);
      res.status(500).json({ error: "Failed to fetch investor" });
    }
  });

  app.post("/api/investors", verifyWalletSignature, async (req, res) => {
    try {
      console.log("Creating investor with data:", req.body);
      const investorData = insertInvestorSchema.parse({
        ...req.body,
        walletAddress: req.verifiedWallet // Use verified wallet address
      });
      console.log("Parsed investor data:", investorData);
      const investor = await storage.createInvestor(investorData);
      console.log("Created investor:", investor);
      return res.status(201).json(investor);
    } catch (error) {
      console.error("Error creating investor:", error);
      if (error instanceof Error) {
        return res.status(400).json({ error: "Failed to create investor", details: error.message });
      }
      return res.status(400).json({ error: "Failed to create investor" });
    }
  });

  app.patch("/api/investors/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const investorData = insertInvestorSchema.partial().parse(req.body);
      
      // Basic wallet ownership verification - ensure they can only update their own profile
      if (req.body.walletAddress && req.body.walletAddress !== walletAddress) {
        return res.status(403).json({ error: "Unauthorized: Cannot modify another user's profile" });
      }
      
      const investor = await storage.updateInvestor(walletAddress, investorData);
      if (!investor) {
        return res.status(404).json({ error: "Investor not found" });
      }
      res.json(investor);
    } catch (error) {
      console.error("Error updating investor:", error);
      res.status(400).json({ error: "Failed to update investor" });
    }
  });

  // Investor Preferences routes
  app.get("/api/investor-preferences/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const preferences = await storage.getInvestorPreferences(walletAddress);
      if (!preferences) {
        return res.status(404).json({ error: "Investor preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching investor preferences:", error);
      res.status(500).json({ error: "Failed to fetch investor preferences" });
    }
  });

  app.post("/api/investor-preferences", verifyWalletSignature, async (req, res) => {
    try {
      console.log("Creating investor preferences with data:", req.body);
      const walletAddress = req.verifiedWallet;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address not verified" });
      }
      
      // First, ensure investor record exists (using lowercase for consistency)
      console.log("About to search for investor with address:", walletAddress);
      let investor;
      try {
        investor = await storage.getInvestor(walletAddress);
        console.log("Search result - walletAddress (input):", walletAddress);
        console.log("Search result - investor found:", investor ? investor.walletAddress : "NOT FOUND");
      } catch (error) {
        console.error("Error during getInvestor call:", error);
        investor = null;
      }
      
      if (!investor) {
        console.log("Investor not found, creating new investor record");
        // Create basic investor record
        const newInvestorData = {
          walletAddress: walletAddress, // Already lowercase from middleware
          pseudonym: `Investor ${walletAddress.slice(0, 8)}`,
          profileCompleted: false,
          showOnLeaderboard: true,
          totalInvested: "0",
          investmentCount: 0
        };
        try {
          investor = await storage.createInvestor(newInvestorData);
          console.log("Created new investor:", investor);
        } catch (error) {
          console.error("Error creating new investor:", error);
          throw error;
        }
      }
      
      // Now create investor preferences
      // Parse body without walletAddress to prevent schema from forcing lowercase
      const bodyWithoutWallet = insertInvestorPreferencesSchema.omit({ walletAddress: true }).parse(req.body);
      const preferencesData = { 
        ...bodyWithoutWallet, 
        walletAddress: investor.walletAddress // Use exact address from investor record
      };
      console.log("Parsed preferences data:", preferencesData);
      const preferences = await storage.createInvestorPreferences(preferencesData);
      console.log("Created preferences:", preferences);
      return res.status(201).json(preferences);
    } catch (error) {
      console.error("Error creating investor preferences:", error);
      if (error instanceof Error) {
        return res.status(400).json({ error: "Failed to create investor preferences", details: error.message });
      }
      return res.status(400).json({ error: "Failed to create investor preferences" });
    }
  });

  app.patch("/api/investor-preferences/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const preferencesData = insertInvestorPreferencesSchema.partial().parse(req.body);
      
      // Basic wallet ownership verification
      if (preferencesData.walletAddress && preferencesData.walletAddress !== walletAddress) {
        return res.status(403).json({ error: "Unauthorized: Cannot modify another user's preferences" });
      }
      
      // Try to update first
      let preferences = await storage.updateInvestorPreferences(walletAddress, preferencesData);
      
      // If no preferences exist, create them (upsert behavior)
      if (!preferences) {
        // First, ensure investor record exists
        let investor = await storage.getInvestor(walletAddress);
        if (!investor) {
          console.log("Investor not found during PATCH, creating new investor record");
          // Create basic investor record
          const newInvestorData = {
            walletAddress,
            pseudonym: `Investor ${walletAddress.slice(0, 8)}`,
            profileCompleted: false,
            showOnLeaderboard: true,
            totalInvested: "0",
            investmentCount: 0
          };
          investor = await storage.createInvestor(newInvestorData);
          console.log("Created new investor during PATCH:", investor);
        }
        
        // Parse body without walletAddress to prevent schema from forcing lowercase
        const bodyWithoutWallet = insertInvestorPreferencesSchema.omit({ walletAddress: true }).parse(preferencesData);
        const fullPreferencesData = { 
          ...bodyWithoutWallet, 
          walletAddress: investor.walletAddress // Use exact address from investor record
        };
        preferences = await storage.createInvestorPreferences(fullPreferencesData);
        return res.status(201).json(preferences);
      }
      
      res.json(preferences);
    } catch (error) {
      console.error("Error updating investor preferences:", error);
      res.status(400).json({ error: "Failed to update investor preferences" });
    }
  });

  // Investment routes
  // Investment creation disabled - using blockchain-only architecture
  app.post("/api/investments", verifyWalletSignature, async (req, res) => {
    return res.status(410).json({ 
      error: "Investment creation via API disabled", 
      message: "Investments are now processed exclusively through blockchain transactions. Use the shopping cart's blockchain checkout." 
    });
  });

  app.get("/api/investments/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const investments = await storage.getInvestorInvestments(walletAddress);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investor investments:", error);
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  // Swipe opportunities endpoint - returns randomized mix of DAOs for now
  app.get("/api/swipe-opportunities", async (req, res) => {
    try {
      const daos = await storage.getAllResearchDAOs();
      
      // Transform DAOs to swipe opportunity format
      const opportunities = daos.map(dao => ({
        id: dao.id,
        type: "dao" as const,
        title: dao.name,
        description: dao.description,
        fundingGoal: dao.fundingGoal,
        fundingRaised: dao.fundingRaised,
        category: dao.category,
        urgency: dao.status === "Funding" ? "high" : "medium" as const,
        memberCount: dao.memberCount,
        impact: dao.objectives?.join(", ") || "Research impact",
        location: dao.location
      }));

      // Randomize the order
      const shuffled = opportunities.sort(() => Math.random() - 0.5);
      
      res.json(shuffled);
    } catch (error) {
      console.error("Error fetching swipe opportunities:", error);
      res.status(500).json({ error: "Failed to fetch swipe opportunities" });
    }
  });

  // Blockchain indexing status endpoint
  app.get('/api/blockchain-status', async (req, res) => {
    try {
      const { blockchainIndexer } = await import('./blockchain-indexer');
      const stats = await blockchainIndexer.getIndexingStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting blockchain status:', error);
      res.status(500).json({ error: 'Failed to get blockchain status' });
    }
  });

  // Pregenerated Wallet routes
  app.post("/api/wallets/generate", async (req, res) => {
    try {
      const walletData = insertPregeneratedWalletSchema.parse(req.body);
      const wallet = await storage.createPregeneratedWallet(walletData);
      res.status(201).json(wallet);
    } catch (error) {
      console.error("Error creating pregenerated wallet:", error);
      res.status(400).json({ error: "Failed to create pregenerated wallet" });
    }
  });

  app.post("/api/wallets/claim", async (req, res) => {
    try {
      const { email, walletAddress } = req.body;
      
      if (!email || !walletAddress) {
        return res.status(400).json({ error: "Email and wallet address are required" });
      }

      const wallet = await storage.claimWallet(email, walletAddress);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found or already claimed" });
      }
      
      res.json(wallet);
    } catch (error) {
      console.error("Error claiming wallet:", error);
      res.status(400).json({ error: "Failed to claim wallet" });
    }
  });

  app.get("/api/wallets/unclaimed", async (req, res) => {
    try {
      const wallet = await storage.getUnclaimedWallet();
      res.json(wallet);
    } catch (error) {
      console.error("Error fetching unclaimed wallet:", error);
      res.status(500).json({ error: "Failed to fetch unclaimed wallet" });
    }
  });

  app.get("/api/wallets/by-email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const wallet = await storage.getWalletByEmail(email);
      res.json(wallet);
    } catch (error) {
      console.error("Error fetching wallet by email:", error);
      res.status(500).json({ error: "Failed to fetch wallet" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
