const { ethers } = require("hardhat");

// Contract addresses from deployment
const DAO_FACTORY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const FEE_ROUTER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const DAO_FACTORY_ABI = [
  "function createResearchDAO(string memory _tokenName, string memory _tokenSymbol, string memory _daoName, string memory _description, string memory _researchFocus, uint256 _initialSupply, uint256 _proposalThreshold, uint256 _votingDuration, uint256 _quorumPercentage) external payable returns (address)",
  "function isNameAvailable(string memory _name) external view returns (bool)",
  "function getDeployedDAOs() external view returns (address[] memory)",
  "function creationFee() external view returns (uint256)",
  "event DAOCreated(address indexed daoAddress, string name, address indexed creator, uint256 timestamp)"
];

// Sample DAO configurations for diverse research areas
const SAMPLE_DAOS = [
  {
    tokenName: "Climate Tech Token",
    tokenSymbol: "CLMT", 
    daoName: "Climate Tech DAO",
    description: "Advancing carbon capture and renewable energy technologies for climate change mitigation. Funding breakthrough research in atmospheric CO2 reduction.",
    researchFocus: "Climate Technology",
    initialSupply: "1000000",
    proposalThreshold: "100",
    votingDuration: "7",
    quorumPercentage: "25"
  },
  {
    tokenName: "DeSci Bio Token",
    tokenSymbol: "DSCI",
    daoName: "DeSci Bio DAO", 
    description: "Decentralized biotechnology research focused on longevity, disease treatment, and genetic therapies. Open science approach to medical breakthroughs.",
    researchFocus: "Biotechnology",
    initialSupply: "2000000",
    proposalThreshold: "150",
    votingDuration: "10", 
    quorumPercentage: "30"
  },
  {
    tokenName: "Quantum Computing Token",
    tokenSymbol: "QNTM",
    daoName: "Quantum Computing DAO",
    description: "Advancing quantum computing hardware and algorithms. Research into quantum supremacy applications for cryptography and optimization.",
    researchFocus: "Quantum Computing",
    initialSupply: "500000",
    proposalThreshold: "50",
    votingDuration: "14",
    quorumPercentage: "35"
  },
  {
    tokenName: "Ocean Conservation Token", 
    tokenSymbol: "OCEAN",
    daoName: "Ocean Conservation DAO",
    description: "Marine ecosystem preservation through technology. Developing solutions for ocean cleanup, coral restoration, and sustainable aquaculture.",
    researchFocus: "Marine Science",
    initialSupply: "1500000",
    proposalThreshold: "75",
    votingDuration: "5",
    quorumPercentage: "20"
  },
  {
    tokenName: "Space Research Token",
    tokenSymbol: "SPACE",
    daoName: "Space Research DAO", 
    description: "Asteroid mining technology and space resource utilization. Funding research into sustainable space exploration and colonization.",
    researchFocus: "Space Technology",
    initialSupply: "800000",
    proposalThreshold: "120",
    votingDuration: "12",
    quorumPercentage: "40"
  },
  {
    tokenName: "AI Safety Token",
    tokenSymbol: "AISF",
    daoName: "AI Safety DAO",
    description: "Responsible AI development and alignment research. Ensuring artificial general intelligence benefits humanity through safety protocols.",
    researchFocus: "AI Safety",
    initialSupply: "3000000", 
    proposalThreshold: "200",
    votingDuration: "8",
    quorumPercentage: "45"
  }
];

async function main() {
  console.log("🚀 Starting sample DAO minting process...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📋 Minting DAOs with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // Connect to the DAO factory contract
  const factory = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, deployer);
  
  // Get creation fee
  const creationFee = await factory.creationFee();
  console.log("💸 Creation fee per DAO:", ethers.formatEther(creationFee), "ETH");
  
  // Check existing DAOs
  const existingDAOs = await factory.getDeployedDAOs();
  console.log("📊 Existing DAOs on chain:", existingDAOs.length);
  console.log("═══════════════════════════════════════════════════════\n");

  const mintedDAOs = [];
  
  for (let i = 0; i < SAMPLE_DAOS.length; i++) {
    const dao = SAMPLE_DAOS[i];
    
    try {
      console.log(`🏭 Minting DAO ${i + 1}/${SAMPLE_DAOS.length}: ${dao.daoName}`);
      console.log(`   Token: ${dao.tokenSymbol} | Focus: ${dao.researchFocus}`);
      
      // Check if name is available
      const nameAvailable = await factory.isNameAvailable(dao.daoName);
      if (!nameAvailable) {
        console.log(`   ⚠️  Name '${dao.daoName}' already taken, skipping...`);
        continue;
      }
      
      // Create the DAO
      const tx = await factory.createResearchDAO(
        dao.tokenName,
        dao.tokenSymbol,
        dao.daoName,
        dao.description,
        dao.researchFocus,
        ethers.parseEther(dao.initialSupply),
        ethers.parseEther(dao.proposalThreshold),
        parseInt(dao.votingDuration),
        parseInt(dao.quorumPercentage),
        { value: creationFee }
      );
      
      console.log(`   📤 Transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`   ✅ DAO created successfully! Block: ${receipt.blockNumber}`);
      
      // Extract DAO address from event
      const daoCreatedEvent = receipt.logs.find(log => {
        try {
          const decoded = factory.interface.parseLog(log);
          return decoded.name === 'DAOCreated';
        } catch {
          return false;
        }
      });
      
      if (daoCreatedEvent) {
        const decoded = factory.interface.parseLog(daoCreatedEvent);
        const daoAddress = decoded.args.daoAddress;
        console.log(`   🏠 DAO Address: ${daoAddress}`);
        
        mintedDAOs.push({
          name: dao.daoName,
          symbol: dao.tokenSymbol,
          address: daoAddress,
          focus: dao.researchFocus
        });
      }
      
      console.log("───────────────────────────────────────────────────────");
      
      // Small delay between creations to avoid gas issues
      if (i < SAMPLE_DAOS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`   ❌ Failed to create ${dao.daoName}:`, error.message);
      continue;
    }
  }
  
  console.log("\n🎯 Minting Summary:");
  console.log(`   ✅ Successfully minted: ${mintedDAOs.length}/${SAMPLE_DAOS.length} DAOs`);
  console.log(`   💰 Total cost: ${ethers.formatEther(creationFee * BigInt(mintedDAOs.length))} ETH`);
  
  if (mintedDAOs.length > 0) {
    console.log("\n📋 Minted DAOs:");
    mintedDAOs.forEach((dao, index) => {
      console.log(`   ${index + 1}. ${dao.name} (${dao.symbol}) - ${dao.focus}`);
      console.log(`      Address: ${dao.address}`);
    });
  }
  
  // Final verification
  const finalDAOCount = await factory.getDeployedDAOs();
  console.log(`\n📊 Total DAOs on blockchain: ${finalDAOCount.length}`);
  console.log("🚀 Sample DAO minting completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Minting failed:", error);
    process.exit(1);
  });