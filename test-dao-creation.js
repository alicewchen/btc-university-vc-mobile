#!/usr/bin/env node
/**
 * Quick test script for Bitcoin University DAO creation
 * This script tests the smart contract functionality
 */

import { ethers } from 'ethers';

// Contract addresses and ABIs
const DAO_FACTORY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const FEE_ROUTER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const DAO_FACTORY_ABI = [
  "function createResearchDAO(string memory _tokenName, string memory _tokenSymbol, string memory _daoName, string memory _description, string memory _researchFocus, uint256 _initialSupply, uint256 _proposalThreshold, uint256 _votingDuration, uint256 _quorumPercentage) external payable returns (address)",
  "function isNameAvailable(string memory _name) external view returns (bool)",
  "function getDeployedDAOs() external view returns (address[] memory)",
  "function creationFee() external view returns (uint256)"
];

const RESEARCH_DAO_ABI = [
  "function getDAOInfo() external view returns (string memory, string memory, string memory, string memory, string memory, uint256, uint256, uint256, uint256, uint256, uint256[] memory, uint256[] memory, uint256, address[] memory)"
];

async function testDAOCreation() {
  try {
    console.log('🧪 Testing Bitcoin University DAO Creation...\n');
    
    // Connect to local network
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // Use test account from environment variable or default to first hardhat account
    const privateKey = process.env.TEST_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log('🔑 Using test account:', wallet.address);
    
    // Connect to factory contract
    const factory = new ethers.Contract(DAO_FACTORY_ADDRESS, DAO_FACTORY_ABI, wallet);
    
    // Check creation fee
    const creationFee = await factory.creationFee();
    console.log('💰 Creation fee:', ethers.formatEther(creationFee), 'ETH');
    
    // Check if name is available
    const testName = 'Ocean Research DAO Test';
    const isAvailable = await factory.isNameAvailable(testName);
    console.log('🔍 Name available:', isAvailable);
    
    if (!isAvailable) {
      console.log('❌ DAO name already exists, trying a different name...');
      const timestamp = Date.now();
      testName = `Ocean Research DAO ${timestamp}`;
    }
    
    // Create DAO parameters
    const daoParams = {
      tokenName: 'Ocean Research Token',
      tokenSymbol: 'ORT',
      daoName: testName,
      description: 'A test DAO for ocean research and conservation',
      researchFocus: 'Marine Conservation Technology',
      initialSupply: '1000000',
      proposalThreshold: '1000', 
      votingDuration: '7',
      quorumPercentage: '10'
    };
    
    console.log('\n🚀 Creating DAO with parameters:');
    console.log('   Name:', daoParams.daoName);
    console.log('   Token:', daoParams.tokenName, '(' + daoParams.tokenSymbol + ')');
    console.log('   Focus:', daoParams.researchFocus);
    
    // Create the DAO
    const tx = await factory.createResearchDAO(
      daoParams.tokenName,
      daoParams.tokenSymbol,
      daoParams.daoName,
      daoParams.description,
      daoParams.researchFocus,
      ethers.parseEther(daoParams.initialSupply),
      ethers.parseEther(daoParams.proposalThreshold),
      parseInt(daoParams.votingDuration),
      parseInt(daoParams.quorumPercentage),
      { value: creationFee }
    );
    
    console.log('\n⏳ Transaction submitted:', tx.hash);
    console.log('   Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    
    // Get the deployed DAO address from events
    const event = receipt.logs.find(log => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed.name === 'DAOCreated';
      } catch (e) {
        return false;
      }
    });
    
    if (event) {
      const daoAddress = factory.interface.parseLog(event).args[0];
      console.log('🎉 DAO deployed successfully!');
      console.log('   DAO Address:', daoAddress);
      
      // Test reading DAO info
      const dao = new ethers.Contract(daoAddress, RESEARCH_DAO_ABI, wallet);
      const daoInfo = await dao.getDAOInfo();
      
      console.log('\n📊 DAO Information:');
      console.log('   Token Name:', daoInfo[0]);
      console.log('   Token Symbol:', daoInfo[1]);
      console.log('   DAO Name:', daoInfo[2]);
      console.log('   Total Supply:', ethers.formatEther(daoInfo[5]), 'tokens');
      console.log('   Treasury Balance:', ethers.formatEther(daoInfo[9]), 'ETH');
      console.log('   Member Count:', daoInfo[12].toString());
      
    } else {
      console.log('❌ Could not find DAO creation event');
    }
    
    // Check total DAOs deployed
    const deployedDAOs = await factory.getDeployedDAOs();
    console.log('\n📈 Total DAOs deployed:', deployedDAOs.length);
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n🌐 Frontend Testing:');
    console.log('   1. Add Local Hardhat network to MetaMask (localhost:8545, Chain ID: 1337)');
    console.log('   2. Import test account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log('   3. Visit: http://localhost:5000/create-research-dao');
    console.log('   4. Connect wallet and create a DAO through the UI');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'NETWORK_ERROR') {
      console.log('💡 Make sure Hardhat node is running on localhost:8545');
    }
  }
}

// Run the test
testDAOCreation();