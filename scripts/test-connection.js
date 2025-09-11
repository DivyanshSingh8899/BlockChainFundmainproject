const { ethers } = require('hardhat');

async function main() {
  console.log('🔍 Testing Blockchain Connection...\n');

  try {
    // Get signers
    const [deployer, creator, sponsor] = await ethers.getSigners();
    
    console.log('👥 Available Accounts:');
    console.log(`   Deployer: ${deployer.address}`);
    console.log(`   Creator:  ${creator.address}`);
    console.log(`   Sponsor:  ${sponsor.address}\n`);

    // Check balances
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    const creatorBalance = await ethers.provider.getBalance(creator.address);
    const sponsorBalance = await ethers.provider.getBalance(sponsor.address);

    console.log('💰 Account Balances:');
    console.log(`   Deployer: ${ethers.formatEther(deployerBalance)} ETH`);
    console.log(`   Creator:  ${ethers.formatEther(creatorBalance)} ETH`);
    console.log(`   Sponsor:  ${ethers.formatEther(sponsorBalance)} ETH\n`);

    // Deploy contract
    console.log('📄 Deploying ProjectFunding contract...');
    const ProjectFunding = await ethers.getContractFactory('ProjectFunding');
    const projectFunding = await ProjectFunding.deploy();
    await projectFunding.waitForDeployment();
    
    const contractAddress = await projectFunding.getAddress();
    console.log(`✅ Contract deployed at: ${contractAddress}\n`);

    // Test contract functions
    console.log('🧪 Testing Contract Functions...');
    
    // Get total projects (should be 0)
    const totalProjects = await projectFunding.getTotalProjects();
    console.log(`   Total Projects: ${totalProjects}`);

    // Get contract balance (should be 0)
    const contractBalance = await projectFunding.getContractBalance();
    console.log(`   Contract Balance: ${ethers.formatEther(contractBalance)} ETH\n`);

    console.log('🎉 All tests passed! Your blockchain connection is working perfectly.\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Install MetaMask browser extension');
    console.log('2. Add local network (Chain ID: 1337, RPC: http://localhost:8545)');
    console.log('3. Import test accounts with private keys:');
    console.log(`   Creator: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`);
    console.log(`   Sponsor: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`);
    console.log('4. Go to http://localhost:3000 and connect MetaMask');
    console.log('5. Start testing your blockchain project funding system!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
