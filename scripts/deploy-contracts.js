#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Bitcoin University Smart Contracts...\n');

// Check if contracts directory exists
const contractsDir = path.join(__dirname, '..', 'contracts');
if (!fs.existsSync(contractsDir)) {
  console.error('❌ Contracts directory not found!');
  process.exit(1);
}

// Change to contracts directory
process.chdir(contractsDir);

try {
  // Install contract dependencies
  console.log('📦 Installing contract dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Compile contracts
  console.log('\n🔨 Compiling contracts...');
  execSync('npx hardhat compile', { stdio: 'inherit' });
  
  // Start local hardhat node in background (non-blocking)
  console.log('\n🌐 Starting local Ethereum node...');
  const { spawn } = require('child_process');
  const nodeProcess = spawn('npx', ['hardhat', 'node'], {
    detached: true,
    stdio: 'pipe'
  });
  
  // Wait a moment for node to start
  console.log('⏳ Waiting for node to start...');
  await sleep(5000);
  
  // Deploy contracts
  console.log('\n🚀 Deploying contracts...');
  execSync('npx hardhat run scripts/deploy.js --network localhost', { stdio: 'inherit' });
  
  // Update contract addresses in frontend
  const deploymentPath = path.join(contractsDir, 'deployments', 'localhost.json');
  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    // Update frontend contract addresses
    const contractsFile = path.join(__dirname, '..', 'client', 'src', 'lib', 'contracts.ts');
    let contractsContent = fs.readFileSync(contractsFile, 'utf8');
    
    // Replace contract addresses
    contractsContent = contractsContent.replace(
      /daoFactory: "0x[a-fA-F0-9]{40}"/,
      `daoFactory: "${deployment.contracts.DAOFactory}"`
    );
    contractsContent = contractsContent.replace(
      /feeRouter: "0x[a-fA-F0-9]{40}"/,
      `feeRouter: "${deployment.contracts.BUFeeRouter}"`
    );
    
    fs.writeFileSync(contractsFile, contractsContent);
    
    console.log('\n✅ Smart contracts deployed successfully!');
    console.log('\n📋 Deployment Summary:');
    console.log(`   🏭 DAO Factory: ${deployment.contracts.DAOFactory}`);
    console.log(`   💰 Fee Router: ${deployment.contracts.BUFeeRouter}`);
    console.log(`   🌐 Network: Localhost (Chain ID: 1337)`);
    console.log(`   💰 Deployer: ${deployment.deployer}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Connect your wallet to the local network (localhost:8545)');
    console.log('   2. Import test accounts from Hardhat for testing');
    console.log('   3. Start creating research DAOs!');
    console.log('\n💡 Test Account Private Keys available in Hardhat console output above');
    
  } else {
    console.error('❌ Deployment file not found!');
  }
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

// Helper function for async operations
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}