import { ethers } from 'ethers';
import { storage } from './storage';

// Contract addresses and ABIs for indexing
const CONTRACT_ADDRESSES = {
  localhost: {
    daoFactory: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    feeRouter: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  }
};

const DAO_FACTORY_ABI = [
  "event DAOCreated(address indexed daoAddress, string name, address indexed creator, uint256 timestamp)",
  "function getDeployedDAOs() external view returns (address[] memory)"
];

const RESEARCH_DAO_ABI = [
  "event MemberJoined(address indexed member, string name, string role)",
  "event FundsReceived(address indexed from, uint256 amount)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)"
];

interface BlockchainEvent {
  id: string;
  contractAddress: string;
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
  data: any;
}

export class BlockchainIndexer {
  private provider: ethers.JsonRpcProvider | null = null;
  private isRunning = false;
  private currentBlock = 0;
  private indexingInterval: NodeJS.Timeout | null = null;

  constructor(private rpcUrl: string = 'http://localhost:8545') {}

  async initialize() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log('🔗 Blockchain indexer connected to network:', network.name, 'Chain ID:', network.chainId);
      
      // Get current block number
      this.currentBlock = await this.provider.getBlockNumber();
      console.log('📊 Starting indexing from block:', this.currentBlock);
      
      return true;
    } catch (error: any) {
      // Check if this is a connection refused error (node not running)
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        // Expected case: local node not running - gracefully handle
        console.log('⚠️  Blockchain indexer not available (local node not running at', this.rpcUrl + ')');
        console.log('💡 Tip: Start Hardhat node with: cd contracts && npx hardhat node');
        return false;
      } else {
        // Unexpected error (invalid RPC URL, auth failure, etc.) - fail fast
        console.error('❌ Critical error initializing blockchain indexer:', error);
        throw error; // Re-throw to surface configuration/runtime issues
      }
    }
  }

  async startIndexing(intervalMs: number = 5000) {
    if (!this.provider) {
      throw new Error('Indexer not initialized');
    }

    if (this.isRunning) {
      console.log('⚠️  Indexer is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting blockchain indexer...');

    // Index historical events first
    await this.indexHistoricalEvents();

    // Set up real-time indexing
    this.indexingInterval = setInterval(async () => {
      try {
        await this.indexNewBlocks();
      } catch (error) {
        console.error('❌ Error during indexing:', error);
      }
    }, intervalMs);

    console.log('✅ Blockchain indexer started successfully');
  }

  async stopIndexing() {
    this.isRunning = false;
    if (this.indexingInterval) {
      clearInterval(this.indexingInterval);
      this.indexingInterval = null;
    }
    console.log('🛑 Blockchain indexer stopped');
  }

  private async indexHistoricalEvents() {
    if (!this.provider) return;

    console.log('📚 Indexing historical blockchain events...');

    try {
      // Index DAO creation events
      await this.indexDAOCreatedEvents();
      
      // Index DAO-specific events
      await this.indexDAOEvents();
      
    } catch (error) {
      console.error('❌ Error indexing historical events:', error);
    }
  }

  private async indexDAOCreatedEvents() {
    if (!this.provider) return;

    const daoFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.localhost.daoFactory,
      DAO_FACTORY_ABI,
      this.provider
    );

    try {
      // Get all DAO creation events
      const filter = daoFactory.filters.DAOCreated();
      const events = await daoFactory.queryFilter(filter, 0, 'latest');

      console.log(`📋 Found ${events.length} DAO creation events`);

      for (const event of events) {
        if ('args' in event && event.args) {
          const [daoAddress, name, creator, timestamp] = event.args;
          
          await this.processDAOCreatedEvent({
            daoAddress: daoAddress.toString(),
            name: name.toString(),
            creator: creator.toString(),
            timestamp: Number(timestamp),
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash
          });
        }
      }
    } catch (error) {
      console.error('❌ Error indexing DAO creation events:', error);
    }
  }

  private async indexDAOEvents() {
    if (!this.provider) return;
    
    try {
      // Get all deployed DAO addresses
      const daoFactory = new ethers.Contract(
        CONTRACT_ADDRESSES.localhost.daoFactory,
        ["function getDeployedDAOs() external view returns (address[] memory)"],
        this.provider
      );
      
      const daoAddresses = await daoFactory.getDeployedDAOs();
      console.log(`🏭 Indexing events for ${daoAddresses.length} DAOs`);

      for (const daoAddress of daoAddresses) {
        await this.indexSingleDAOEvents(daoAddress);
      }
    } catch (error) {
      console.error('❌ Error indexing DAO events:', error);
    }
  }

  private async indexSingleDAOEvents(daoAddress: string) {
    if (!this.provider) return;

    const dao = new ethers.Contract(daoAddress, RESEARCH_DAO_ABI, this.provider);

    try {
      // Index member joined events
      const memberFilter = dao.filters.MemberJoined();
      const memberEvents = await dao.queryFilter(memberFilter, 0, 'latest');

      // Index funds received events
      const fundsFilter = dao.filters.FundsReceived();
      const fundsEvents = await dao.queryFilter(fundsFilter, 0, 'latest');

      // Index proposal events
      const proposalFilter = dao.filters.ProposalCreated();
      const proposalEvents = await dao.queryFilter(proposalFilter, 0, 'latest');

      console.log(`📊 DAO ${daoAddress}: ${memberEvents.length} members, ${fundsEvents.length} investments, ${proposalEvents.length} proposals`);

      // Process all events
      for (const event of [...memberEvents, ...fundsEvents, ...proposalEvents]) {
        if ('args' in event) {
          await this.processDAOEvent(daoAddress, event);
        }
      }
    } catch (error) {
      console.error(`❌ Error indexing events for DAO ${daoAddress}:`, error);
    }
  }

  private async indexNewBlocks() {
    if (!this.provider) return;

    const latestBlock = await this.provider.getBlockNumber();
    
    if (latestBlock > this.currentBlock) {
      console.log(`🔄 Indexing blocks ${this.currentBlock + 1} to ${latestBlock}`);
      
      // Index events in new blocks
      for (let blockNumber = this.currentBlock + 1; blockNumber <= latestBlock; blockNumber++) {
        await this.indexBlockEvents(blockNumber);
      }
      
      this.currentBlock = latestBlock;
    }
  }

  private async indexBlockEvents(blockNumber: number) {
    if (!this.provider) return;

    try {
      const block = await this.provider.getBlock(blockNumber);
      if (!block) return;

      console.log(`📦 Processing block ${blockNumber} with ${block.transactions.length} transactions`);

      // Process each transaction for relevant events
      for (const txHash of block.transactions) {
        const receipt = await this.provider.getTransactionReceipt(txHash);
        if (receipt && receipt.logs.length > 0) {
          await this.processTransactionLogs(receipt);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing block ${blockNumber}:`, error);
    }
  }

  private async processTransactionLogs(receipt: ethers.TransactionReceipt) {
    for (const log of receipt.logs) {
      // Check if this is a DAO factory event
      if (log.address.toLowerCase() === CONTRACT_ADDRESSES.localhost.daoFactory.toLowerCase()) {
        await this.processFactoryLog(log);
      }
      
      // Check if this is from a deployed DAO
      await this.processDAOLog(log);
    }
  }

  private async processFactoryLog(log: ethers.Log) {
    try {
      const daoFactory = new ethers.Contract(
        CONTRACT_ADDRESSES.localhost.daoFactory,
        DAO_FACTORY_ABI,
        this.provider
      );

      const parsed = daoFactory.interface.parseLog(log);
      if (parsed && parsed.name === 'DAOCreated') {
        const [daoAddress, name, creator, timestamp] = parsed.args;
        
        await this.processDAOCreatedEvent({
          daoAddress: daoAddress.toString(),
          name: name.toString(),
          creator: creator.toString(),
          timestamp: Number(timestamp),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash
        });
      }
    } catch (error) {
      // Not a factory event, skip silently
    }
  }

  private async processDAOLog(log: ethers.Log) {
    try {
      const dao = new ethers.Contract(log.address, RESEARCH_DAO_ABI, this.provider);
      const parsed = dao.interface.parseLog(log);
      
      if (parsed) {
        await this.processDAOEvent(log.address, { ...log, args: parsed.args });
      }
    } catch (error) {
      // Not a DAO event, skip silently
    }
  }

  private async processDAOCreatedEvent(eventData: any) {
    console.log('🏭 Processing DAO creation:', eventData.name);

    try {
      // Create blockchain DAO record in database
      const blockchainDAO = {
        id: `blockchain-${eventData.daoAddress}`,
        name: eventData.name,
        description: `Blockchain DAO created by ${eventData.creator}`,
        category: 'Blockchain',
        status: 'Active',
        memberCount: 1,
        fundingGoal: 1000000, // Default
        fundingRaised: 0,
        location: 'On-chain',
        tags: ['blockchain', 'smart-contract'],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500',
        website: `https://etherscan.io/address/${eventData.daoAddress}`,
        governanceModel: 'Token-based',
        votingMechanism: 'On-chain Voting',
        tokenSymbol: 'DAO',
        proposalCount: 0,
        lastActivity: new Date().toISOString().split('T')[0],
        creator: eventData.creator,
        treasury: 0,
        daoAddress: eventData.daoAddress,
        activeProposals: 0,
        objectives: ['Blockchain Research', 'Decentralized Governance']
      };

      await storage.createResearchDAO(blockchainDAO);
      console.log('✅ Blockchain DAO saved to database:', eventData.name);
    } catch (error) {
      console.error('❌ Error saving blockchain DAO:', error);
    }
  }

  private async processDAOEvent(daoAddress: string, event: any) {
    // Log DAO events for analytics
    console.log(`📊 DAO Event - ${daoAddress}: ${event.fragment?.name || 'Unknown'}`);
    
    // Could store individual events in a separate events table
    // This would enable detailed analytics and reporting
  }

  async getIndexingStats() {
    return {
      isRunning: this.isRunning,
      currentBlock: this.currentBlock,
      provider: this.provider ? 'Connected' : 'Disconnected',
      rpcUrl: this.rpcUrl
    };
  }
}

// Export singleton instance
export const blockchainIndexer = new BlockchainIndexer();

// Auto-start indexing in development  
if (process.env.NODE_ENV === 'development') {
  // Initialize with a small delay to let the server start
  setTimeout(() => {
    (async () => {
      try {
        const initialized = await blockchainIndexer.initialize();
        if (initialized) {
          await blockchainIndexer.startIndexing(10000); // Check every 10 seconds
        } else {
          // False return = graceful handling of expected "node not running" case
          console.log('ℹ️  App running without blockchain indexing (local node not required)');
        }
      } catch (error: any) {
        // Critical initialization error (not just missing node) - fail fast
        console.error('❌ FATAL: Blockchain indexer configuration error:', error.message);
        console.error('   Server cannot start with invalid blockchain configuration');
        console.error('   Fix the RPC URL or disable blockchain indexing');
        process.exit(1); // Exit process on critical configuration errors
      }
    })();
  }, 5000);
}