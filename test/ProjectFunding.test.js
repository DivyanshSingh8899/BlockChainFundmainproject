const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectFunding Contract", function () {
  let ProjectFunding;
  let projectFunding;
  let owner;
  let creator;
  let sponsor;
  let addrs;

  const projectName = "Blockchain Development Project";
  const projectDescription = "Building a DeFi platform";
  const milestoneDescriptions = [
    "Project Setup and Planning",
    "Smart Contract Development", 
    "Frontend Development",
    "Testing and Deployment"
  ];
  const milestoneAmounts = [
    ethers.parseEther("1.0"),
    ethers.parseEther("2.0"),
    ethers.parseEther("1.5"),
    ethers.parseEther("0.5")
  ];
  
  // Set due dates 30, 60, 90, 120 days from now
  const now = Math.floor(Date.now() / 1000);
  const milestoneDueDates = [
    now + (30 * 24 * 60 * 60),
    now + (60 * 24 * 60 * 60),
    now + (90 * 24 * 60 * 60),
    now + (120 * 24 * 60 * 60)
  ];

  beforeEach(async function () {
    // Get signers
    [owner, creator, sponsor, ...addrs] = await ethers.getSigners();

    // Deploy contract
    ProjectFunding = await ethers.getContractFactory("ProjectFunding");
    projectFunding = await ProjectFunding.deploy();
    await projectFunding.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await projectFunding.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero projects", async function () {
      expect(await projectFunding.getTotalProjects()).to.equal(0);
    });
  });

  describe("Project Creation", function () {
    it("Should create a project successfully", async function () {
      const tx = await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );

      await expect(tx)
        .to.emit(projectFunding, "ProjectCreated")
        .withArgs(1, projectName, creator.address, sponsor.address, ethers.parseEther("5.0"));

      expect(await projectFunding.getTotalProjects()).to.equal(1);
    });

    it("Should fail with invalid sponsor address", async function () {
      await expect(
        projectFunding.connect(creator).createProject(
          projectName,
          projectDescription,
          ethers.ZeroAddress,
          milestoneDescriptions,
          milestoneAmounts,
          milestoneDueDates
        )
      ).to.be.revertedWith("Invalid sponsor address");
    });

    it("Should fail with mismatched arrays", async function () {
      await expect(
        projectFunding.connect(creator).createProject(
          projectName,
          projectDescription,
          sponsor.address,
          milestoneDescriptions,
          [ethers.parseEther("1.0")], // Wrong length
          milestoneDueDates
        )
      ).to.be.revertedWith("Milestone arrays length mismatch");
    });

    it("Should fail with zero milestones", async function () {
      await expect(
        projectFunding.connect(creator).createProject(
          projectName,
          projectDescription,
          sponsor.address,
          [],
          [],
          []
        )
      ).to.be.revertedWith("At least one milestone required");
    });

    it("Should calculate total budget correctly", async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );

      const project = await projectFunding.getProject(1);
      expect(project.totalBudget).to.equal(ethers.parseEther("5.0"));
    });
  });

  describe("Fund Deposits", function () {
    beforeEach(async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );
    });

    it("Should allow sponsor to deposit funds", async function () {
      const depositAmount = ethers.parseEther("2.0");
      
      const tx = await projectFunding.connect(sponsor).depositFunds(1, {
        value: depositAmount
      });

      await expect(tx)
        .to.emit(projectFunding, "FundsDeposited")
        .withArgs(1, sponsor.address, depositAmount, depositAmount);

      const project = await projectFunding.getProject(1);
      expect(project.totalDeposited).to.equal(depositAmount);
    });

    it("Should fail if non-sponsor tries to deposit", async function () {
      await expect(
        projectFunding.connect(creator).depositFunds(1, {
          value: ethers.parseEther("1.0")
        })
      ).to.be.revertedWith("Only project sponsor can call this");
    });

    it("Should fail if deposit exceeds total budget", async function () {
      await expect(
        projectFunding.connect(sponsor).depositFunds(1, {
          value: ethers.parseEther("6.0") // More than total budget of 5.0
        })
      ).to.be.revertedWith("Cannot deposit more than total budget");
    });

    it("Should fail with zero deposit", async function () {
      await expect(
        projectFunding.connect(sponsor).depositFunds(1, {
          value: 0
        })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });
  });

  describe("Milestone Management", function () {
    beforeEach(async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );

      // Deposit full funding
      await projectFunding.connect(sponsor).depositFunds(1, {
        value: ethers.parseEther("5.0")
      });
    });

    it("Should allow creator to complete milestone", async function () {
      const tx = await projectFunding.connect(creator).completeMilestone(1, 0);

      await expect(tx)
        .to.emit(projectFunding, "MilestoneCompleted")
        .withArgs(1, 0, milestoneDescriptions[0]);

      const milestone = await projectFunding.getMilestone(1, 0);
      expect(milestone.completed).to.be.true;
    });

    it("Should fail if non-creator tries to complete milestone", async function () {
      await expect(
        projectFunding.connect(sponsor).completeMilestone(1, 0)
      ).to.be.revertedWith("Only project creator can call this");
    });

    it("Should fail to complete milestones out of order", async function () {
      await expect(
        projectFunding.connect(creator).completeMilestone(1, 1)
      ).to.be.revertedWith("Must complete milestones in order");
    });

    it("Should allow sponsor to approve milestone and release funds", async function () {
      // Complete milestone first
      await projectFunding.connect(creator).completeMilestone(1, 0);

      const initialCreatorBalance = await ethers.provider.getBalance(creator.address);

      const tx = await projectFunding.connect(sponsor).approveMilestone(1, 0);

      await expect(tx)
        .to.emit(projectFunding, "MilestoneApproved")
        .withArgs(1, 0, milestoneAmounts[0])
        .and.to.emit(projectFunding, "FundsReleased")
        .withArgs(1, creator.address, milestoneAmounts[0], 0);

      const finalCreatorBalance = await ethers.provider.getBalance(creator.address);
      expect(finalCreatorBalance - initialCreatorBalance).to.equal(milestoneAmounts[0]);

      const project = await projectFunding.getProject(1);
      expect(project.totalReleased).to.equal(milestoneAmounts[0]);
      expect(project.currentMilestone).to.equal(1);
    });

    it("Should fail to approve uncompleted milestone", async function () {
      await expect(
        projectFunding.connect(sponsor).approveMilestone(1, 0)
      ).to.be.revertedWith("Milestone not completed yet");
    });

    it("Should fail if non-sponsor tries to approve milestone", async function () {
      await projectFunding.connect(creator).completeMilestone(1, 0);

      await expect(
        projectFunding.connect(creator).approveMilestone(1, 0)
      ).to.be.revertedWith("Only project sponsor can call this");
    });
  });

  describe("Project Completion", function () {
    beforeEach(async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );

      await projectFunding.connect(sponsor).depositFunds(1, {
        value: ethers.parseEther("5.0")
      });
    });

    it("Should complete project after all milestones are approved", async function () {
      // Complete and approve all milestones
      for (let i = 0; i < milestoneDescriptions.length; i++) {
        await projectFunding.connect(creator).completeMilestone(1, i);
        
        const tx = await projectFunding.connect(sponsor).approveMilestone(1, i);
        
        if (i === milestoneDescriptions.length - 1) {
          await expect(tx).to.emit(projectFunding, "ProjectCompleted").withArgs(1);
        }
      }

      const project = await projectFunding.getProject(1);
      expect(project.active).to.be.false;
      expect(project.totalReleased).to.equal(ethers.parseEther("5.0"));
    });
  });

  describe("Emergency Withdrawal", function () {
    beforeEach(async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );

      await projectFunding.connect(sponsor).depositFunds(1, {
        value: ethers.parseEther("3.0")
      });
    });

    it("Should allow sponsor to withdraw unused funds", async function () {
      const initialSponsorBalance = await ethers.provider.getBalance(sponsor.address);

      const tx = await projectFunding.connect(sponsor).emergencyWithdraw(1);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalSponsorBalance = await ethers.provider.getBalance(sponsor.address);
      const expectedBalance = initialSponsorBalance + ethers.parseEther("3.0") - gasUsed;

      expect(finalSponsorBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.01"));

      const project = await projectFunding.getProject(1);
      expect(project.active).to.be.false;
    });

    it("Should fail if non-sponsor tries emergency withdrawal", async function () {
      await expect(
        projectFunding.connect(creator).emergencyWithdraw(1)
      ).to.be.revertedWith("Only project sponsor can call this");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await projectFunding.connect(creator).createProject(
        projectName,
        projectDescription,
        sponsor.address,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      );
    });

    it("Should return correct project details", async function () {
      const project = await projectFunding.getProject(1);
      
      expect(project.name).to.equal(projectName);
      expect(project.creator).to.equal(creator.address);
      expect(project.sponsor).to.equal(sponsor.address);
      expect(project.totalBudget).to.equal(ethers.parseEther("5.0"));
      expect(project.active).to.be.true;
    });

    it("Should return project milestones", async function () {
      const milestones = await projectFunding.getProjectMilestones(1);
      
      expect(milestones.length).to.equal(4);
      expect(milestones[0].description).to.equal(milestoneDescriptions[0]);
      expect(milestones[0].amount).to.equal(milestoneAmounts[0]);
    });

    it("Should return user projects", async function () {
      const userProjects = await projectFunding.getUserProjects(creator.address);
      expect(userProjects.length).to.equal(1);
      expect(userProjects[0]).to.equal(1);
    });

    it("Should return sponsored projects", async function () {
      const sponsoredProjects = await projectFunding.getSponsoredProjects(sponsor.address);
      expect(sponsoredProjects.length).to.equal(1);
      expect(sponsoredProjects[0]).to.equal(1);
    });
  });
});
