import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Simple script to add sample DAOs to the database via API
const sampleDAOs = [
  {
    id: "climate-tech-dao",
    name: "Climate Tech DAO",
    description: "Advancing carbon capture and renewable energy technologies for climate change mitigation. Funding breakthrough research in atmospheric CO2 reduction and sustainable energy solutions.",
    category: "Environmental",
    location: "Global",
    objectives: ["Carbon Capture", "Renewable Energy", "Climate Research"],
    fundingGoal: 250000,
    fundingRaised: 85000,
    status: "Funding",
    memberCount: 147,
    governanceModel: "Token-based",
    proposalCount: 8,
    activeProposals: 3,
    // Required fields
    image: "https://images.unsplash.com/photo-1497436072909-f5e4be49f7d8?w=500",
    website: "https://climatetechdao.org",
    votingMechanism: "Token Weighted",
    tokenSymbol: "CLMT",
    lastActivity: "2025-09-16",
    creator: "0xClimateFounder123",
    treasury: 125000,
    tags: ["climate", "carbon-capture", "renewable"]
  },
  {
    id: "desci-bio-dao",
    name: "DeSci Bio DAO", 
    description: "Decentralized biotechnology research focused on longevity, disease treatment, and genetic therapies. Open science approach to medical breakthroughs and drug discovery.",
    category: "Biotechnology",
    location: "United States",
    objectives: ["Longevity Research", "Gene Therapy", "Open Drug Discovery"],
    fundingGoal: 500000,
    fundingRaised: 320000,
    status: "Active",
    memberCount: 289,
    governanceModel: "Quadratic Voting",
    proposalCount: 15,
    activeProposals: 5,
    // Required fields
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
    website: "https://descibiodao.science",
    votingMechanism: "Quadratic Voting",
    tokenSymbol: "DSCI",
    lastActivity: "2025-09-15",
    creator: "0xBioResearcher456",
    treasury: 480000,
    tags: ["biotechnology", "longevity", "genetics"]
  },
  {
    id: "quantum-computing-dao",
    name: "Quantum Computing DAO",
    description: "Advancing quantum computing hardware and algorithms. Research into quantum supremacy applications for cryptography, optimization, and scientific computing.",
    category: "Computing",
    location: "Switzerland",
    objectives: ["Quantum Hardware", "Quantum Algorithms", "Cryptography"],
    fundingGoal: 750000,
    fundingRaised: 125000, 
    status: "Funding",
    memberCount: 95,
    governanceModel: "Token-based",
    proposalCount: 4,
    activeProposals: 2,
    // Required fields
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500",
    website: "https://quantumdao.tech",
    votingMechanism: "Token Weighted",
    tokenSymbol: "QNTM",
    lastActivity: "2025-09-14",
    creator: "0xQuantumPhysicist",
    treasury: 185000,
    tags: ["quantum", "computing", "cryptography"]
  },
  {
    id: "ocean-conservation-dao",
    name: "Ocean Conservation DAO",
    description: "Marine ecosystem preservation through technology. Developing solutions for ocean cleanup, coral restoration, and sustainable aquaculture to protect marine biodiversity.",
    category: "Environmental",
    location: "Australia",
    objectives: ["Ocean Cleanup", "Coral Restoration", "Marine Protection"],
    fundingGoal: 180000,
    fundingRaised: 95000,
    status: "Funding",
    memberCount: 203,
    governanceModel: "Hybrid",
    proposalCount: 12,
    activeProposals: 4,
    // Required fields
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500",
    website: "https://oceanconservationdao.org",
    votingMechanism: "Hybrid Voting",
    tokenSymbol: "OCEAN",
    lastActivity: "2025-09-16",
    creator: "0xOceanGuardian",
    treasury: 145000,
    tags: ["ocean", "conservation", "marine"]
  },
  {
    id: "space-research-dao",
    name: "Space Research DAO", 
    description: "Asteroid mining technology and space resource utilization. Funding research into sustainable space exploration, colonization technologies, and asteroid mining infrastructure.",
    category: "Space Technology",
    location: "Luxembourg",
    objectives: ["Asteroid Mining", "Space Colonization", "Resource Utilization"],
    fundingGoal: 1000000,
    fundingRaised: 450000,
    status: "Active",
    memberCount: 156,
    governanceModel: "Token-based",
    proposalCount: 9,
    activeProposals: 2,
    // Required fields
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500",
    website: "https://spacedao.space",
    votingMechanism: "Token Weighted",
    tokenSymbol: "SPACE",
    lastActivity: "2025-09-13",
    creator: "0xSpaceExplorer",
    treasury: 680000,
    tags: ["space", "mining", "exploration"]
  },
  {
    id: "ai-safety-dao",
    name: "AI Safety DAO",
    description: "Responsible AI development and alignment research. Ensuring artificial general intelligence benefits humanity through safety protocols, ethics research, and governance frameworks.",
    category: "Artificial Intelligence",
    location: "United Kingdom",
    objectives: ["AI Alignment", "Safety Protocols", "Ethics Research"],
    fundingGoal: 600000,
    fundingRaised: 380000,
    status: "Active",
    memberCount: 412,
    governanceModel: "Quadratic Voting",
    proposalCount: 18,
    activeProposals: 6,
    // Required fields
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500",
    website: "https://aisafetydao.ai",
    votingMechanism: "Quadratic Voting",
    tokenSymbol: "AISF",
    lastActivity: "2025-09-16",
    creator: "0xAISafetyAdvocate",
    treasury: 520000,
    tags: ["ai", "safety", "ethics"]
  },
  {
    id: "neural-interface-dao",
    name: "Neural Interface DAO",
    description: "Brain-computer interface research for medical applications. Developing neural prosthetics, treatment for neurological disorders, and cognitive enhancement technologies.",
    category: "Neurotechnology",
    location: "Germany",
    objectives: ["Neural Prosthetics", "Neurological Treatment", "BCI Technology"],
    fundingGoal: 800000,
    fundingRaised: 175000,
    status: "Funding",
    memberCount: 128,
    governanceModel: "Token-based",
    proposalCount: 6,
    activeProposals: 3,
    // Required fields
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
    website: "https://neuralidao.tech",
    votingMechanism: "Token Weighted",
    tokenSymbol: "NEURAL",
    lastActivity: "2025-09-15",
    creator: "0xNeuroscientist",
    treasury: 225000,
    tags: ["neuroscience", "bci", "medical"]
  },
  {
    id: "food-security-dao",
    name: "Food Security DAO",
    description: "Sustainable agriculture and food production technologies. Research into vertical farming, lab-grown meat, and agricultural innovations to address global food security challenges.",
    category: "Agriculture",
    location: "Netherlands",
    objectives: ["Vertical Farming", "Lab-grown Protein", "Sustainable Agriculture"],
    fundingGoal: 350000,
    fundingRaised: 210000,
    status: "Active",
    memberCount: 267,
    governanceModel: "Hybrid",
    proposalCount: 11,
    activeProposals: 4,
    // Required fields
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
    website: "https://foodsecuritydao.org",
    votingMechanism: "Hybrid Voting",
    tokenSymbol: "FOOD",
    lastActivity: "2025-09-16",
    creator: "0xAgriInnovator",
    treasury: 285000,
    tags: ["agriculture", "food-security", "sustainability"]
  }
];

async function createSampleDAOs() {
  console.log("🚀 Creating sample research DAOs in database...\n");
  
  const baseUrl = 'http://localhost:5000';
  let createdCount = 0;
  
  for (const dao of sampleDAOs) {
    try {
      console.log(`📋 Creating: ${dao.name}`);
      console.log(`   Category: ${dao.category} | Goal: $${dao.fundingGoal.toLocaleString()}`);
      
      const response = await fetch(`${baseUrl}/api/research-daos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dao)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Created successfully with ID: ${result.id}`);
        createdCount++;
      } else if (response.status === 409) {
        console.log(`   ⚠️  Already exists, skipping...`);
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${response.status} - ${error}`);
      }
      
      console.log("───────────────────────────────────────────────────────");
      
    } catch (error) {
      console.error(`   ❌ Error creating ${dao.name}:`, error.message);
    }
  }
  
  console.log(`\n🎯 Summary:`);
  console.log(`   ✅ Successfully created: ${createdCount}/${sampleDAOs.length} DAOs`);
  console.log(`   💡 These DAOs are now available in the swipe interface`);
  console.log(`   🔗 Visit the app to start investing in these research opportunities!`);
}

createSampleDAOs().catch(console.error);