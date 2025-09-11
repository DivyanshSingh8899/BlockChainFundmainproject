const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

/**
 * Demo script for Blockchain Project Funding System
 * This script demonstrates the complete workflow of the system
 */

async function main() {
  console.log('🚀 Starting Blockchain Project Funding Demo...\n');

  // Get signers (simulating different users)
  const [deployer, creator, sponsor] = await ethers.getSigners();
  
  console.log('👥 Demo Participants:');
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Creator:  ${creator.address}`);
  console.log(`   Sponsor:  ${sponsor.address}\n`);

  // Deploy the contract
  console.log('📄 Deploying ProjectFunding contract...');
  const ProjectFunding = await ethers.getContractFactory('ProjectFunding');
  const projectFunding = await ProjectFunding.deploy();
  await projectFunding.waitForDeployment();
  
  const contractAddress = await projectFunding.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}\n`);

  // Demo project data
  const projectData = {
    name: 'Blockchain E-Learning Platform',
    description: 'A comprehensive e-learning platform built on blockchain technology with smart contracts for course completion verification and certificate issuance.',
    sponsor: sponsor.address,
    milestoneDescriptions: [
      'Project Setup and Architecture Design',
      'Smart Contract Development and Testing',
      'Frontend Development with React',
      'Backend API Development',
      'Integration and Testing',
      'Deployment and Documentation'
    ],
    milestoneAmounts: [
      ethers.parseEther('0.5'),   // 0.5 ETH
      ethers.parseEther('1.0'),   // 1.0 ETH
      ethers.parseEther('1.5'),   // 1.5 ETH
      ethers.parseEther('1.0'),   // 1.0 ETH
      ethers.parseEther('0.8'),   // 0.8 ETH
      ethers.parseEther('0.2')    // 0.2 ETH
    ],
    milestoneDueDates: [
      Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),   // 7 days
      Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60),  // 14 days
      Math.floor(Date.now() / 1000) + (28 * 24 * 60 * 60),  // 28 days
      Math.floor(Date.now() / 1000) + (42 * 24 * 60 * 60),  // 42 days
      Math.floor(Date.now() / 1000) + (56 * 24 * 60 * 60),  // 56 days
      Math.floor(Date.now() / 1000) + (70 * 24 * 60 * 60)   // 70 days
    ]
  };

  const totalBudget = projectData.milestoneAmounts.reduce((sum, amount) => sum + amount, 0n);
  console.log(`💰 Total Project Budget: ${ethers.formatEther(totalBudget)} ETH\n`);

  // Step 1: Create Project
  console.log('📝 Step 1: Creating project...');
  const createTx = await projectFunding.connect(creator).createProject(
    projectData.name,
    projectData.description,
    projectData.sponsor,
    projectData.milestoneDescriptions,
    projectData.milestoneAmounts,
    projectData.milestoneDueDates
  );
  
  const createReceipt = await createTx.wait();
  const projectCreatedEvent = createReceipt.logs.find(log => {
    try {
      const parsedLog = projectFunding.interface.parseLog(log);
      return parsedLog.name === 'ProjectCreated';
    } catch {
      return false;
    }
  });
  
  const projectId = projectFunding.interface.parseLog(projectCreatedEvent).args[0];
  console.log(`✅ Project created with ID: ${projectId}`);
  console.log(`   Transaction: ${createTx.hash}\n`);

  // Step 2: Sponsor deposits funds
  console.log('💳 Step 2: Sponsor depositing funds...');
  const depositTx = await projectFunding.connect(sponsor).depositFunds(projectId, {
    value: totalBudget
  });
  await depositTx.wait();
  console.log(`✅ Funds deposited: ${ethers.formatEther(totalBudget)} ETH`);
  console.log(`   Transaction: ${depositTx.hash}\n`);

  // Step 3: Display initial project state
  console.log('📊 Step 3: Initial project state...');
  const initialProject = await projectFunding.getProject(projectId);
  console.log(`   Name: ${initialProject.name}`);
  console.log(`   Creator: ${initialProject.creator}`);
  console.log(`   Sponsor: ${initialProject.sponsor}`);
  console.log(`   Total Budget: ${ethers.formatEther(initialProject.totalBudget)} ETH`);
  console.log(`   Total Deposited: ${ethers.formatEther(initialProject.totalDeposited)} ETH`);
  console.log(`   Total Released: ${ethers.formatEther(initialProject.totalReleased)} ETH`);
  console.log(`   Current Milestone: ${initialProject.currentMilestone}`);
  console.log(`   Active: ${initialProject.active}\n`);

  // Step 4: Demonstrate milestone workflow
  console.log('🎯 Step 4: Demonstrating milestone workflow...\n');
  
  for (let i = 0; i < 3; i++) { // Complete first 3 milestones
    console.log(`   Milestone ${i + 1}: ${projectData.milestoneDescriptions[i]}`);
    
    // Creator completes milestone
    console.log(`   📋 Creator marking milestone ${i + 1} as completed...`);
    const completeTx = await projectFunding.connect(creator).completeMilestone(projectId, i);
    await completeTx.wait();
    console.log(`   ✅ Milestone ${i + 1} completed`);
    console.log(`      Transaction: ${completeTx.hash}`);
    
    // Sponsor approves milestone and releases funds
    console.log(`   💰 Sponsor approving milestone ${i + 1} and releasing funds...`);
    const approveTx = await projectFunding.connect(sponsor).approveMilestone(projectId, i);
    await approveTx.wait();
    console.log(`   ✅ Milestone ${i + 1} approved and funds released`);
    console.log(`      Amount: ${ethers.formatEther(projectData.milestoneAmounts[i])} ETH`);
    console.log(`      Transaction: ${approveTx.hash}\n`);
  }

  // Step 5: Display final project state
  console.log('📊 Step 5: Final project state...');
  const finalProject = await projectFunding.getProject(projectId);
  console.log(`   Total Released: ${ethers.formatEther(finalProject.totalReleased)} ETH`);
  console.log(`   Current Milestone: ${finalProject.currentMilestone}`);
  console.log(`   Active: ${finalProject.active}\n`);

  // Step 6: Display milestone details
  console.log('📋 Step 6: Milestone details...');
  const milestones = await projectFunding.getProjectMilestones(projectId);
  milestones.forEach((milestone, index) => {
    console.log(`   Milestone ${index + 1}:`);
    console.log(`      Description: ${milestone.description}`);
    console.log(`      Amount: ${ethers.formatEther(milestone.amount)} ETH`);
    console.log(`      Completed: ${milestone.completed}`);
    console.log(`      Approved: ${milestone.approved}`);
    console.log(`      Paid: ${milestone.paid}`);
    console.log(`      Due Date: ${new Date(Number(milestone.dueDate) * 1000).toLocaleDateString()}\n`);
  });

  // Step 7: Contract statistics
  console.log('📈 Step 7: Contract statistics...');
  const totalProjects = await projectFunding.getTotalProjects();
  const contractBalance = await projectFunding.getContractBalance();
  console.log(`   Total Projects: ${totalProjects}`);
  console.log(`   Contract Balance: ${ethers.formatEther(contractBalance)} ETH\n`);

  // Save demo results
  const demoResults = {
    contractAddress,
    projectId: projectId.toString(),
    participants: {
      deployer: deployer.address,
      creator: creator.address,
      sponsor: sponsor.address
    },
    projectData: {
      name: projectData.name,
      description: projectData.description,
      totalBudget: ethers.formatEther(totalBudget),
      milestones: projectData.milestoneDescriptions.length
    },
    transactions: {
      create: createTx.hash,
      deposit: depositTx.hash
    },
    finalState: {
      totalReleased: ethers.formatEther(finalProject.totalReleased),
      currentMilestone: finalProject.currentMilestone.toString(),
      active: finalProject.active
    }
  };

  const resultsPath = path.join(__dirname, '..', 'demo-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(demoResults, null, 2));
  console.log(`💾 Demo results saved to: ${resultsPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('🎉 DEMO COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60));
  console.log('📋 Summary:');
  console.log(`   ✅ Contract deployed at: ${contractAddress}`);
  console.log(`   ✅ Project created with ID: ${projectId}`);
  console.log(`   ✅ ${ethers.formatEther(totalBudget)} ETH deposited`);
  console.log(`   ✅ 3 milestones completed and funded`);
  console.log(`   ✅ ${ethers.formatEther(finalProject.totalReleased)} ETH released`);
  console.log('='.repeat(60));
  
  console.log('\n📝 Next Steps:');
  console.log('1. Update your .env file with the contract address:');
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   REACT_APP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log('\n2. Start the backend server:');
  console.log('   cd backend && npm install && npm start');
  console.log('\n3. Start the frontend application:');
  console.log('   cd frontend && npm install && npm start');
  console.log('\n4. Open http://localhost:3000 in your browser');
  console.log('\n5. Connect MetaMask and use the demo addresses:');
  console.log(`   Creator: ${creator.address}`);
  console.log(`   Sponsor: ${sponsor.address}`);
}

// Execute demo
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Demo failed:', error);
      process.exit(1);
    });
}

module.exports = main;
