import { storage } from './storage';

// Complete DAO data from the frontend
const daoData = [
  {
    dao: {
      id: "dao-1",
      name: "Arctic Climate Research Coalition",
      description: "Decentralized research network studying polar ice dynamics and climate change impacts using advanced sensor networks and satellite data analysis.",
      category: "Climate Science",
      status: "Active",
      memberCount: 234,
      fundingGoal: 2500000,
      fundingRaised: 1847500,
      location: "Global",
      tags: ["Climate Change", "Arctic Research", "Data Science", "Satellite Analysis"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://arctic-climate-dao.org",
      governanceModel: "Token-weighted voting",
      votingMechanism: "Quadratic Voting",
      tokenSymbol: "ARCTIC",
      proposalCount: 47,
      lastActivity: "2 hours ago",
      creator: "Dr. Elena Petrov",
      treasury: 3200000,
      governanceToken: "ARCTIC",
      daoAddress: "0xarc1...2tic",
      leadResearcher: "Dr. Elena Petrov",
      researchField: "Climate Science",
      duration: "36 months",
      startDate: "2024-01-01",
      endDate: "2027-01-01",
      activeProposals: 2,
      completedMilestones: 2,
      totalMilestones: 6,
      collaborators: ["NOAA", "NASA", "University of Alaska", "Polar Research Institute"],
      objectives: [
        "Deploy advanced sensor networks across Arctic ice sheets",
        "Develop AI-powered climate prediction models",
        "Create real-time ice thickness monitoring system",
        "Establish community-driven data sharing protocols",
        "Launch Arctic climate change early warning platform"
      ]
    },
    proposals: [
      {
        id: "ARC-P-001",
        title: "Enhanced Ice Monitoring Sensors",
        description: "Deploy next-generation ice thickness sensors with real-time satellite uplink capabilities",
        forVotes: "234,500 ARCTIC",
        againstVotes: "45,200 ARCTIC",
        quorum: "89%",
        timeRemaining: "5 days",
        proposer: "Dr. James Wilson"
      }
    ],
    milestones: [
      {
        title: "Sensor Network Deployment",
        description: "Successfully deploy initial sensor network across 12 Arctic research stations",
        status: "Completed",
        fundingReleased: "$420K",
        completedDate: "2024-06-15"
      },
      {
        title: "AI Model Development",
        description: "Develop and train climate prediction AI models using collected sensor data",
        status: "In Progress",
        fundingAllocated: "$320K",
        expectedCompletion: "2025-03-15"
      }
    ],
    publications: [
      {
        title: "Real-time Arctic Ice Monitoring Using Distributed Sensor Networks",
        authors: ["Dr. Elena Petrov", "Dr. James Wilson", "Prof. Sarah Kim"],
        journal: "Nature Climate Change",
        publishedDate: "2024-11-15",
        citationCount: 89,
        openAccess: true,
        daoFunding: "145,000 ARCTIC tokens",
        abstract: "Novel approach to Arctic ice monitoring using distributed sensor networks with real-time data transmission.",
        researchType: "Peer-Reviewed Paper",
        impactScore: "9.2",
        downloadCount: 3456,
        tags: ["Arctic", "Climate Change", "Sensor Networks", "AI"],
        doiLink: "https://doi.org/10.1038/ncc.2024.11015",
        ipfsHash: "QmArctic123abc456def789ghi012jkl345mno678pqr901",
        collaborators: ["NOAA", "NASA", "University of Alaska"]
      }
    ],
    courses: [
      {
        title: "Arctic Climate Monitoring",
        provider: "ETH Nature Reserve",
        duration: "8 weeks",
        level: "Advanced",
        price: "$1,800",
        rating: "4.8",
        students: 67,
        description: "Advanced techniques in Arctic climate monitoring and sensor network deployment.",
        skills: ["Climate Science", "Sensor Networks", "Data Analysis", "Arctic Research"],
        relevance: "Essential for Arctic climate research and sensor deployment"
      }
    ]
  },
  {
    dao: {
      id: "dao-2",
      name: "Quantum Cryptography Research DAO",
      description: "Collaborative platform for advancing quantum-resistant cryptographic protocols and post-quantum security research for blockchain networks.",
      category: "Quantum Computing",
      status: "Active",
      memberCount: 89,
      fundingGoal: 1800000,
      fundingRaised: 1800000,
      location: "Americas",
      tags: ["Quantum Computing", "Cryptography", "Security", "Blockchain"],
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://quantum-crypto-dao.org",
      governanceModel: "Expertise-weighted",
      votingMechanism: "Conviction Voting",
      tokenSymbol: "QUANTUM",
      proposalCount: 23,
      lastActivity: "5 hours ago",
      creator: "Prof. Michael Zhang",
      treasury: 2100000,
      governanceToken: "QUANTUM",
      daoAddress: "0xqua1...2tum",
      leadResearcher: "Prof. Michael Zhang",
      researchField: "Quantum Computing",
      duration: "48 months",
      startDate: "2023-09-01",
      endDate: "2027-09-01",
      activeProposals: 1,
      completedMilestones: 3,
      totalMilestones: 8,
      collaborators: ["IBM Quantum", "Google AI", "MIT CSAIL", "Stanford Quantum Computing"],
      objectives: [
        "Develop quantum-resistant cryptographic algorithms",
        "Create post-quantum security protocols for blockchains",
        "Build quantum key distribution networks",
        "Establish quantum cryptography standards",
        "Launch quantum-safe blockchain testnet"
      ]
    },
    proposals: [],
    milestones: [
      {
        title: "Quantum Algorithm Development",
        description: "Complete development of core quantum-resistant algorithms",
        status: "Completed",
        fundingReleased: "$340K",
        completedDate: "2024-08-20"
      }
    ],
    publications: [
      {
        title: "Post-Quantum Cryptographic Protocols for Blockchain Security",
        authors: ["Prof. Michael Zhang", "Dr. Alice Chen", "Dr. Robert Kim"],
        journal: "IEEE Transactions on Quantum Engineering",
        publishedDate: "2024-10-12",
        citationCount: 156,
        openAccess: true,
        daoFunding: "78,000 QUANTUM tokens",
        abstract: "Comprehensive analysis of post-quantum cryptographic protocols for securing blockchain networks.",
        researchType: "Peer-Reviewed Paper",
        impactScore: "9.5",
        downloadCount: 5623,
        tags: ["Quantum Computing", "Cryptography", "Blockchain", "Security"],
        doiLink: "https://doi.org/10.1109/tqe.2024.10012",
        ipfsHash: "QmQuantum789xyz123abc456def789ghi012jkl345",
        collaborators: ["IBM Quantum", "Google AI", "MIT CSAIL"]
      }
    ],
    courses: []
  },
  {
    dao: {
      id: "dao-7",
      name: "AI-Enhanced Drug Discovery Alliance",
      description: "Decentralized pharmaceutical research using machine learning to accelerate drug discovery for rare diseases and personalized medicine.",
      category: "Biotechnology",
      status: "Active",
      memberCount: 187,
      fundingGoal: 5800000,
      fundingRaised: 4200000,
      location: "Global",
      tags: ["AI", "Drug Discovery", "Machine Learning", "Pharmaceuticals", "Rare Diseases"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://ai-drug-discovery-dao.org",
      governanceModel: "Research merit-based",
      votingMechanism: "Peer Review Voting",
      tokenSymbol: "CURE",
      proposalCount: 63,
      lastActivity: "1 hour ago",
      creator: "Dr. Sarah Chen",
      treasury: 6300000,
      governanceToken: "CURE",
      daoAddress: "0xcur1...2e34",
      leadResearcher: "Dr. Sarah Chen",
      researchField: "Biotechnology",
      duration: "60 months",
      startDate: "2023-06-01",
      endDate: "2028-06-01",
      activeProposals: 4,
      completedMilestones: 3,
      totalMilestones: 10,
      collaborators: ["Pfizer", "Novartis", "Johns Hopkins", "Stanford Medicine", "FDA"],
      objectives: [
        "Accelerate rare disease drug discovery using AI",
        "Develop personalized medicine algorithms",
        "Create open-source drug discovery platform",
        "Establish AI-driven clinical trial optimization",
        "Launch decentralized pharmaceutical research network"
      ]
    },
    proposals: [
      {
        id: "CURE-P-001",
        title: "Rare Disease Database Expansion",
        description: "Expand AI training database to include 500 additional rare disease profiles",
        forVotes: "345,670 CURE",
        againstVotes: "56,890 CURE",
        quorum: "92%",
        timeRemaining: "2 days",
        proposer: "Dr. Maria Rodriguez"
      }
    ],
    milestones: [
      {
        title: "AI Model Training",
        description: "Complete training of drug discovery AI models on rare disease datasets",
        status: "Completed",
        fundingReleased: "$1.2M",
        completedDate: "2024-09-30"
      },
      {
        title: "Clinical Trial Integration",
        description: "Integrate AI predictions with clinical trial design protocols",
        status: "In Progress",
        fundingAllocated: "$3.2M",
        expectedCompletion: "2025-06-15"
      }
    ],
    publications: [
      {
        title: "AI-Accelerated Drug Discovery for Rare Diseases Using Federated Learning",
        authors: ["Dr. Sarah Chen", "Dr. Maria Rodriguez", "Prof. David Kim"],
        journal: "Nature Medicine",
        publishedDate: "2024-12-01",
        citationCount: 234,
        openAccess: true,
        daoFunding: "125,000 CURE tokens",
        abstract: "Revolutionary AI approach to drug discovery that reduces development time for rare diseases by 60%.",
        researchType: "Peer-Reviewed Paper",
        impactScore: "9.8",
        downloadCount: 8923,
        tags: ["AI", "Drug Discovery", "Rare Diseases", "Machine Learning"],
        doiLink: "https://doi.org/10.1038/nm.2024.12001",
        ipfsHash: "QmCure456def789ghi012jkl345mno678pqr901stu234",
        collaborators: ["Pfizer", "Johns Hopkins", "Stanford Medicine"]
      }
    ],
    courses: [
      {
        title: "AI in Drug Discovery",
        provider: "ETH Nature Reserve",
        duration: "12 weeks",
        level: "Expert",
        price: "$3,200",
        rating: "4.9",
        students: 89,
        description: "Advanced machine learning techniques for pharmaceutical research and drug discovery.",
        skills: ["Machine Learning", "Drug Discovery", "Bioinformatics", "AI"],
        relevance: "Core skills for AI-enhanced pharmaceutical research"
      }
    ]
  },
  {
    dao: {
      id: "dao-13",
      name: "Fusion Energy Research Consortium",
      description: "Collaborative development of compact fusion reactors using advanced plasma confinement techniques and AI-optimized magnetic field control.",
      category: "Renewable Energy",
      status: "Active",
      memberCount: 92,
      fundingGoal: 12000000,
      fundingRaised: 8400000,
      location: "Global",
      tags: ["Fusion Energy", "Plasma Physics", "Clean Energy", "AI Optimization"],
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://fusion-research-dao.org",
      governanceModel: "Scientific advisory board",
      votingMechanism: "Expert Panel Review",
      tokenSymbol: "FUSION",
      proposalCount: 29,
      lastActivity: "1 hour ago",
      creator: "Prof. Maria Santos",
      treasury: 10500000,
      governanceToken: "FUSION",
      daoAddress: "0xfus1...2ion",
      leadResearcher: "Prof. Maria Santos",
      researchField: "Renewable Energy",
      duration: "84 months",
      startDate: "2023-03-01",
      endDate: "2030-03-01",
      activeProposals: 2,
      completedMilestones: 1,
      totalMilestones: 15,
      collaborators: ["ITER", "MIT Plasma Science", "LLNL", "Princeton Plasma Physics", "CERN"],
      objectives: [
        "Develop compact fusion reactor design",
        "Optimize plasma confinement using AI",
        "Create sustainable fusion fuel cycles",
        "Build demonstration fusion power plant",
        "Establish commercial fusion energy pathway"
      ]
    },
    proposals: [
      {
        id: "FUS-P-001",
        title: "Tritium Breeding Module",
        description: "Develop advanced tritium breeding blanket for sustainable fusion fuel production",
        forVotes: "456,780 FUSION",
        againstVotes: "67,890 FUSION",
        quorum: "94%",
        timeRemaining: "6 days",
        proposer: "Dr. Hiroshi Tanaka"
      }
    ],
    milestones: [
      {
        title: "Reactor Design Completion",
        description: "Complete detailed engineering design for compact fusion reactor",
        status: "Completed",
        fundingReleased: "$2.8M",
        completedDate: "2024-11-20"
      }
    ],
    publications: [
      {
        title: "AI-Optimized Plasma Confinement in Compact Fusion Reactors",
        authors: ["Prof. Maria Santos", "Dr. Hiroshi Tanaka", "Prof. Elena Kowalski"],
        journal: "Fusion Engineering and Design",
        publishedDate: "2024-11-28",
        citationCount: 67,
        openAccess: true,
        daoFunding: "234,000 FUSION tokens",
        abstract: "Breakthrough AI optimization techniques for plasma confinement in next-generation compact fusion reactors.",
        researchType: "Peer-Reviewed Paper",
        impactScore: "9.1",
        downloadCount: 4567,
        tags: ["Fusion Energy", "Plasma Physics", "AI Optimization", "Clean Energy"],
        doiLink: "https://doi.org/10.1016/fed.2024.11028",
        ipfsHash: "QmFusion901stu234vwx567yza890bcd123efg456hij",
        collaborators: ["ITER", "MIT Plasma Science", "Princeton Plasma Physics"]
      }
    ],
    courses: [
      {
        title: "Fusion Plasma Physics",
        provider: "ETH Nature Reserve",
        duration: "16 weeks",
        level: "Expert",
        price: "$4,500",
        rating: "4.7",
        students: 23,
        description: "Advanced plasma physics and magnetic confinement for fusion energy research.",
        skills: ["Plasma Physics", "Fusion Energy", "Magnetic Confinement", "Nuclear Engineering"],
        relevance: "Essential for fusion energy research and reactor development"
      }
    ]
  },
  {
    dao: {
      id: "dao-8",
      name: "Indigenous Knowledge Preservation Network",
      description: "Digital archive and research platform documenting traditional ecological knowledge from Indigenous communities worldwide with community-controlled access.",
      category: "Indigenous Knowledge",
      status: "Active",
      memberCount: 156,
      fundingGoal: 950000,
      fundingRaised: 520000,
      location: "Global",
      tags: ["Traditional Knowledge", "Cultural Preservation", "Ethnobotany", "Community Archives"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://indigenous-knowledge-dao.org",
      governanceModel: "Community consensus",
      votingMechanism: "Delegated Voting",
      tokenSymbol: "WISDOM",
      proposalCount: 12,
      lastActivity: "1 day ago",
      creator: "Maria Xólotl",
      treasury: 750000,
      governanceToken: "WISDOM",
      daoAddress: "0xwis1...2dom",
      leadResearcher: "Maria Xólotl",
      researchField: "Indigenous Knowledge",
      duration: "Ongoing",
      startDate: "2024-02-01",
      endDate: "Ongoing",
      activeProposals: 1,
      completedMilestones: 1,
      totalMilestones: 5,
      collaborators: ["Maasai Traditional Council", "Inuit Knowledge Centre", "Amazon Indigenous Network", "UNESCO"],
      objectives: [
        "Create secure digital archives for traditional knowledge",
        "Develop community-controlled access protocols",
        "Establish Indigenous data sovereignty frameworks",
        "Build cross-cultural knowledge sharing platform",
        "Launch traditional medicine research initiative"
      ]
    },
    proposals: [
      {
        id: "WIS-P-001",
        title: "Traditional Medicine Database",
        description: "Expand digital archive to include traditional medicine knowledge from 50 Indigenous communities",
        forVotes: "67,890 WISDOM",
        againstVotes: "12,340 WISDOM",
        quorum: "85%",
        timeRemaining: "8 days",
        proposer: "Elder Joseph Crow Feather"
      }
    ],
    milestones: [
      {
        title: "Community Access Protocols",
        description: "Establish community-controlled access and consent protocols for knowledge sharing",
        status: "Completed",
        fundingReleased: "$180K",
        completedDate: "2024-08-15"
      }
    ],
    publications: [
      {
        title: "Digital Sovereignty and Traditional Knowledge Preservation in Blockchain Systems",
        authors: ["Maria Xólotl", "Elder Joseph Crow Feather", "Dr. Amara Okafor"],
        journal: "Indigenous Knowledge Systems Review",
        publishedDate: "2024-10-22",
        citationCount: 45,
        openAccess: true,
        daoFunding: "34,000 WISDOM tokens",
        abstract: "Framework for preserving Indigenous knowledge while maintaining community control and digital sovereignty.",
        researchType: "Community-Reviewed Paper",
        impactScore: "8.9",
        downloadCount: 2345,
        tags: ["Indigenous Knowledge", "Digital Sovereignty", "Traditional Medicine", "Cultural Preservation"],
        doiLink: "https://doi.org/10.1080/iksr.2024.10022",
        ipfsHash: "QmJ1K2L3mno345pqr678stu901vwx234yza567bcd890efg",
        collaborators: ["Maasai Traditional Council", "MIT Design Lab", "Indigenous Technologies Institute"]
      }
    ],
    courses: []
  },
  {
    dao: {
      id: "dao-14",
      name: "Coral Reef Restoration Initiative",
      description: "3D-printed coral structures and genetic rescue techniques to restore bleached coral reefs using temperature-resistant coral strains.",
      category: "Conservation Technology",
      status: "Active",
      memberCount: 176,
      fundingGoal: 2800000,
      fundingRaised: 2100000,
      location: "Asia-Pacific",
      tags: ["Coral Restoration", "3D Printing", "Marine Biology", "Genetic Rescue", "Climate Adaptation"],
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://coral-restoration-dao.org",
      governanceModel: "Marine biologist led",
      votingMechanism: "Scientific Merit Voting",
      tokenSymbol: "CORAL",
      proposalCount: 44,
      lastActivity: "2 hours ago",
      creator: "Dr. Kenji Nakamura",
      treasury: 2650000,
      governanceToken: "CORAL",
      daoAddress: "0xcor1...2al7",
      leadResearcher: "Dr. Kenji Nakamura",
      researchField: "Conservation Technology",
      duration: "42 months",
      startDate: "2023-08-01",
      endDate: "2027-02-01",
      activeProposals: 2,
      completedMilestones: 2,
      totalMilestones: 8,
      collaborators: ["Great Barrier Reef Foundation", "NOAA Coral Program", "University of Hawaii", "Australian Marine Science"],
      objectives: [
        "Design 3D-printed coral reef structures",
        "Develop temperature-resistant coral strains",
        "Deploy restoration sites across Pacific Ocean",
        "Create coral genetic rescue protocols",
        "Launch community-based reef monitoring network"
      ]
    },
    proposals: [
      {
        id: "COR-P-001",
        title: "Pacific Restoration Sites Expansion",
        description: "Establish 25 new coral restoration sites across the Pacific Ocean",
        forVotes: "234,560 CORAL",
        againstVotes: "34,120 CORAL",
        quorum: "88%",
        timeRemaining: "5 days",
        proposer: "Dr. Marina Silva"
      }
    ],
    milestones: [
      {
        title: "3D Coral Printing System",
        description: "Complete development of large-scale 3D coral printing system",
        status: "Completed",
        fundingReleased: "$680K",
        completedDate: "2024-09-20"
      }
    ],
    publications: [
      {
        title: "3D-Printed Coral Structures for Reef Restoration: A Breakthrough in Marine Conservation",
        authors: ["Dr. Kenji Nakamura", "Dr. Marina Silva", "Prof. James Cook"],
        journal: "Marine Ecology Progress Series",
        publishedDate: "2024-10-15",
        citationCount: 89,
        openAccess: true,
        daoFunding: "45,000 CORAL tokens",
        abstract: "Revolutionary 3D printing techniques for creating biodegradable coral structures that promote natural reef growth.",
        researchType: "Peer-Reviewed Paper",
        impactScore: "8.7",
        downloadCount: 3456,
        tags: ["Coral Restoration", "3D Printing", "Marine Conservation", "Climate Adaptation"],
        doiLink: "https://doi.org/10.3354/meps.2024.10015",
        ipfsHash: "QmCoral789abc123def456ghi789jkl012mno345pqr678",
        collaborators: ["Great Barrier Reef Foundation", "University of Hawaii", "NOAA"]
      }
    ],
    courses: []
  },
  {
    dao: {
      id: "dao-9",
      name: "Asteroid Mining Technology Consortium",
      description: "Space resource extraction research developing robotic mining systems and in-space manufacturing capabilities for rare earth element recovery.",
      category: "Space Technology",
      status: "Funding",
      memberCount: 78,
      fundingGoal: 8500000,
      fundingRaised: 2975000,
      location: "Americas",
      tags: ["Space Mining", "Robotics", "Rare Earth Elements", "In-Space Manufacturing"],
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://asteroid-mining-dao.org",
      governanceModel: "Stake-weighted",
      votingMechanism: "Quadratic Voting",
      tokenSymbol: "ASTEROID",
      proposalCount: 19,
      lastActivity: "2 days ago",
      creator: "Dr. Alex Petrov",
      treasury: 1850000,
      governanceToken: "ASTEROID",
      daoAddress: "0xast1...2oid",
      leadResearcher: "Dr. Alex Petrov",
      researchField: "Space Technology",
      duration: "72 months",
      startDate: "2024-01-01",
      endDate: "2030-01-01",
      activeProposals: 1,
      completedMilestones: 0,
      totalMilestones: 12,
      collaborators: ["SpaceX", "Blue Origin", "NASA JPL", "European Space Agency"],
      objectives: [
        "Develop autonomous asteroid mining robots",
        "Create in-space rare earth processing facilities",
        "Design asteroid prospecting and mapping systems",
        "Build space-based manufacturing platforms",
        "Launch commercial asteroid mining operations"
      ]
    },
    proposals: [
      {
        id: "AST-P-001",
        title: "First Asteroid Prospecting Mission",
        description: "Launch robotic prospecting mission to near-Earth asteroid 2023 BU for mineral assessment",
        forVotes: "123,450 ASTEROID",
        againstVotes: "45,670 ASTEROID",
        quorum: "76%",
        timeRemaining: "12 days",
        proposer: "Prof. Elena Rodriguez"
      }
    ],
    milestones: [],
    publications: [],
    courses: [
      {
        title: "Space Mining and Resource Extraction",
        provider: "ETH Nature Reserve",
        duration: "20 weeks",
        level: "Expert",
        price: "$5,800",
        rating: "4.6",
        students: 34,
        description: "Comprehensive program on asteroid mining technology, space robotics, and in-space manufacturing.",
        skills: ["Space Robotics", "Asteroid Mining", "In-Space Manufacturing", "Orbital Mechanics"],
        relevance: "Critical for space resource extraction and commercial space operations"
      }
    ]
  },
  {
    dao: {
      id: "dao-15",
      name: "Mental Health AI Research Network",
      description: "Ethical AI development for early detection and intervention of mental health conditions using smartphone and wearable device data.",
      category: "Healthcare Technology",
      status: "Active",
      memberCount: 239,
      fundingGoal: 3600000,
      fundingRaised: 2500000,
      location: "Global",
      tags: ["Mental Health", "AI", "Digital Health", "Early Detection", "Privacy-Preserving"],
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://mental-health-ai-dao.org",
      governanceModel: "Patient-clinician partnership",
      votingMechanism: "Privacy-Weighted Voting",
      tokenSymbol: "MIND",
      proposalCount: 67,
      lastActivity: "30 minutes ago",
      creator: "Dr. Lisa Thompson",
      treasury: 3100000,
      governanceToken: "MIND",
      daoAddress: "0xmin1...2d78",
      leadResearcher: "Dr. Lisa Thompson",
      researchField: "Healthcare Technology",
      duration: "36 months",
      startDate: "2023-11-01",
      endDate: "2026-11-01",
      activeProposals: 3,
      completedMilestones: 2,
      totalMilestones: 7,
      collaborators: ["Stanford Digital Health", "Mayo Clinic", "WHO", "Mental Health America"],
      objectives: [
        "Develop privacy-preserving mental health AI algorithms",
        "Create early detection systems for depression and anxiety",
        "Build ethical AI frameworks for mental health",
        "Deploy smartphone-based intervention tools",
        "Launch global mental health monitoring platform"
      ]
    },
    proposals: [
      {
        id: "MND-P-001",
        title: "Depression Early Warning System",
        description: "Deploy AI-powered early warning system for depression using smartphone behavioral patterns",
        forVotes: "345,780 MIND",
        againstVotes: "67,890 MIND",
        quorum: "92%",
        timeRemaining: "3 days",
        proposer: "Dr. Sarah Kim"
      }
    ],
    milestones: [
      {
        title: "Privacy Framework Development",
        description: "Complete privacy-preserving AI framework for mental health data analysis",
        status: "Completed",
        fundingReleased: "$580K",
        completedDate: "2024-07-30"
      }
    ],
    publications: [
      {
        title: "Privacy-Preserving AI for Mental Health: Ethical Frameworks and Clinical Applications",
        authors: ["Dr. Lisa Thompson", "Dr. Sarah Kim", "Prof. Michael Chen"],
        journal: "Digital Medicine",
        publishedDate: "2024-11-10",
        citationCount: 156,
        openAccess: true,
        daoFunding: "78,000 MIND tokens",
        abstract: "Comprehensive framework for ethical AI development in mental health applications while preserving patient privacy.",
        researchType: "Clinical Research Paper",
        impactScore: "9.2",
        downloadCount: 6789,
        tags: ["Mental Health", "AI Ethics", "Privacy", "Digital Health"],
        doiLink: "https://doi.org/10.1038/dm.2024.11010",
        ipfsHash: "QmMind456def789ghi012jkl345mno678pqr901stu234",
        collaborators: ["Stanford Digital Health", "Mayo Clinic", "WHO"]
      }
    ],
    courses: []
  },
  {
    dao: {
      id: "dao-10",
      name: "Graphene Applications Research Hub",
      description: "Next-generation material research focused on graphene applications in electronics, energy storage, and water filtration systems.",
      category: "Materials Science",
      status: "Active",
      memberCount: 203,
      fundingGoal: 3400000,
      fundingRaised: 3400000,
      location: "Asia-Pacific",
      tags: ["Graphene", "Materials Science", "Electronics", "Energy Storage", "Water Filtration"],
      image: "https://images.unsplash.com/photo-1567427018141-95ea69964de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://graphene-research-dao.org",
      governanceModel: "Research output weighted",
      votingMechanism: "Peer Review Voting",
      tokenSymbol: "GRAPHENE",
      proposalCount: 52,
      lastActivity: "6 hours ago",
      creator: "Prof. Kenji Nakamura",
      treasury: 4200000,
      governanceToken: "GRAPHENE",
      daoAddress: "0xgra1...2ene",
      leadResearcher: "Prof. Kenji Nakamura",
      researchField: "Materials Science",
      duration: "48 months",
      startDate: "2023-07-01",
      endDate: "2027-07-01",
      activeProposals: 2,
      completedMilestones: 4,
      totalMilestones: 9,
      collaborators: ["Samsung Research", "TSMC", "University of Tokyo", "National University of Singapore"],
      objectives: [
        "Develop large-scale graphene production methods",
        "Create graphene-based energy storage solutions",
        "Design next-generation electronic components",
        "Build graphene water filtration systems",
        "Launch commercial graphene applications"
      ]
    },
    proposals: [
      {
        id: "GRA-P-001",
        title: "Industrial Graphene Production Scale-up",
        description: "Establish pilot facility for large-scale graphene production using chemical vapor deposition",
        forVotes: "567,890 GRAPHENE",
        againstVotes: "89,120 GRAPHENE",
        quorum: "95%",
        timeRemaining: "4 days",
        proposer: "Dr. Chen Wei"
      }
    ],
    milestones: [
      {
        title: "Graphene Water Filter Prototype",
        description: "Complete development of graphene-based water filtration prototype",
        status: "Completed",
        fundingReleased: "$750K",
        completedDate: "2024-08-15"
      }
    ],
    publications: [
      {
        title: "Scalable Production of High-Quality Graphene for Industrial Applications",
        authors: ["Prof. Kenji Nakamura", "Dr. Chen Wei", "Prof. Li Zhang"],
        journal: "Nature Materials",
        publishedDate: "2024-09-25",
        citationCount: 234,
        openAccess: false,
        daoFunding: "89,000 GRAPHENE tokens",
        abstract: "Breakthrough method for large-scale production of high-quality graphene with industrial applications.",
        researchType: "Manufacturing Research",
        impactScore: "9.5",
        downloadCount: 8912,
        tags: ["Graphene", "Materials Science", "Manufacturing", "Nanotechnology"],
        doiLink: "https://doi.org/10.1038/nmat.2024.09025",
        ipfsHash: "QmGraphene123abc456def789ghi012jkl345mno678pqr",
        collaborators: ["Samsung Research", "TSMC", "University of Tokyo"]
      }
    ],
    courses: [
      {
        title: "Advanced Graphene Applications",
        provider: "ETH Nature Reserve",
        duration: "14 weeks",
        level: "Expert",
        price: "$4,200",
        rating: "4.8",
        students: 67,
        description: "Comprehensive course on graphene properties, production, and applications in electronics and energy.",
        skills: ["Graphene Science", "Nanomaterials", "Electronics", "Energy Storage"],
        relevance: "Essential for next-generation materials and electronics development"
      }
    ]
  },
  {
    dao: {
      id: "dao-11",
      name: "Educational Technology Innovation Network",
      description: "Blockchain-based credentialing and AI-powered personalized learning systems to democratize access to quality education worldwide.",
      category: "Educational Technology",
      status: "Active",
      memberCount: 445,
      fundingGoal: 2200000,
      fundingRaised: 1980000,
      location: "Global",
      tags: ["EdTech", "Blockchain Credentials", "AI Learning", "Digital Literacy"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      website: "https://edtech-innovation-dao.org",
      governanceModel: "Educator-led",
      votingMechanism: "Delegated Voting",
      tokenSymbol: "LEARN",
      proposalCount: 89,
      lastActivity: "45 minutes ago",
      creator: "Prof. Maria Santos",
      treasury: 2750000,
      governanceToken: "LEARN",
      daoAddress: "0xlea1...2rn9",
      leadResearcher: "Prof. Maria Santos",
      researchField: "Educational Technology",
      duration: "60 months",
      startDate: "2023-05-01",
      endDate: "2028-05-01",
      activeProposals: 5,
      completedMilestones: 3,
      totalMilestones: 12,
      collaborators: ["UNESCO", "Khan Academy", "MIT OpenCourseWare", "Coursera"],
      objectives: [
        "Develop blockchain-based credential verification",
        "Create AI-powered personalized learning paths",
        "Build global digital literacy programs",
        "Design inclusive educational technologies",
        "Launch open-source learning platform"
      ]
    },
    proposals: [
      {
        id: "LRN-P-001",
        title: "Global Digital Literacy Initiative",
        description: "Launch comprehensive digital literacy program for underserved communities worldwide",
        forVotes: "789,123 LEARN",
        againstVotes: "123,456 LEARN",
        quorum: "88%",
        timeRemaining: "7 days",
        proposer: "Dr. Amina Hassan"
      }
    ],
    milestones: [
      {
        title: "Blockchain Credential System",
        description: "Complete development of blockchain-based credential verification system",
        status: "Completed",
        fundingReleased: "$560K",
        completedDate: "2024-06-30"
      }
    ],
    publications: [
      {
        title: "Blockchain-Based Credentialing: Revolutionizing Educational Verification Systems",
        authors: ["Prof. Maria Santos", "Dr. Amina Hassan", "Prof. David Kim"],
        journal: "Computers & Education",
        publishedDate: "2024-08-20",
        citationCount: 178,
        openAccess: true,
        daoFunding: "67,000 LEARN tokens",
        abstract: "Comprehensive analysis of blockchain technology for educational credentialing and verification systems.",
        researchType: "Educational Technology Research",
        impactScore: "8.8",
        downloadCount: 7234,
        tags: ["Blockchain", "Education", "Credentialing", "Digital Verification"],
        doiLink: "https://doi.org/10.1016/ce.2024.08020",
        ipfsHash: "QmLearn890abc123def456ghi789jkl012mno345pqr678",
        collaborators: ["UNESCO", "MIT OpenCourseWare", "Khan Academy"]
      }
    ],
    courses: [
      {
        title: "Blockchain in Education",
        provider: "ETH Nature Reserve",
        duration: "10 weeks",
        level: "Intermediate",
        price: "$2,800",
        rating: "4.7",
        students: 156,
        description: "Introduction to blockchain applications in educational technology and credentialing systems.",
        skills: ["Blockchain Technology", "Educational Technology", "Digital Credentials", "Smart Contracts"],
        relevance: "Important for educators and technologists working on educational innovation"
      }
    ]
  }
];

export async function seedDAOData() {
  console.log('Starting DAO data seeding...');
  
  try {
    for (const { dao, proposals, milestones, publications, courses } of daoData) {
      // Insert DAO
      console.log(`Creating DAO: ${dao.name}`);
      const createdDAO = await storage.createResearchDAO(dao);
      
      // Insert proposals
      for (const proposal of proposals || []) {
        await storage.createDAOProposal({
          ...proposal,
          daoId: createdDAO.id
        });
      }
      
      // Insert milestones
      for (const milestone of milestones || []) {
        await storage.createDAOMilestone({
          ...milestone,
          daoId: createdDAO.id
        });
      }
      
      // Insert publications
      for (const publication of publications || []) {
        await storage.createDAOPublication({
          ...publication,
          daoId: createdDAO.id
        });
      }
      
      // Insert courses
      for (const course of courses || []) {
        await storage.createDAOCourse({
          ...course,
          daoId: createdDAO.id
        });
      }
      
      console.log(`✓ Completed seeding for ${dao.name}`);
    }
    
    console.log('✓ DAO data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding DAO data:', error);
    throw error;
  }
}

// Auto-run seeding
seedDAOData()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });