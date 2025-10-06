const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Bitcoin University contract deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy Simple BU Fee Router first
  console.log("🏭 Deploying SimpleBUFeeRouter...");
  const SimpleBUFeeRouter = await ethers.getContractFactory("SimpleBUFeeRouter");
  const feeRouter = await SimpleBUFeeRouter.deploy();
  await feeRouter.waitForDeployment();
  const feeRouterAddress = await feeRouter.getAddress();
  console.log("✅ SimpleBUFeeRouter deployed to:", feeRouterAddress);

  // Deploy Simple DAO Factory
  console.log("\n🏭 Deploying SimpleDAOFactory...");
  const SimpleDAOFactory = await ethers.getContractFactory("SimpleDAOFactory");
  const daoFactory = await SimpleDAOFactory.deploy(feeRouterAddress);
  await daoFactory.waitForDeployment();
  const daoFactoryAddress = await daoFactory.getAddress();
  console.log("✅ SimpleDAOFactory deployed to:", daoFactoryAddress);

  // Set creation fee (0.01 ETH)
  console.log("\n⚙️ Setting creation fee...");
  const creationFee = ethers.parseEther("0.01");
  await feeRouter.setCreationFee(creationFee);
  console.log("✅ Creation fee set to 0.01 ETH");

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  const deployment = {
    network: "localhost",
    chainId: 1337,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      BUFeeRouter: feeRouterAddress,
      DAOFactory: daoFactoryAddress
    },
    fees: {
      creationFee: "0.01"
    }
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "localhost.json"),
    JSON.stringify(deployment, null, 2)
  );

  console.log("\n📄 Deployment info saved to deployments/localhost.json");
  console.log("\n🎯 Deployment Summary:");
  console.log("   🏭 DAO Factory:", daoFactoryAddress);
  console.log("   💰 Fee Router:", feeRouterAddress);
  console.log("   💸 Creation Fee: 0.01 ETH");
  console.log("   🌐 Network: Localhost (Chain ID: 1337)");
  console.log("   📍 Deployer:", deployer.address);
  
  console.log("\n🚀 Smart contracts deployed successfully!");
  console.log("\n📋 Next Steps:");
  console.log("   1. Update frontend contract addresses");
  console.log("   2. Connect MetaMask to localhost:8545");
  console.log("   3. Import test accounts for testing");
  console.log("   4. Start creating research DAOs!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });