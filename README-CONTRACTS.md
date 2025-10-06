# Bitcoin University Smart Contracts

This directory contains the smart contracts for the Bitcoin University Research DAO platform.

## Quick Start

### 1. Deploy Contracts Locally

```bash
# Run the automated deployment script
node scripts/deploy-contracts.js
```

This will:
- Install dependencies
- Compile contracts  
- Start a local Hardhat node
- Deploy all contracts
- Update frontend with contract addresses

### 2. Manual Deployment

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Start local node (in a new terminal)
npx hardhat node

# Deploy contracts (in original terminal)
npx hardhat run scripts/deploy.js --network localhost
```

## Contract Architecture

### Core Contracts

1. **DAOFactory.sol** - Main factory for creating research DAOs
   - Creates new ResearchDAO instances
   - Manages creation fees
   - Tracks all deployed DAOs

2. **ResearchDAO.sol** - Individual research DAO contract
   - ERC20 governance token
   - Proposal system with voting
   - Treasury management
   - Milestone tracking

3. **BUFeeRouter.sol** - Fee management system
   - Collects 1% platform fees
   - Manages creation fees
   - Revenue distribution

## Testing with MetaMask

1. **Add Local Network**
   - Network Name: Localhost 8545
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

2. **Import Test Account**
   Use any of the private keys from the Hardhat node output

3. **Test DAO Creation**
   - Connect wallet on the frontend
   - Fill out DAO creation form
   - Confirm transaction (costs 0.01 ETH + gas)

## Contract Addresses

After deployment, addresses are saved to `deployments/localhost.json` and automatically updated in the frontend.

## Development

```bash
# Run tests
npm test

# Deploy to other networks
npx hardhat run scripts/deploy.js --network <network-name>

# Verify contracts (for public networks)
npx hardhat verify --network <network> <contract-address>
```

## Features

- **Template-based DAO Creation**: Choose from research area templates
- **Governance Tokens**: ERC20 tokens for voting
- **Proposal System**: Submit and vote on research proposals
- **Treasury Management**: Secure fund management
- **Milestone Tracking**: Track research progress
- **Fee Collection**: 1% platform fee system

## Security

- Uses OpenZeppelin security standards
- Reentrancy protection
- Access control mechanisms
- Comprehensive testing coverage