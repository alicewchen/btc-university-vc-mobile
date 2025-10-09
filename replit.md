# Ethereum Nature Reserve - Web3 R&D Marketplace

## Overview

Ethereum Nature Reserve is a "Research-Institution-as-a-Service" dApp, functioning as a Web3 research and development marketplace. It connects scientists, funders, students, and Indigenous communities for blockchain research, centered around a global network of protected conservation sites. The platform promotes open education, scientific research, and provides access to Indigenous communities connected to the lands. The application is a full-stack modern web application with a React frontend, Express backend, PostgreSQL database, and smart contract integration. Its vision is to foster breakthroughs in conservation technology, decentralized science, and Indigenous knowledge systems, creating a global hub for collaborative, impactful research.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Web Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Framework**: Shadcn/ui (built on Radix UI)
- **Styling**: TailwindCSS with custom CSS variables
- **State Management**: TanStack Query for server state, Zustand for local state
- **Icons**: Lucide React

### Mobile App Architecture
- **Framework**: React Native with TypeScript via Expo SDK 52
- **Platform**: iOS, Android, and Web (cross-platform)
- **Navigation**: React Navigation v7 (Stack + Bottom Tabs)
- **UI Framework**: React Native Paper with custom theming
- **State Management**: TanStack Query for server state
- **API Client**: Shared Express backend via REST API
- **Web3**: WalletConnect for mobile wallet integration (planned)
- **Location**: Separate standalone app in `mobile/` directory

### Mobile App Configuration

#### Environment Setup (Required for Physical Devices)
The mobile app requires the `EXPO_PUBLIC_API_URL` environment variable to connect to the backend:

1. **Create `.env` file** in the `mobile/` directory:
   ```bash
   cd mobile
   cp .env.example .env
   ```

2. **Set the API URL** based on your environment:
   - **Replit Development**: Use your Replit dev URL
     ```
     EXPO_PUBLIC_API_URL=https://your-project-name.replit.dev
     ```
   - **Local Network**: Use your machine's IP address
     ```
     EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
     ```

3. **Development Modes**:
   - **Expo Go**: Auto-detects host IP (no env var required)
   - **Dev-Client/Physical Devices**: REQUIRES `EXPO_PUBLIC_API_URL` (enforced at runtime)

4. **Production Deployment**:
   - Set `EXPO_PUBLIC_API_URL` in EAS Build secrets or CI/CD environment
   - Example: `eas secret:create --name EXPO_PUBLIC_API_URL --value https://api.yourapp.com`

#### Runtime Behavior
- Throws clear error at startup if `EXPO_PUBLIC_API_URL` is missing outside Expo Go
- Prevents silent networking failures on physical devices
- Logs which API URL detection method was used for debugging

### Backend Architecture (Shared)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development Server**: Custom Vite integration for SSR-like development
- **CORS**: Configured to accept requests from both web and mobile apps

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe queries
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Key Components
- **DAO Profile System**: Comprehensive profiles with a 6-tab interface (Overview, Governance, Milestones, Publications, Courses, Community), including governance data, milestone tracking, IPFS-stored publications, course integration, and community management.
- **Page Structure**: Multi-page architecture including Home, Research Programs (with AI-powered search), DAO Detail Pages, Research Funding, Course Offerings, Research Facilities, Nature Reserve, Campuses, and Publications.
- **UI Components**: Comprehensive design system using Shadcn/ui, responsive navigation, custom theming (orange, black, white, grey), dark mode support, and accessible elements.
- **Web3 Integration (Planned)**: Wallet connection via Thirdweb SDK, Solidity smart contracts with 1% platform fee, BUFeeRouter.sol for fee management, and IPFS for decentralized storage.

### Data Flow
- **Client-Server Communication**: REST API via `/api` endpoints, TanStack Query for centralized query client, type-safe requests, and error handling.
- **Database Operations**: Abstract storage interface supporting multiple implementations, currently in-memory for development, production-ready with PostgreSQL.
- **State Management**: Server state via TanStack Query, local UI state via React hooks, global state with Zustand, and form state via React Hook Form with Zod.

## External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing library
- **@radix-ui/***: Accessible UI component primitives
- **ethers.js**: Ethereum blockchain interaction library
- **Hardhat**: Development framework for Ethereum smart contracts
- **@openzeppelin/contracts**: Security-audited smart contract library
- **Perplexity AI**: For DAO discovery chat system

## Smart Contract System

### Deployed Contracts (Local Testing)
- **SimpleDAOFactory**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **SimpleBUFeeRouter**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Local Network**: Chain ID 1337, RPC: http://localhost:8545
- **Creation Fee**: 0.01 ETH per DAO

### Contract Features
- **On-chain DAO Creation**: Real smart contract deployment via factory pattern
- **Governance Tokens**: ERC20-compatible tokens for DAO voting
- **Treasury Management**: Secure fund management and distribution
- **Proposal System**: Create and vote on research proposals
- **Member Management**: Join DAOs and track participation
- **Fee Collection**: Platform fee system for sustainability

## Recent Changes (October 2025)

### Mobile App Implementation Completed
- ✅ **React Native mobile app**: Separate Expo app in `mobile/` directory
- ✅ **Cross-platform support**: iOS, Android, and Web via Expo SDK 52
- ✅ **Navigation system**: React Navigation v7 with bottom tabs (Home, Explore, Create, Wallet)
- ✅ **API integration**: Shared Express backend with TanStack Query
- ✅ **Environment-based configuration**: EXPO_PUBLIC_API_URL with runtime validation
- ✅ **Core screens implemented**: Browse DAOs, DAO details, Create DAO, Wallet placeholder
- ✅ **Production-ready**: Fail-fast validation prevents API misconfiguration

### Smart Contract Integration Completed (August 2025)
- ✅ **Full smart contract system implemented**: ResearchDAO.sol, DAOFactory.sol, BUFeeRouter.sol
- ✅ **Simplified contracts for testing**: SimpleBUFeeRouter.sol, SimpleDAOFactory.sol, SimpleResearchDAO.sol 
- ✅ **Hardhat development environment**: Configured with deployment scripts and local node
- ✅ **Frontend Web3 integration**: Contract service with ethers.js and multi-chain wallet support
- ✅ **Real on-chain deployment**: CreateResearchDAO page now deploys actual smart contracts
- ✅ **Testing infrastructure**: Local blockchain with deployed contracts ready for testing