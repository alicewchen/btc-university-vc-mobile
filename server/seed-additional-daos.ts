import { storage } from "./storage";

// Only the 5 new DAOs to be added
const additionalDAOData = [
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

export async function seedAdditionalDAOs() {
  console.log('Starting additional DAO data seeding...');
  
  try {
    for (const { dao, proposals, milestones, publications, courses } of additionalDAOData) {
      console.log(`Creating DAO: ${dao.name}`);
      
      // Check if DAO already exists
      try {
        const existingDAO = await storage.getResearchDAO(dao.id);
        if (existingDAO) {
          console.log(`⚠️  DAO ${dao.name} already exists, skipping...`);
          continue;
        }
      } catch (error) {
        // DAO doesn't exist, proceed with creation
      }
      
      // Insert DAO
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
      
      console.log(`✅ Completed seeding for ${dao.name}`);
    }
    
    console.log('✅ Additional DAO data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding additional DAO data:', error);
    throw error;
  }
}

// Auto-run seeding
seedAdditionalDAOs()
  .then(() => {
    console.log('Additional seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Additional seeding failed:', error);
    process.exit(1);
  });