import { pgTable, text, serial, integer, boolean, decimal, timestamp, unique, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define enums
export const riskToleranceEnum = pgEnum('risk_tolerance', ['conservative', 'moderate', 'aggressive']);
export const fundingTierEnum = pgEnum('funding_tier', ['individual_supporter', 'professional_investor', 'microvc', 'institutional']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // "Beginner", "Intermediate", "Advanced"
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  enrolled: integer("enrolled").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  location: text("location").notNull(),
  format: text("format").notNull(),
  deliveryMethod: text("delivery_method").notNull(), // "online", "in-person"
  deliveryStyle: text("delivery_style").notNull(), // "Interactive modules with virtual labs", "Live coding sessions with project labs", etc.
  facilities: text("facilities").array().notNull().default([]), // Available facilities
  scholarshipSupport: boolean("scholarship_support").notNull().default(false),
  isNatureReserve: boolean("is_nature_reserve").notNull().default(false),
  instructor: text("instructor").notNull(),
  instructorTitle: text("instructor_title").notNull(),
  overview: text("overview").notNull(),
  nextStartDate: text("next_start_date").notNull(),
  prerequisites: text("prerequisites").array().notNull().default([]),
  learningOutcomes: text("learning_outcomes").array().notNull().default([]),
  materials: text("materials").array().notNull().default([]),
});

export const courseCurriculum = pgTable("course_curriculum", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  week: integer("week").notNull(),
  title: text("title").notNull(),
  topics: text("topics").array().notNull().default([]),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").notNull().default("active"), // "active", "completed", "withdrawn"
});

export const researchDAOs = pgTable("research_daos", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(), // "Active", "Funding", "Completed", "Proposal"
  memberCount: integer("member_count").notNull(),
  fundingGoal: integer("funding_goal").notNull(),
  fundingRaised: integer("funding_raised").notNull(),
  location: text("location").notNull(),
  tags: text("tags").array().notNull().default([]),
  image: text("image").notNull(),
  website: text("website").notNull(),
  governanceModel: text("governance_model").notNull(),
  votingMechanism: text("voting_mechanism").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  proposalCount: integer("proposal_count").notNull(),
  lastActivity: text("last_activity").notNull(),
  creator: text("creator").notNull(),
  treasury: integer("treasury").notNull(),
  // Extended fields for detailed DAO profiles
  governanceToken: text("governance_token"),
  daoAddress: text("dao_address"),
  leadResearcher: text("lead_researcher"),
  researchField: text("research_field"),
  duration: text("duration"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  activeProposals: integer("active_proposals"),
  completedMilestones: integer("completed_milestones"),
  totalMilestones: integer("total_milestones"),
  collaborators: text("collaborators").array().notNull().default([]),
  objectives: text("objectives").array().notNull().default([]),
});

