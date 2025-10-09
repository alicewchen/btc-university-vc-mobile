// Shared types for the mobile app

export interface DAO {
  id: string;
  name: string;
  description: string;
  category: string;
  researchFocus: string;
  status: string;
  fundingGoal: number;
  fundingRaised: number;
  memberCount: number;
  governanceToken: string;
  tags: string[];
  location?: string;
  establishedDate?: string;
  contractAddress?: string;
  treasuryBalance?: number;
}

export interface Milestone {
  id: string;
  daoId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
}

export interface Publication {
  id: string;
  daoId: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  type: string;
  ipfsHash?: string;
  pdfUrl?: string;
}

export interface Course {
  id: string;
  daoId: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  enrollmentCount: number;
}

export interface GovernanceProposal {
  id: string;
  daoId: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  deadline: string;
}

export interface CreateDAOFormData {
  name: string;
  description: string;
  category: string;
  researchFocus: string;
  fundingGoal: number;
  governanceToken: string;
  initialSupply: string;
  proposalThreshold: string;
  votingDuration: string;
  quorumPercentage: string;
}

export interface WalletConnection {
  address: string;
  provider: string;
  chainId: number;
  connected: boolean;
}
