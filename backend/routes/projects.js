const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const { validateProjectData, validateAddress, validatePrivateKey } = require('../utils/validators');

// @route   GET /api/projects
// @desc    Get all projects or projects by user/sponsor
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { user, sponsor, limit = 50, offset = 0 } = req.query;

    let projects = [];

    if (user) {
      if (!validateAddress(user)) {
        return res.status(400).json({
          error: 'Invalid user address format'
        });
      }
      projects = await blockchainService.getUserProjects(user);
    } else if (sponsor) {
      if (!validateAddress(sponsor)) {
        return res.status(400).json({
          error: 'Invalid sponsor address format'
        });
      }
      projects = await blockchainService.getSponsoredProjects(sponsor);
    } else {
      // Get all projects (this would need pagination in production)
      const totalProjects = parseInt(await blockchainService.getTotalProjects());
      const startId = Math.max(1, totalProjects - parseInt(offset) - parseInt(limit) + 1);
      const endId = totalProjects - parseInt(offset);

      for (let i = Math.max(1, startId); i <= endId; i++) {
        try {
          const project = await blockchainService.getProject(i);
          projects.push(project);
        } catch (error) {
          // Skip non-existent projects
          console.warn(`Project ${i} not found:`, error.message);
        }
      }
    }

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get specific project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    const project = await blockchainService.getProject(id);

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    
    if (error.message.includes('Project does not exist')) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID ${req.params.id} does not exist`
      });
    }

    res.status(500).json({
      error: 'Failed to fetch project',
      message: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (requires private key in body)
router.post('/', async (req, res) => {
  try {
    const {
      privateKey,
      name,
      description,
      sponsor,
      milestones
    } = req.body;

    // Validation
    if (!validatePrivateKey(privateKey)) {
      return res.status(400).json({
        error: 'Invalid private key format'
      });
    }

    if (!validateAddress(sponsor)) {
      return res.status(400).json({
        error: 'Invalid sponsor address format'
      });
    }

    const validation = validateProjectData({
      name,
      description,
      sponsor,
      milestones
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid project data',
        details: validation.errors
      });
    }

    // Prepare milestone data
    const milestoneDescriptions = milestones.map(m => m.description);
    const milestoneAmounts = milestones.map(m => blockchainService.parseEther(m.amount));
    const milestoneDueDates = milestones.map(m => Math.floor(new Date(m.dueDate).getTime() / 1000));

    const projectData = {
      name,
      description,
      sponsor,
      milestoneDescriptions,
      milestoneAmounts,
      milestoneDueDates
    };

    const result = await blockchainService.createProject(privateKey, projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId: result.projectId,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Failed to create project',
      message: error.message
    });
  }
});

// @route   POST /api/projects/:id/deposit
// @desc    Deposit funds to a project
// @access  Private (requires private key in body)
router.post('/:id/deposit', async (req, res) => {
  try {
    const { id } = req.params;
    const { privateKey, amount } = req.body;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    if (!validatePrivateKey(privateKey)) {
      return res.status(400).json({
        error: 'Invalid private key format'
      });
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Must be a positive number'
      });
    }

    const result = await blockchainService.depositFunds(privateKey, id, amount);

    res.json({
      success: true,
      message: 'Funds deposited successfully',
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed,
      amountDeposited: result.amountDeposited
    });

  } catch (error) {
    console.error('Error depositing funds:', error);
    res.status(500).json({
      error: 'Failed to deposit funds',
      message: error.message
    });
  }
});

// @route   POST /api/projects/:id/milestones/:milestoneIndex/complete
// @desc    Mark milestone as completed
// @access  Private (requires private key in body)
router.post('/:id/milestones/:milestoneIndex/complete', async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { privateKey } = req.body;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    if (!milestoneIndex || isNaN(milestoneIndex) || parseInt(milestoneIndex) < 0) {
      return res.status(400).json({
        error: 'Invalid milestone index'
      });
    }

    if (!validatePrivateKey(privateKey)) {
      return res.status(400).json({
        error: 'Invalid private key format'
      });
    }

    const result = await blockchainService.completeMilestone(
      privateKey,
      id,
      parseInt(milestoneIndex)
    );

    res.json({
      success: true,
      message: 'Milestone marked as completed',
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({
      error: 'Failed to complete milestone',
      message: error.message
    });
  }
});

// @route   POST /api/projects/:id/milestones/:milestoneIndex/approve
// @desc    Approve milestone and release funds
// @access  Private (requires private key in body)
router.post('/:id/milestones/:milestoneIndex/approve', async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { privateKey } = req.body;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    if (!milestoneIndex || isNaN(milestoneIndex) || parseInt(milestoneIndex) < 0) {
      return res.status(400).json({
        error: 'Invalid milestone index'
      });
    }

    if (!validatePrivateKey(privateKey)) {
      return res.status(400).json({
        error: 'Invalid private key format'
      });
    }

    const result = await blockchainService.approveMilestone(
      privateKey,
      id,
      parseInt(milestoneIndex)
    );

    res.json({
      success: true,
      message: 'Milestone approved and funds released',
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error approving milestone:', error);
    res.status(500).json({
      error: 'Failed to approve milestone',
      message: error.message
    });
  }
});

// @route   GET /api/projects/stats
// @desc    Get overall project statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProjects = await blockchainService.getTotalProjects();
    const contractBalance = await blockchainService.getContractBalance();

    // Calculate additional stats by fetching recent projects
    let activeProjects = 0;
    let totalFunded = 0;
    let totalReleased = 0;

    const recentProjectCount = Math.min(parseInt(totalProjects), 50); // Limit for performance

    for (let i = Math.max(1, parseInt(totalProjects) - recentProjectCount + 1); i <= parseInt(totalProjects); i++) {
      try {
        const project = await blockchainService.getProject(i);
        if (project.active) activeProjects++;
        totalFunded += parseFloat(project.totalDeposited);
        totalReleased += parseFloat(project.totalReleased);
      } catch (error) {
        // Skip non-existent projects
        console.warn(`Project ${i} not found for stats`);
      }
    }

    res.json({
      success: true,
      stats: {
        totalProjects: parseInt(totalProjects),
        activeProjects,
        contractBalance: parseFloat(contractBalance),
        totalFunded: totalFunded.toFixed(4),
        totalReleased: totalReleased.toFixed(4),
        pendingFunds: (totalFunded - totalReleased).toFixed(4),
        averageFunding: totalProjects > 0 ? (totalFunded / parseInt(totalProjects)).toFixed(4) : '0'
      }
    });

  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      error: 'Failed to fetch project statistics',
      message: error.message
    });
  }
});

module.exports = router;