export const daoProposals = pgTable("dao_proposals", {
  id: text("id").primaryKey(),
  daoId: text("dao_id").notNull().references(() => researchDAOs.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  forVotes: text("for_votes").notNull(),
  againstVotes: text("against_votes").notNull(),
  quorum: text("quorum").notNull(),
  timeRemaining: text("time_remaining").notNull(),
  proposer: text("proposer").notNull(),
});

export const daoMilestones = pgTable("dao_milestones", {
  id: serial("id").primaryKey(),
  daoId: text("dao_id").notNull().references(() => researchDAOs.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // "Completed", "In Progress", "Pending"
  fundingReleased: text("funding_released"),
  completedDate: text("completed_date"),
  fundingAllocated: text("funding_allocated"),
  expectedCompletion: text("expected_completion"),
});

export const daoPublications = pgTable("dao_publications", {
  id: serial("id").primaryKey(),
  daoId: text("dao_id").notNull().references(() => researchDAOs.id),
  title: text("title").notNull(),
  authors: text("authors").array().notNull().default([]),
  journal: text("journal").notNull(),
  publishedDate: text("published_date").notNull(),
  citationCount: integer("citation_count").notNull(),
  openAccess: boolean("open_access").notNull(),
  daoFunding: text("dao_funding").notNull(),
  abstract: text("abstract").notNull(),
  researchType: text("research_type").notNull(),
  impactScore: decimal("impact_score", { precision: 3, scale: 1 }).notNull(),
  downloadCount: integer("download_count").notNull(),
  tags: text("tags").array().notNull().default([]),
  doiLink: text("doi_link").notNull(),
  ipfsHash: text("ipfs_hash").notNull(),
  collaborators: text("collaborators").array().notNull().default([]),
});

export const daoCourses = pgTable("dao_courses", {
  id: serial("id").primaryKey(),
  daoId: text("dao_id").notNull().references(() => researchDAOs.id),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  price: text("price").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  students: integer("students").notNull(),
  description: text("description").notNull(),
  skills: text("skills").array().notNull().default([]),
  relevance: text("relevance").notNull(),
});

// Instructor-related tables
export const instructorProfiles = pgTable("instructor_profiles", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  expertise: text("expertise").array().notNull().default([]),
  title: text("title"),
  institution: text("institution"),
  externalLinks: text("external_links").array().notNull().default([]),
  profileImageHash: text("profile_image_hash"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const instructorCourses = pgTable("instructor_courses", {
  id: serial("id").primaryKey(),
  instructorWallet: text("instructor_wallet").notNull().references(() => instructorProfiles.walletAddress),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  deliveryMethod: text("delivery_method").notNull(),
  daoId: text("dao_id"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courseCohorts = pgTable("course_cohorts", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => instructorCourses.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  capacity: integer("capacity").notNull(),
  enrolled: integer("enrolled").notNull().default(0),
  enrollmentOpen: boolean("enrollment_open").notNull().default(true),
});

export const instructorProposals = pgTable("instructor_proposals", {
  id: serial("id").primaryKey(),
  instructorWallet: text("instructor_wallet").notNull(),
  courseId: integer("course_id").references(() => instructorCourses.id),
  daoId: text("dao_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requestedAmount: decimal("requested_amount", { precision: 10, scale: 2 }),
  revenueSharePercentage: decimal("revenue_share_percentage", { precision: 5, scale: 2 }),
  status: text("status").notNull().default("draft"),
  onChainTxHash: text("on_chain_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const credentialTemplates = pgTable("credential_templates", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => instructorCourses.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  contractAddress: text("contract_address"),
  templateHash: text("template_hash"),
  requirements: text("requirements").array().notNull().default([]),
});

// Cohort Management tables
export const cohortEnrollments = pgTable("cohort_enrollments", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => courseCohorts.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").notNull().default("active"), // "active", "completed", "withdrawn", "pending"
  progress: integer("progress").notNull().default(0), // percentage 0-100
  lastActiveAt: timestamp("last_active_at").defaultNow(),
}, (table) => {
  return {
    uniqueEnrollment: unique().on(table.cohortId, table.userId),
  }
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => courseCohorts.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("assignment"), // "assignment", "quiz", "project", "discussion"
  maxPoints: integer("max_points").notNull().default(100),
  dueDate: timestamp("due_date").notNull(),
  instructions: text("instructions"),
  resources: text("resources").array().notNull().default([]),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content"), // submission text or file references
  attachments: text("attachments").array().notNull().default([]), // file references
  submittedAt: timestamp("submitted_at").defaultNow(),
  grade: integer("grade"), // points earned
  feedback: text("feedback"), // instructor feedback
  status: text("status").notNull().default("submitted"), // "submitted", "graded", "returned", "late"
  gradedAt: timestamp("graded_at"),
  gradedBy: text("graded_by"), // instructor wallet address
}, (table) => {
  return {
    uniqueSubmission: unique().on(table.assignmentId, table.userId),
  }
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => courseCohorts.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"), // "urgent", "high", "normal", "low"
  published: boolean("published").notNull().default(true),
  emailSent: boolean("email_sent").notNull().default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdBy: text("created_by").notNull(), // instructor wallet address
});

export const cohortContent = pgTable("cohort_content", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => courseCohorts.id, { onDelete: 'cascade' }),
  week: integer("week").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull().default("lesson"), // "lesson", "reading", "video", "assignment", "resource"
  content: text("content"), // main content or description
  materials: text("materials").array().notNull().default([]), // file references, links
  published: boolean("published").notNull().default(false),
  availableFrom: timestamp("available_from").defaultNow(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Investor System Tables
export const investors = pgTable("investors", {
  walletAddress: text("wallet_address").primaryKey(), // Web3 wallet address
  pseudonym: text("pseudonym"), // Optional display name for leaderboard
  profileCompleted: boolean("profile_completed").notNull().default(false),
  showOnLeaderboard: boolean("show_on_leaderboard").notNull().default(false),
  totalInvested: decimal("total_invested", { precision: 20, scale: 2 }).notNull().default("0.00"),
  investmentCount: integer("investment_count").notNull().default(0),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

export const investorPreferences = pgTable("investor_preferences", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().references(() => investors.walletAddress, { onDelete: 'cascade' }),
  quickFundRange: text("quick_fund_range").notNull(), // "range1", "range2", "range3", "range4"
  preferredAmounts: text("preferred_amounts").array().notNull().default([]), // ["100", "500", "1000"]
  defaultAmount: text("default_amount"), // Primary quick fund amount
  maxSingleTransaction: text("max_single_transaction"), // Safety limit
  preferredCurrency: text("preferred_currency").notNull().default("ETH"), // "ETH", "USDC", "DAI"
  interests: text("interests").array().notNull().default([]), // Research interests
  riskTolerance: text("risk_tolerance").notNull().default("moderate"),
  autoInvestEnabled: boolean("auto_invest_enabled").notNull().default(false),
  fundingTier: text("funding_tier").notNull().default("individual_supporter"), // Funding tier selection
  investmentRangeMin: integer("investment_range_min"), // Re-added to match current DB
  investmentRangeMax: integer("investment_range_max"), // Re-added to match current DB
  theme: text("theme").default("system"), // "system", "light", "dark"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  investorWallet: text("investor_wallet").notNull().references(() => investors.walletAddress, { onDelete: 'cascade' }),
  targetType: text("target_type").notNull(), // "dao", "scholarship", "grant", "course"
  targetId: text("target_id").notNull(), // ID of the funded entity
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("ETH"),
  transactionHash: text("transaction_hash"), // Blockchain transaction hash
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "failed", "refunded"
  investedAt: timestamp("invested_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  notes: text("notes"), // Optional investor notes
});

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }).notNull(),
  fundingRaised: decimal("funding_raised", { precision: 10, scale: 2 }).notNull().default("0.00"),
  recipient: text("recipient"), // Student wallet address or name
  criteria: text("criteria").array().notNull().default([]),
  category: text("category").notNull(), // "undergraduate", "graduate", "research", "diversity"
  deadline: timestamp("deadline"),
  status: text("status").notNull().default("open"), // "open", "funded", "closed", "awarded"
  createdBy: text("created_by").notNull(), // Creator wallet address
  createdAt: timestamp("created_at").defaultNow(),
});

export const grantProposals = pgTable("grant_proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposer: text("proposer").notNull(), // Researcher wallet address
  institution: text("institution"),
  researchArea: text("research_area").notNull(),
  timeline: text("timeline"), // Expected duration
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }).notNull(),
  fundingRaised: decimal("funding_raised", { precision: 10, scale: 2 }).notNull().default("0.00"),
  milestones: text("milestones").array().notNull().default([]),
  expectedOutcomes: text("expected_outcomes").array().notNull().default([]),
  riskAssessment: text("risk_assessment"),
  status: text("status").notNull().default("open"), // "open", "funded", "in_progress", "completed", "cancelled"
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high", "urgent"
  createdAt: timestamp("created_at").defaultNow(),
  deadline: timestamp("deadline"),
});

// Pregenerated Wallets for seamless onboarding
export const pregeneratedWallets = pgTable('pregenerated_wallets', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(), // EOA address
  privateKey: text('private_key').notNull(), // Private key for the wallet
  smartWalletAddress: text('smart_wallet_address'), // Smart contract wallet address
  claimed: boolean('claimed').default(false),
  claimedByEmail: text('claimed_by_email'), // Email that claimed this wallet
  claimedAt: timestamp('claimed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  fundedAt: timestamp('funded_at'), // When test ETH was added
  fundingTxHash: text('funding_tx_hash'), // Transaction hash for funding
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  curriculum: many(courseCurriculum),
  enrollments: many(enrollments),
}));

export const courseCurriculumRelations = relations(courseCurriculum, ({ one }) => ({
  course: one(courses, {
    fields: [courseCurriculum.courseId],
    references: [courses.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const researchDAOsRelations = relations(researchDAOs, ({ many }) => ({
  proposals: many(daoProposals),
  milestones: many(daoMilestones),
  publications: many(daoPublications),
  courses: many(daoCourses),
}));

export const daoProposalsRelations = relations(daoProposals, ({ one }) => ({
  dao: one(researchDAOs, {
    fields: [daoProposals.daoId],
    references: [researchDAOs.id],
  }),
}));

export const daoMilestonesRelations = relations(daoMilestones, ({ one }) => ({
  dao: one(researchDAOs, {
    fields: [daoMilestones.daoId],
    references: [researchDAOs.id],
  }),
}));

export const daoPublicationsRelations = relations(daoPublications, ({ one }) => ({
  dao: one(researchDAOs, {
    fields: [daoPublications.daoId],
    references: [researchDAOs.id],
  }),
}));

export const daoCoursesRelations = relations(daoCourses, ({ one }) => ({
  dao: one(researchDAOs, {
    fields: [daoCourses.daoId],
    references: [researchDAOs.id],
  }),
}));

// Cohort Management relations
export const cohortEnrollmentsRelations = relations(cohortEnrollments, ({ one }) => ({
  cohort: one(courseCohorts, {
    fields: [cohortEnrollments.cohortId],
    references: [courseCohorts.id],
  }),
  user: one(users, {
    fields: [cohortEnrollments.userId],
    references: [users.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  cohort: one(courseCohorts, {
    fields: [assignments.cohortId],
    references: [courseCohorts.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  cohort: one(courseCohorts, {
    fields: [announcements.cohortId],
    references: [courseCohorts.id],
  }),
}));

export const cohortContentRelations = relations(cohortContent, ({ one }) => ({
  cohort: one(courseCohorts, {
    fields: [cohortContent.cohortId],
    references: [courseCohorts.id],
  }),
}));

export const courseCohortsRelations = relations(courseCohorts, ({ one, many }) => ({
  course: one(instructorCourses, {
    fields: [courseCohorts.courseId],
    references: [instructorCourses.id],
  }),
  enrollments: many(cohortEnrollments),
  assignments: many(assignments),
  announcements: many(announcements),
  content: many(cohortContent),
}));

// Investor System relations
export const investorsRelations = relations(investors, ({ one, many }) => ({
  preferences: one(investorPreferences),
  investments: many(investments),
}));

export const investorPreferencesRelations = relations(investorPreferences, ({ one }) => ({
  investor: one(investors, {
    fields: [investorPreferences.walletAddress],
    references: [investors.walletAddress],
  }),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  investor: one(investors, {
    fields: [investments.investorWallet],
    references: [investors.walletAddress],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCourseSchema = createInsertSchema(courses);

export const insertCourseCurriculumSchema = createInsertSchema(courseCurriculum);

export const insertEnrollmentSchema = createInsertSchema(enrollments);

// DAO Insert schemas
export const insertResearchDAOSchema = createInsertSchema(researchDAOs);
export const insertDAOProposalSchema = createInsertSchema(daoProposals);
export const insertDAOMilestoneSchema = createInsertSchema(daoMilestones);
export const insertDAOPublicationSchema = createInsertSchema(daoPublications);
export const insertDAOCourseSchema = createInsertSchema(daoCourses);

// Instructor insert schemas
export const insertInstructorProfileSchema = createInsertSchema(instructorProfiles);
export const insertInstructorCourseSchema = createInsertSchema(instructorCourses);
export const insertCourseCohortSchema = createInsertSchema(courseCohorts);
export const insertInstructorProposalSchema = createInsertSchema(instructorProposals);
export const insertCredentialTemplateSchema = createInsertSchema(credentialTemplates);

// Cohort Management insert schemas
export const insertCohortEnrollmentSchema = createInsertSchema(cohortEnrollments);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertSubmissionSchema = createInsertSchema(submissions);
export const insertAnnouncementSchema = createInsertSchema(announcements);
export const insertCohortContentSchema = createInsertSchema(cohortContent);

// Investor System insert schemas
export const insertInvestorSchema = createInsertSchema(investors);
export const insertInvestorPreferencesSchema = createInsertSchema(investorPreferences);
export const insertInvestmentSchema = createInsertSchema(investments);
export const insertScholarshipSchema = createInsertSchema(scholarships);
export const insertGrantProposalSchema = createInsertSchema(grantProposals);

// Pregenerated Wallets insert schema
export const insertPregeneratedWalletSchema = createInsertSchema(pregeneratedWallets).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertCourseCurriculum = z.infer<typeof insertCourseCurriculumSchema>;
export type CourseCurriculum = typeof courseCurriculum.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// DAO Types
export type InsertResearchDAO = z.infer<typeof insertResearchDAOSchema>;
export type ResearchDAO = typeof researchDAOs.$inferSelect;

export type InsertDAOProposal = z.infer<typeof insertDAOProposalSchema>;
export type DAOProposal = typeof daoProposals.$inferSelect;

export type InsertDAOMilestone = z.infer<typeof insertDAOMilestoneSchema>;
export type DAOMilestone = typeof daoMilestones.$inferSelect;

export type InsertDAOPublication = z.infer<typeof insertDAOPublicationSchema>;
export type DAOPublication = typeof daoPublications.$inferSelect;

export type InsertDAOCourse = z.infer<typeof insertDAOCourseSchema>;
export type DAOCourse = typeof daoCourses.$inferSelect;

// Instructor types
export type InstructorProfile = typeof instructorProfiles.$inferSelect;
export type InsertInstructorProfile = z.infer<typeof insertInstructorProfileSchema>;
export type InstructorCourse = typeof instructorCourses.$inferSelect;
export type InsertInstructorCourse = z.infer<typeof insertInstructorCourseSchema>;
export type CourseCohort = typeof courseCohorts.$inferSelect;
export type InsertCourseCohort = z.infer<typeof insertCourseCohortSchema>;
export type InstructorProposal = typeof instructorProposals.$inferSelect;
export type InsertInstructorProposal = z.infer<typeof insertInstructorProposalSchema>;
export type CredentialTemplate = typeof credentialTemplates.$inferSelect;
export type InsertCredentialTemplate = z.infer<typeof insertCredentialTemplateSchema>;

// Cohort Management types
export type CohortEnrollment = typeof cohortEnrollments.$inferSelect;
export type InsertCohortEnrollment = z.infer<typeof insertCohortEnrollmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type CohortContent = typeof cohortContent.$inferSelect;
export type InsertCohortContent = z.infer<typeof insertCohortContentSchema>;

// Investor System types
export type Investor = typeof investors.$inferSelect;
export type InsertInvestor = z.infer<typeof insertInvestorSchema>;
export type InvestorPreferences = typeof investorPreferences.$inferSelect;
export type InsertInvestorPreferences = z.infer<typeof insertInvestorPreferencesSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type GrantProposal = typeof grantProposals.$inferSelect;
export type InsertGrantProposal = z.infer<typeof insertGrantProposalSchema>;

// Pregenerated Wallets types
export type PregeneratedWallet = typeof pregeneratedWallets.$inferSelect;
export type InsertPregeneratedWallet = z.infer<typeof insertPregeneratedWalletSchema>;
