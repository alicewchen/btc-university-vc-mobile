# Bitcoin University - Smart Contract Testing Guide

## 🚀 Quick Start Testing

Your smart contracts are deployed and ready for testing! Here's how to test the complete DAO creation functionality:

### 1. Blockchain Network Setup

✅ **Local Hardhat Network is RUNNING**
- Network: http://localhost:8545
- Chain ID: 1337
- Deployed Contracts:
  - SimpleDAOFactory: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
  - SimpleBUFeeRouter: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 2. MetaMask Configuration

Add the local network to MetaMask:
1. Open MetaMask → Networks → Add Network
2. Enter these details:
   - **Network Name**: Local Hardhat
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

### 3. Import Test Account

Use any of these Hardhat test accounts (each has 10,000 ETH):

**Account #0 (Deployer)**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account #2**
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

### 4. Testing DAO Creation

1. **Navigate to Create DAO Page**
   - Go to http://localhost:5000/create-research-dao
   
2. **Connect Wallet**
   - Click wallet connection
   - Select MetaMask 
   - Switch to Local Hardhat network if prompted
   
3. **Create a Research DAO**
   - Choose a template (e.g., "Conservation Technology DAO")
   - Fill out the form:
     - DAO Name: "Test Ocean Research DAO"
     - Description: "Testing blockchain-based ocean research"
     - Research Area: "Marine Conservation"
   
4. **Deploy Contract**
   - Click "Deploy DAO (0.01 ETH)"
   - Confirm the transaction in MetaMask
   - Wait for deployment confirmation

### 5. Verify Deployment

After successful deployment:
- ✅ You should see a success message with the DAO contract address
- ✅ Check MetaMask for the transaction (0.01 ETH fee + gas)
- ✅ The new DAO contract is deployed to the blockchain

### 6. Test DAO Functions

Once deployed, you can:
- Join the DAO as a member
- Create research proposals
- Fund the DAO treasury
- Vote on proposals

### 7. Troubleshooting

**Common Issues:**
- **"Insufficient funds"**: Make sure you imported a test account with ETH
- **"Wrong network"**: Switch MetaMask to Local Hardhat (Chain ID 1337)
- **"Transaction failed"**: Check if the Hardhat node is still running

**Reset if needed:**
```bash
# Restart the blockchain (this will reset all state)
cd contracts
npx hardhat node --port 8545
```

### 8. Production Deployment

For mainnet/testnet deployment:
1. Update `hardhat.config.js` with your network settings
2. Set up environment variables for private keys
3. Deploy with: `npx hardhat run scripts/deploy.js --network <network>`
4. Update frontend contract addresses

## 🎯 Success Criteria

Your testing is successful when you can:
- ✅ Connect wallet to local network
- ✅ Create a new research DAO on-chain
- ✅ Pay the 0.01 ETH creation fee
- ✅ Receive deployment confirmation with contract address
- ✅ View the DAO in your wallet's transaction history

Ready to revolutionize scientific research with blockchain technology!