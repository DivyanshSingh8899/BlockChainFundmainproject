const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of ProjectFunding contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("📄 Deploying ProjectFunding contract...");
  const ProjectFunding = await hre.ethers.getContractFactory("ProjectFunding");
  const projectFunding = await ProjectFunding.deploy();
  
  await projectFunding.waitForDeployment();
  const contractAddress = await projectFunding.getAddress();
  
  console.log("✅ ProjectFunding deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", projectFunding.deploymentTransaction().hash);
  
  // Verify contract if on testnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await projectFunding.deploymentTransaction().wait(6);
    
    try {
      console.log("🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentHash: projectFunding.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    blockNumber: projectFunding.deploymentTransaction().blockNumber
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n📁 Deployment info saved to: ${deploymentFile}`);

  // Create ABI file for frontend
  const artifactsPath = path.join(__dirname, "..", "artifacts", "contracts", "ProjectFunding.sol", "ProjectFunding.json");
  const artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  
  const abiDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }
  
  const abiFile = path.join(abiDir, "ProjectFunding.json");
  const contractData = {
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    contractAddress: contractAddress,
    network: hre.network.name
  };
  
  fs.writeFileSync(abiFile, JSON.stringify(contractData, null, 2));
  console.log(`📄 Contract ABI saved to: ${abiFile}`);

  // Display summary
  console.log("\n" + "=".repeat(50));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(50));
  console.log("📋 Summary:");
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Contract: ${contractAddress}`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Gas Used: ${projectFunding.deploymentTransaction().gasLimit}`);
  console.log("=".repeat(50));
  
  // Show next steps
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the contract address:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   REACT_APP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Start the backend server:");
  console.log("   cd backend && npm install && npm start");
  console.log("\n3. Start the frontend application:");
  console.log("   cd frontend && npm install && npm start");
  
  return {
    contractAddress,
    deployer: deployer.address,
    network: hre.network.name
  };
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;
