import { ethers, BrowserProvider, Contract } from 'ethers';

// Contract ABIs (simplified for key functions)
export const DAO_FACTORY_ABI = [
  "function createResearchDAO(string memory _tokenName, string memory _tokenSymbol, string memory _daoName, string memory _description, string memory _researchFocus, uint256 _initialSupply, uint256 _proposalThreshold, uint256 _votingDuration, uint256 _quorumPercentage) external payable returns (address)",
  "function isNameAvailable(string memory _name) external view returns (bool)",
  "function getDeployedDAOs() external view returns (address[] memory)",
  "function creationFee() external view returns (uint256)",
  "event DAOCreated(address indexed daoAddress, string name, address indexed creator, uint256 timestamp)"
];

export const RESEARCH_DAO_ABI = [
  "function getDAOInfo() external view returns (string memory, string memory, string memory, string memory, string memory, uint256, uint256, uint256, uint256, uint256, uint256[] memory, uint256[] memory, uint256, address[] memory)",
  "function joinDAO(string memory _name, string memory _role) external",
  "function createProposal(string memory _title, string memory _description, string memory _researchArea, uint256 _fundingRequested) external returns (uint256)",
  "function getProposal(uint256 _proposalId) external view returns (tuple(uint256 id, address proposer, string title, string description, string researchArea, uint256 fundingRequested, uint256 votesFor, uint256 votesAgainst, uint256 deadline, bool executed, bool approved))",
  "function getActiveProposals() external view returns (uint256[] memory)",
  "function getActiveProjects() external view returns (uint256[] memory)",
  "function getMemberAddresses() external view returns (address[] memory)",
  "function fundDAO() external payable",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes)",
  "event MemberJoined(address indexed member, string name, string role)",
  "event FundsReceived(address indexed from, uint256 amount)"
];

export const BU_FEE_ROUTER_ABI = [
  "function creationFee() external view returns (uint256)",
  "function setCreationFee(uint256 _fee) external",
  "function collectFee() external payable",
  "function withdraw() external",
  "event FeeCollected(address indexed from, uint256 amount)"
];

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  localhost: {
    daoFactory: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // SimpleDAOFactory
    feeRouter: "0x5FbDB2315678afecb367f032d93F642f64180aa3"   // SimpleBUFeeRouter  
  },
  sepolia: {
    daoFactory: "", // To be deployed
    feeRouter: ""   // To be deployed
  },
  mainnet: {
    daoFactory: "", // To be deployed
    feeRouter: ""   // To be deployed
  }
};

// Helper to get contract addresses for current network
export const getContractAddresses = (chainId: number) => {
  switch (chainId) {
    case 1337: // Localhost
    case 31337: // Hardhat
      return CONTRACT_ADDRESSES.localhost;
    case 11155111: // Sepolia
      return CONTRACT_ADDRESSES.sepolia;
    case 1: // Mainnet
      return CONTRACT_ADDRESSES.mainnet;
    default:
      return CONTRACT_ADDRESSES.localhost;
  }
};

// Contract interaction helpers
export class ContractService {
  private provider: BrowserProvider;
  private signer: any;
  private chainId: number;

