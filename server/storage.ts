import { 
  users, 
  courses,
  courseCurriculum,
  enrollments,
  researchDAOs,
  daoProposals,
  daoMilestones,
  daoPublications,
  daoCourses,
  instructorProfiles,
  instructorCourses,
  courseCohorts,
  instructorProposals,
  credentialTemplates,
  cohortEnrollments,
  assignments,
  submissions,
  announcements,
  cohortContent,
  investors,
  investorPreferences,
  investments,
  scholarships,
  grantProposals,
  pregeneratedWallets,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type CourseCurriculum,
  type InsertCourseCurriculum,
  type Enrollment,
  type InsertEnrollment,
  type ResearchDAO,
  type InsertResearchDAO,
  type DAOProposal,
  type InsertDAOProposal,
  type DAOMilestone,
  type InsertDAOMilestone,
  type DAOPublication,
  type InsertDAOPublication,
  type DAOCourse,
  type InsertDAOCourse,
  type InstructorProfile,
  type InsertInstructorProfile,
  type InstructorCourse,
  type InsertInstructorCourse,
  type CourseCohort,
  type InsertCourseCohort,
  type InstructorProposal,
  type InsertInstructorProposal,
  type CredentialTemplate,
  type InsertCredentialTemplate,
  type CohortEnrollment,
  type InsertCohortEnrollment,
  type Assignment,
  type InsertAssignment,
  type Submission,
  type InsertSubmission,
  type Announcement,
  type InsertAnnouncement,
  type CohortContent,
  type InsertCohortContent,
  type Investor,
  type InsertInvestor,
  type InvestorPreferences,
  type InsertInvestorPreferences,
  type Investment,
  type InsertInvestment,
  type Scholarship,
  type InsertScholarship,
  type GrantProposal,
  type InsertGrantProposal,
  type PregeneratedWallet,
  type InsertPregeneratedWallet
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Course curriculum methods
  getCourseCurriculum(courseId: number): Promise<CourseCurriculum[]>;
  createCourseCurriculum(curriculum: InsertCourseCurriculum): Promise<CourseCurriculum>;
  
  // Enrollment methods
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Research DAO methods
  getAllResearchDAOs(): Promise<ResearchDAO[]>;
  getResearchDAO(id: string): Promise<ResearchDAO | undefined>;
  createResearchDAO(dao: InsertResearchDAO): Promise<ResearchDAO>;
  
  // DAO Proposals methods
  getDAOProposals(daoId: string): Promise<DAOProposal[]>;
  createDAOProposal(proposal: InsertDAOProposal): Promise<DAOProposal>;
  
  // DAO Milestones methods
  getDAOMilestones(daoId: string): Promise<DAOMilestone[]>;
  createDAOMilestone(milestone: InsertDAOMilestone): Promise<DAOMilestone>;
  
  // DAO Publications methods
  getDAOPublications(daoId: string): Promise<DAOPublication[]>;
  createDAOPublication(publication: InsertDAOPublication): Promise<DAOPublication>;
  
  // DAO Courses methods
  getDAOCourses(daoId: string): Promise<DAOCourse[]>;
  createDAOCourse(course: InsertDAOCourse): Promise<DAOCourse>;
  
  // Instructor Profile methods
  getInstructorProfile(walletAddress: string): Promise<InstructorProfile | undefined>;
  createInstructorProfile(profile: InsertInstructorProfile): Promise<InstructorProfile>;
  updateInstructorProfile(walletAddress: string, profile: Partial<InsertInstructorProfile>): Promise<InstructorProfile | undefined>;
  
  // Instructor Courses methods
  getInstructorCourses(instructorWallet: string): Promise<InstructorCourse[]>;
  createInstructorCourse(course: InsertInstructorCourse): Promise<InstructorCourse>;
  updateInstructorCourse(id: number, course: Partial<InsertInstructorCourse>): Promise<InstructorCourse | undefined>;
  
  // Course Cohorts methods
  getCourseCohorts(courseId: number): Promise<CourseCohort[]>;
  getCourseCohort(id: number): Promise<CourseCohort | undefined>;
  createCourseCohort(cohort: InsertCourseCohort): Promise<CourseCohort>;
  updateCourseCohort(id: number, cohort: Partial<InsertCourseCohort>): Promise<CourseCohort | undefined>;
  deleteCourseCohort(id: number): Promise<CourseCohort | undefined>;
  
  // Instructor Proposals methods
  getInstructorProposals(instructorWallet: string): Promise<InstructorProposal[]>;
  createInstructorProposal(proposal: InsertInstructorProposal): Promise<InstructorProposal>;
  updateProposalStatus(id: number, status: string, txHash?: string): Promise<InstructorProposal | undefined>;
  
  // Credential Templates methods
  getCourseCredentialTemplates(courseId: number): Promise<CredentialTemplate[]>;
  createCredentialTemplate(template: InsertCredentialTemplate): Promise<CredentialTemplate>;

  // Cohort Management methods
  // Cohort Enrollments
  getCohortEnrollments(cohortId: number): Promise<CohortEnrollment[]>;
  createCohortEnrollment(enrollment: InsertCohortEnrollment): Promise<CohortEnrollment>;
  updateCohortEnrollment(id: number, enrollment: Partial<InsertCohortEnrollment>): Promise<CohortEnrollment | undefined>;
  deleteCohortEnrollment(id: number): Promise<CohortEnrollment | undefined>;

  // Assignments
  getCohortAssignments(cohortId: number): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<Assignment | undefined>;

  // Submissions
  getAssignmentSubmissions(assignmentId: number): Promise<Submission[]>;
  getUserSubmission(assignmentId: number, userId: number): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: number, submission: Partial<InsertSubmission>): Promise<Submission | undefined>;
  gradeSubmission(id: number, grade: number, feedback: string, gradedBy: string): Promise<Submission | undefined>;

  // Announcements
  getCohortAnnouncements(cohortId: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<Announcement | undefined>;

  // Cohort Content
  getCohortContent(cohortId: number): Promise<CohortContent[]>;
  getCohortContentByWeek(cohortId: number, week: number): Promise<CohortContent[]>;
  createCohortContent(content: InsertCohortContent): Promise<CohortContent>;
  updateCohortContent(id: number, content: Partial<InsertCohortContent>): Promise<CohortContent | undefined>;
  deleteCohortContent(id: number): Promise<CohortContent | undefined>;

  // Investor methods
  getInvestorLeaderboard(sortBy: 'totalInvested' | 'investmentCount', limit: number): Promise<Investor[]>;
  getInvestor(walletAddress: string): Promise<Investor | undefined>;
  createInvestor(investor: InsertInvestor): Promise<Investor>;
  updateInvestor(walletAddress: string, investor: Partial<InsertInvestor>): Promise<Investor | undefined>;

  // Investor Preferences methods
  getInvestorPreferences(walletAddress: string): Promise<InvestorPreferences | undefined>;
  createInvestorPreferences(preferences: InsertInvestorPreferences): Promise<InvestorPreferences>;
  updateInvestorPreferences(walletAddress: string, preferences: Partial<InsertInvestorPreferences>): Promise<InvestorPreferences | undefined>;

  // Investment methods
  getInvestorInvestments(walletAddress: string): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getTargetInvestments(targetType: string, targetId: string): Promise<Investment[]>;

  // Pregenerated Wallet methods
  createPregeneratedWallet(wallet: InsertPregeneratedWallet): Promise<PregeneratedWallet>;
  claimWallet(email: string, walletAddress: string): Promise<PregeneratedWallet | undefined>;
  getUnclaimedWallet(): Promise<PregeneratedWallet | undefined>;
  getWalletByEmail(email: string): Promise<PregeneratedWallet | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  // Course curriculum methods
  async getCourseCurriculum(courseId: number): Promise<CourseCurriculum[]> {
    return await db.select().from(courseCurriculum).where(eq(courseCurriculum.courseId, courseId));
  }

  async createCourseCurriculum(curriculum: InsertCourseCurriculum): Promise<CourseCurriculum> {
    const [newCurriculum] = await db
      .insert(courseCurriculum)
      .values(curriculum)
      .returning();
    return newCurriculum;
  }

  // Enrollment methods
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  // Research DAO methods
  async getAllResearchDAOs(): Promise<ResearchDAO[]> {
    return await db.select().from(researchDAOs);
  }

  async getResearchDAO(id: string): Promise<ResearchDAO | undefined> {
    const [dao] = await db.select().from(researchDAOs).where(eq(researchDAOs.id, id));
    return dao || undefined;
  }

  async createResearchDAO(dao: InsertResearchDAO): Promise<ResearchDAO> {
    const [newDAO] = await db
      .insert(researchDAOs)
      .values(dao)
      .returning();
    return newDAO;
  }

  // DAO Proposals methods
  async getDAOProposals(daoId: string): Promise<DAOProposal[]> {
    return await db.select().from(daoProposals).where(eq(daoProposals.daoId, daoId));
  }

  async createDAOProposal(proposal: InsertDAOProposal): Promise<DAOProposal> {
    const [newProposal] = await db
      .insert(daoProposals)
      .values(proposal)
      .returning();
    return newProposal;
  }

  // DAO Milestones methods
  async getDAOMilestones(daoId: string): Promise<DAOMilestone[]> {
    return await db.select().from(daoMilestones).where(eq(daoMilestones.daoId, daoId));
  }

  async createDAOMilestone(milestone: InsertDAOMilestone): Promise<DAOMilestone> {
    const [newMilestone] = await db
      .insert(daoMilestones)
      .values(milestone)
      .returning();
    return newMilestone;
  }

  // DAO Publications methods
  async getDAOPublications(daoId: string): Promise<DAOPublication[]> {
    return await db.select().from(daoPublications).where(eq(daoPublications.daoId, daoId));
  }

  async createDAOPublication(publication: InsertDAOPublication): Promise<DAOPublication> {
    const [newPublication] = await db
      .insert(daoPublications)
      .values(publication)
      .returning();
    return newPublication;
  }

  // DAO Courses methods
  async getDAOCourses(daoId: string): Promise<DAOCourse[]> {
    return await db.select().from(daoCourses).where(eq(daoCourses.daoId, daoId));
  }

  async createDAOCourse(course: InsertDAOCourse): Promise<DAOCourse> {
    const [newCourse] = await db
      .insert(daoCourses)
      .values(course)
      .returning();
    return newCourse;
  }

  // Instructor Profile methods
  async getInstructorProfile(walletAddress: string): Promise<InstructorProfile | undefined> {
    const [profile] = await db.select().from(instructorProfiles).where(eq(instructorProfiles.walletAddress, walletAddress));
    return profile || undefined;
  }

  async createInstructorProfile(profile: InsertInstructorProfile): Promise<InstructorProfile> {
    const [newProfile] = await db
      .insert(instructorProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateInstructorProfile(walletAddress: string, profile: Partial<InsertInstructorProfile>): Promise<InstructorProfile | undefined> {
    const [updatedProfile] = await db
      .update(instructorProfiles)
      .set(profile)
      .where(eq(instructorProfiles.walletAddress, walletAddress))
      .returning();
    return updatedProfile || undefined;
  }

  // Instructor Courses methods
  async getInstructorCourses(instructorWallet: string): Promise<InstructorCourse[]> {
    return await db.select().from(instructorCourses).where(eq(instructorCourses.instructorWallet, instructorWallet));
  }

  async createInstructorCourse(course: InsertInstructorCourse): Promise<InstructorCourse> {
    const [newCourse] = await db
      .insert(instructorCourses)
      .values(course)
      .returning();
    return newCourse;
  }

  async updateInstructorCourse(id: number, course: Partial<InsertInstructorCourse>): Promise<InstructorCourse | undefined> {
    const [updatedCourse] = await db
      .update(instructorCourses)
      .set(course)
      .where(eq(instructorCourses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  // Course Cohorts methods
  async getCourseCohorts(courseId: number): Promise<CourseCohort[]> {
    return await db.select().from(courseCohorts).where(eq(courseCohorts.courseId, courseId));
  }

  async getCourseCohort(id: number): Promise<CourseCohort | undefined> {
    const [cohort] = await db.select().from(courseCohorts).where(eq(courseCohorts.id, id));
    return cohort || undefined;
  }

  async createCourseCohort(cohort: InsertCourseCohort): Promise<CourseCohort> {
    const [newCohort] = await db
      .insert(courseCohorts)
      .values(cohort)
      .returning();
    return newCohort;
  }

  async updateCourseCohort(id: number, cohort: Partial<InsertCourseCohort>): Promise<CourseCohort | undefined> {
    const [updatedCohort] = await db
      .update(courseCohorts)
      .set(cohort)
      .where(eq(courseCohorts.id, id))
      .returning();
    return updatedCohort || undefined;
  }

  async deleteCourseCohort(id: number): Promise<CourseCohort | undefined> {
    const [deletedCohort] = await db
      .delete(courseCohorts)
      .where(eq(courseCohorts.id, id))
      .returning();
    return deletedCohort || undefined;
  }

  // Instructor Proposals methods
  async getInstructorProposals(instructorWallet: string): Promise<InstructorProposal[]> {
    return await db.select().from(instructorProposals).where(eq(instructorProposals.instructorWallet, instructorWallet));
  }

  async createInstructorProposal(proposal: InsertInstructorProposal): Promise<InstructorProposal> {
    const [newProposal] = await db
      .insert(instructorProposals)
      .values(proposal)
      .returning();
    return newProposal;
  }

  async updateProposalStatus(id: number, status: string, txHash?: string): Promise<InstructorProposal | undefined> {
    const updateData: any = { status };
    if (txHash) {
      updateData.onChainTxHash = txHash;
    }
    
    const [updatedProposal] = await db
      .update(instructorProposals)
      .set(updateData)
      .where(eq(instructorProposals.id, id))
      .returning();
    return updatedProposal || undefined;
  }

  // Credential Templates methods
  async getCourseCredentialTemplates(courseId: number): Promise<CredentialTemplate[]> {
    return await db.select().from(credentialTemplates).where(eq(credentialTemplates.courseId, courseId));
  }

  async createCredentialTemplate(template: InsertCredentialTemplate): Promise<CredentialTemplate> {
    const [newTemplate] = await db
      .insert(credentialTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  // Cohort Management implementation
  // Cohort Enrollments
  async getCohortEnrollments(cohortId: number): Promise<CohortEnrollment[]> {
    return await db.select().from(cohortEnrollments).where(eq(cohortEnrollments.cohortId, cohortId));
  }

  async createCohortEnrollment(enrollment: InsertCohortEnrollment): Promise<CohortEnrollment> {
    const [newEnrollment] = await db
      .insert(cohortEnrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  async updateCohortEnrollment(id: number, enrollment: Partial<InsertCohortEnrollment>): Promise<CohortEnrollment | undefined> {
    const [updatedEnrollment] = await db
      .update(cohortEnrollments)
      .set(enrollment)
      .where(eq(cohortEnrollments.id, id))
      .returning();
    return updatedEnrollment || undefined;
  }

  async deleteCohortEnrollment(id: number): Promise<CohortEnrollment | undefined> {
    const [deletedEnrollment] = await db
      .delete(cohortEnrollments)
      .where(eq(cohortEnrollments.id, id))
      .returning();
    return deletedEnrollment || undefined;
  }

  // Assignments
  async getCohortAssignments(cohortId: number): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.cohortId, cohortId));
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set(assignment)
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment || undefined;
  }

  async deleteAssignment(id: number): Promise<Assignment | undefined> {
    const [deletedAssignment] = await db
      .delete(assignments)
      .where(eq(assignments.id, id))
      .returning();
    return deletedAssignment || undefined;
  }

  // Submissions
  async getAssignmentSubmissions(assignmentId: number): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  }

  async getUserSubmission(assignmentId: number, userId: number): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.userId, userId)));
    return submission || undefined;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db
      .insert(submissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async updateSubmission(id: number, submission: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const [updatedSubmission] = await db
      .update(submissions)
      .set(submission)
      .where(eq(submissions.id, id))
      .returning();
    return updatedSubmission || undefined;
  }

  async gradeSubmission(id: number, grade: number, feedback: string, gradedBy: string): Promise<Submission | undefined> {
    const [gradedSubmission] = await db
      .update(submissions)
      .set({
        grade,
        feedback,
        gradedBy,
        gradedAt: new Date(),
        status: "graded"
      })
      .where(eq(submissions.id, id))
      .returning();
    return gradedSubmission || undefined;
  }

  // Announcements
  async getCohortAnnouncements(cohortId: number): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.cohortId, cohortId));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [updatedAnnouncement] = await db
      .update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement || undefined;
  }

  async deleteAnnouncement(id: number): Promise<Announcement | undefined> {
    const [deletedAnnouncement] = await db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    return deletedAnnouncement || undefined;
  }

  // Cohort Content
  async getCohortContent(cohortId: number): Promise<CohortContent[]> {
    return await db.select().from(cohortContent).where(eq(cohortContent.cohortId, cohortId));
  }

  async getCohortContentByWeek(cohortId: number, week: number): Promise<CohortContent[]> {
    return await db
      .select()
      .from(cohortContent)
      .where(and(eq(cohortContent.cohortId, cohortId), eq(cohortContent.week, week)));
  }

  async createCohortContent(content: InsertCohortContent): Promise<CohortContent> {
    const [newContent] = await db
      .insert(cohortContent)
      .values(content)
      .returning();
    return newContent;
  }

  async updateCohortContent(id: number, content: Partial<InsertCohortContent>): Promise<CohortContent | undefined> {
    const [updatedContent] = await db
      .update(cohortContent)
      .set(content)
      .where(eq(cohortContent.id, id))
      .returning();
    return updatedContent || undefined;
  }

  async deleteCohortContent(id: number): Promise<CohortContent | undefined> {
    const [deletedContent] = await db
      .delete(cohortContent)
      .where(eq(cohortContent.id, id))
      .returning();
    return deletedContent || undefined;
  }

  // Investor methods
  async getInvestorLeaderboard(sortBy: 'totalInvested' | 'investmentCount', limit: number): Promise<Investor[]> {
    const orderBy = sortBy === 'totalInvested' 
      ? desc(investors.totalInvested) 
      : desc(investors.investmentCount);
    
    return await db
      .select()
      .from(investors)
      .where(eq(investors.showOnLeaderboard, true))
      .orderBy(orderBy)
      .limit(limit);
  }

  async getInvestor(walletAddress: string): Promise<Investor | undefined> {
    const [investor] = await db
      .select()
      .from(investors)
      .where(sql`LOWER(${investors.walletAddress}) = LOWER(${walletAddress})`);
    return investor || undefined;
  }

  async createInvestor(investor: InsertInvestor): Promise<Investor> {
    const [newInvestor] = await db
      .insert(investors)
      .values(investor)
      .returning();
    return newInvestor;
  }

  async updateInvestor(walletAddress: string, investor: Partial<InsertInvestor>): Promise<Investor | undefined> {
    const [updatedInvestor] = await db
      .update(investors)
      .set(investor)
      .where(eq(investors.walletAddress, walletAddress))
      .returning();
    return updatedInvestor || undefined;
  }

  // Investor Preferences methods
  async getInvestorPreferences(walletAddress: string): Promise<InvestorPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(investorPreferences)
      .where(eq(investorPreferences.walletAddress, walletAddress));
    return preferences || undefined;
  }

  // Helper to normalize enum values and clean up legacy fields
  private normalizePreferences(p: any) {
    const riskToleranceMap = { 1: 'conservative', 2: 'moderate', 3: 'aggressive' } as const;
    const fundingTierMap = { 1: 'individual_supporter', 2: 'professional_investor', 3: 'microvc', 4: 'institutional' } as const;
    
    const riskTolerance = typeof p.riskTolerance === 'number' ? riskToleranceMap[p.riskTolerance as keyof typeof riskToleranceMap] : p.riskTolerance;
    const fundingTier = typeof p.fundingTier === 'number' ? fundingTierMap[p.fundingTier as keyof typeof fundingTierMap] : p.fundingTier;
    
    return {
      walletAddress: p.walletAddress,
      quickFundRange: p.quickFundRange || fundingTier || 'individual_supporter', // Use actual value
      preferredAmounts: p.preferredAmounts || [], // Use actual value or default
      defaultAmount: p.defaultAmount || null,
      maxSingleTransaction: p.maxSingleTransaction || null,
      preferredCurrency: p.preferredCurrency || 'ETH',
      interests: p.interests || [],
      riskTolerance: riskTolerance || 'moderate',
      autoInvestEnabled: !!p.autoInvestEnabled,
      theme: p.theme || 'system',
    };
  }

  async createInvestorPreferences(preferences: InsertInvestorPreferences): Promise<InvestorPreferences> {
    const normalizedPrefs = this.normalizePreferences(preferences);
    const [newPreferences] = await db
      .insert(investorPreferences)
      .values(normalizedPrefs)
      .returning();
    return newPreferences;
  }

  async updateInvestorPreferences(walletAddress: string, preferences: Partial<InsertInvestorPreferences>): Promise<InvestorPreferences | undefined> {
    const normalizedPrefs = this.normalizePreferences({ ...preferences, walletAddress });
    const [updatedPreferences] = await db
      .update(investorPreferences)
      .set(normalizedPrefs)
      .where(eq(investorPreferences.walletAddress, walletAddress))
      .returning();
    return updatedPreferences || undefined;
  }

  // Investment methods
  async getInvestorInvestments(walletAddress: string): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.investorWallet, walletAddress))
      .orderBy(desc(investments.investedAt));
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    return await db.transaction(async (tx) => {
      // Create the investment record
      const [newInvestment] = await tx
        .insert(investments)
        .values(investment)
        .returning();

      // Update investor totals
      await tx
        .update(investors)
        .set({
          totalInvested: sql`${investors.totalInvested} + ${investment.amount}`,
          investmentCount: sql`${investors.investmentCount} + 1`
        })
        .where(eq(investors.walletAddress, investment.investorWallet));

      return newInvestment;
    });
  }

  async getTargetInvestments(targetType: string, targetId: string): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(and(
        eq(investments.targetType, targetType),
        eq(investments.targetId, targetId)
      ));
  }

  // Pregenerated Wallet methods
  async createPregeneratedWallet(wallet: InsertPregeneratedWallet): Promise<PregeneratedWallet> {
    const [newWallet] = await db
      .insert(pregeneratedWallets)
      .values(wallet)
      .returning();
    return newWallet;
  }

  async claimWallet(email: string, walletAddress: string): Promise<PregeneratedWallet | undefined> {
    const [wallet] = await db
      .update(pregeneratedWallets)
      .set({ 
        claimedByEmail: email, 
        claimedAt: new Date(),
        claimed: true 
      })
      .where(and(
        eq(pregeneratedWallets.address, walletAddress),
        eq(pregeneratedWallets.claimed, false)
      ))
      .returning();
    return wallet || undefined;
  }

  async getUnclaimedWallet(): Promise<PregeneratedWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(pregeneratedWallets)
      .where(eq(pregeneratedWallets.claimed, false))
      .limit(1);
    return wallet || undefined;
  }

  async getWalletByEmail(email: string): Promise<PregeneratedWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(pregeneratedWallets)
      .where(eq(pregeneratedWallets.claimedByEmail, email));
    return wallet || undefined;
  }
}

export const storage = new DatabaseStorage();