  constructor(provider: BrowserProvider, chainId: number) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.chainId = chainId;
  }

  private getAddresses() {
    return getContractAddresses(this.chainId);
  }

  // DAO Factory contract
  getDaoFactoryContract() {
    const { ethers } = require('ethers');
    const addresses = this.getAddresses();
    return new ethers.Contract(addresses.daoFactory, DAO_FACTORY_ABI, this.signer);
  }

  // Research DAO contract
  getResearchDaoContract(address: string) {
    const { ethers } = require('ethers');
    return new ethers.Contract(address, RESEARCH_DAO_ABI, this.signer);
  }

  // Fee Router contract
  getFeeRouterContract() {
    const { ethers } = require('ethers');
    const addresses = this.getAddresses();
    return new ethers.Contract(addresses.feeRouter, BU_FEE_ROUTER_ABI, this.signer);
  }

  // Create a new research DAO
  async createResearchDAO({
    tokenName,
    tokenSymbol,
    daoName,
    description,
    researchFocus,
    initialSupply,
    proposalThreshold,
    votingDuration,
    quorumPercentage
  }: {
    tokenName: string;
    tokenSymbol: string;
    daoName: string;
    description: string;
    researchFocus: string;
    initialSupply: string;
    proposalThreshold: string;
    votingDuration: number;
    quorumPercentage: number;
  }) {
    const factory = this.getDaoFactoryContract();
    
    // Get creation fee
    const creationFee = await factory.creationFee();
    
    // Convert values to proper format
    const { ethers } = require('ethers');
    const initialSupplyWei = ethers.utils.parseEther(initialSupply);
    const proposalThresholdWei = ethers.utils.parseEther(proposalThreshold);
    const votingDurationSeconds = votingDuration * 24 * 60 * 60; // Convert days to seconds
    
    const tx = await factory.createResearchDAO(
      tokenName,
      tokenSymbol,
      daoName,
      description,
      researchFocus,
      initialSupplyWei,
      proposalThresholdWei,
      votingDurationSeconds,
      quorumPercentage,
      { value: creationFee }
    );
    
    const receipt = await tx.wait();
    
    // Get the DAO address from the event
    const event = receipt.events?.find((e: any) => e.event === 'DAOCreated');
    const daoAddress = event?.args?.daoAddress;
    
    return {
      transaction: tx,
      receipt,
      daoAddress
    };
  }

  // Get all active DAOs
  async getAllActiveDAOs() {
    const factory = this.getDaoFactoryContract();
    const activeIds = await factory.getAllActiveDAOs();
    
    const daos = [];
    for (const id of activeIds) {
      const daoInfo = await factory.getDAO(id);
      daos.push({
        id: id.toString(),
        address: daoInfo.daoAddress,
        name: daoInfo.name,
        description: daoInfo.description,
        researchFocus: daoInfo.researchFocus,
        creator: daoInfo.creator,
        createdAt: new Date(daoInfo.createdAt.toNumber() * 1000),
        isActive: daoInfo.isActive
      });
    }
    
    return daos;
  }

  // Get DAO details
  async getDAODetails(address: string) {
    const dao = this.getResearchDaoContract(address);
    
    const [
      name,
      symbol,
      daoName,
      description,
      researchFocus,
      totalSupply,
      proposalThreshold,
      votingDuration,
      quorumPercentage,
      treasuryBalance,
      activeProposals,
      activeProjects,
      memberAddresses
    ] = await Promise.all([
      dao.name(),
      dao.symbol(),
      dao.daoName(),
      dao.description(),
      dao.researchFocus(),
      dao.totalSupply(),
      dao.proposalThreshold(),
      dao.votingDuration(),
      dao.quorumPercentage(),
      dao.getTreasuryBalance(),
      dao.getActiveProposals(),
      dao.getActiveProjects(),
      dao.getMemberAddresses()
    ]);

    const { ethers } = require('ethers');
    return {
      tokenName: name,
      tokenSymbol: symbol,
      daoName,
      description,
      researchFocus,
      totalSupply: ethers.utils.formatEther(totalSupply),
      proposalThreshold: ethers.utils.formatEther(proposalThreshold),
      votingDuration: votingDuration.toNumber() / (24 * 60 * 60), // Convert to days
      quorumPercentage: quorumPercentage.toNumber(),
      treasuryBalance: ethers.utils.formatEther(treasuryBalance),
      activeProposals: activeProposals.map((id: any) => id.toString()),
      activeProjects: activeProjects.map((id: any) => id.toString()),
      memberCount: memberAddresses.length,
      memberAddresses
    };
  }

  // Join a DAO
  async joinDAO(daoAddress: string, name: string, role: string) {
    const dao = this.getResearchDaoContract(daoAddress);
    const tx = await dao.joinDAO(name, role);
    return tx.wait();
  }

  // Create a proposal
  async createProposal(
    daoAddress: string,
    title: string,
    description: string,
    researchArea: string,
    fundingRequested: string
  ) {
    const { ethers } = require('ethers');
    const dao = this.getResearchDaoContract(daoAddress);
    const fundingWei = ethers.utils.parseEther(fundingRequested);
    const tx = await dao.createProposal(title, description, researchArea, fundingWei);
    return tx.wait();
  }

  // Vote on a proposal
  async voteOnProposal(daoAddress: string, proposalId: string, support: boolean) {
    const dao = this.getResearchDaoContract(daoAddress);
    const tx = await dao.vote(proposalId, support);
    return tx.wait();
  }

  // Execute a proposal
  async executeProposal(daoAddress: string, proposalId: string) {
    const dao = this.getResearchDaoContract(daoAddress);
    const tx = await dao.executeProposal(proposalId);
    return tx.wait();
  }

  // Fund a DAO
  async fundDAO(daoAddress: string, amount: string) {
    const { ethers } = require('ethers');
    const dao = this.getResearchDaoContract(daoAddress);
    const amountWei = ethers.utils.parseEther(amount);
    const tx = await dao.fundDAO({ value: amountWei });
    return tx.wait();
  }

  // Get proposal details
  async getProposal(daoAddress: string, proposalId: string) {
    const { ethers } = require('ethers');
    const dao = this.getResearchDaoContract(daoAddress);
    const proposal = await dao.getProposal(proposalId);
    
    return {
      id: proposal.id.toString(),
      proposer: proposal.proposer,
      title: proposal.title,
      description: proposal.description,
      researchArea: proposal.researchArea,
      fundingRequested: ethers.utils.formatEther(proposal.fundingRequested),
      votesFor: ethers.utils.formatEther(proposal.votesFor),
      votesAgainst: ethers.utils.formatEther(proposal.votesAgainst),
      deadline: new Date(proposal.deadline.toNumber() * 1000),
      executed: proposal.executed,
      approved: proposal.approved
    };
  }

  // Check if name is available
  async isNameAvailable(name: string) {
    const factory = this.getDaoFactoryContract();
    return factory.isNameAvailable(name);
  }

  // Get creation fee
  async getCreationFee() {
    const { ethers } = require('ethers');
    const factory = this.getDaoFactoryContract();
    const fee = await factory.creationFee();
    return ethers.utils.formatEther(fee);
  }
}

export default ContractService;