import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Use the same demo data structure as in Projects.js
        const mockProjects = [
          {
            id: '1',
            name: 'Blockchain E-Learning Platform',
            description: 'A comprehensive e-learning platform built on blockchain technology with smart contracts for course management, student verification, and automated certification.',
            creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            sponsor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            totalBudget: '15.5',
            totalDeposited: '15.5',
            totalReleased: '15.5',
            currentMilestone: '5',
            active: false,
            createdAt: '2024-08-14T10:00:00Z',
            milestones: [
              {
                index: 0,
                description: 'Smart Contract Development',
                amount: '3.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-09-01T00:00:00Z'
              },
              {
                index: 1,
                description: 'Frontend Development',
                amount: '4.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-09-15T00:00:00Z'
              },
              {
                index: 2,
                description: 'Backend Integration',
                amount: '3.5',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-10-01T00:00:00Z'
              },
              {
                index: 3,
                description: 'Testing & Security Audit',
                amount: '2.5',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-10-15T00:00:00Z'
              },
              {
                index: 4,
                description: 'Launch & Documentation',
                amount: '2.5',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-11-01T00:00:00Z'
              }
            ]
          },
          {
            id: '2',
            name: 'DeFi Yield Farming Dashboard',
            description: 'A decentralized finance dashboard for yield farming optimization with real-time analytics and automated strategy execution.',
            creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            sponsor: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            totalBudget: '25.0',
            totalDeposited: '25.0',
            totalReleased: '0.0',
            currentMilestone: '0',
            active: true,
            createdAt: '2024-09-08T10:00:00Z',
            milestones: [
              {
                index: 0,
                description: 'Smart Contract Development',
                amount: '8.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-10-01T00:00:00Z'
              },
              {
                index: 1,
                description: 'Analytics Engine',
                amount: '6.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-10-15T00:00:00Z'
              },
              {
                index: 2,
                description: 'Frontend Dashboard',
                amount: '5.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-11-01T00:00:00Z'
              },
              {
                index: 3,
                description: 'Strategy Automation',
                amount: '4.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-11-15T00:00:00Z'
              },
              {
                index: 4,
                description: 'Testing & Launch',
                amount: '2.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-12-01T00:00:00Z'
              }
            ]
          },
          {
            id: '3',
            name: 'NFT Marketplace for Artists',
            description: 'A decentralized marketplace for digital artists to mint, sell, and trade their artwork as NFTs with royalty mechanisms.',
            creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            sponsor: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            totalBudget: '12.0',
            totalDeposited: '12.0',
            totalReleased: '6.0',
            currentMilestone: '2',
            active: true,
            createdAt: '2024-08-29T10:00:00Z',
            milestones: [
              {
                index: 0,
                description: 'NFT Smart Contracts',
                amount: '4.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-09-15T00:00:00Z'
              },
              {
                index: 1,
                description: 'Marketplace Frontend',
                amount: '4.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-10-01T00:00:00Z'
              },
              {
                index: 2,
                description: 'Royalty System',
                amount: '2.0',
                completed: true,
                approved: false,
                paid: false,
                dueDate: '2024-10-15T00:00:00Z'
              },
              {
                index: 3,
                description: 'Testing & Launch',
                amount: '2.0',
                completed: false,
                approved: false,
                paid: false,
                dueDate: '2024-11-01T00:00:00Z'
              }
            ]
          },
          {
            id: '4',
            name: 'DAO Governance Platform',
            description: 'A decentralized autonomous organization platform for community governance with voting mechanisms and proposal management.',
            creator: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            sponsor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            totalBudget: '18.0',
            totalDeposited: '18.0',
            totalReleased: '18.0',
            currentMilestone: '4',
            active: false,
            createdAt: '2024-07-15T10:00:00Z',
            milestones: [
              {
                index: 0,
                description: 'Governance Smart Contracts',
                amount: '6.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-08-01T00:00:00Z'
              },
              {
                index: 1,
                description: 'Voting Interface',
                amount: '5.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-08-15T00:00:00Z'
              },
              {
                index: 2,
                description: 'Proposal Management',
                amount: '4.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-09-01T00:00:00Z'
              },
              {
                index: 3,
                description: 'Testing & Launch',
                amount: '3.0',
                completed: true,
                approved: true,
                paid: true,
                dueDate: '2024-09-15T00:00:00Z'
              }
            ]
          }
        ];
        
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Update a specific project
  const updateProject = (projectId, updates) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, ...updates }
          : project
      );
      
      // Force a new array reference to ensure React detects the change
      return [...updatedProjects];
    });
  };

  // Update a milestone in a specific project
  const updateMilestone = (projectId, milestoneIndex, milestoneUpdates) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => 
        project.id === projectId 
          ? {
              ...project,
              milestones: project.milestones.map((milestone, index) => 
                index === milestoneIndex 
                  ? { ...milestone, ...milestoneUpdates }
                  : milestone
              )
            }
          : project
      );
      
      // Force a new array reference to ensure React detects the change
      return [...updatedProjects];
    });
  };

  // Get a specific project by ID
  const getProject = (projectId) => {
    return projects.find(project => project.id === projectId);
  };

  // Refresh projects data
  const refreshProjects = () => {
    setIsLoading(true);
    // Force a re-render by updating the projects array
    setProjects(prevProjects => [...prevProjects]);
    setIsLoading(false);
  };

  const value = {
    projects,
    isLoading,
    updateProject,
    updateMilestone,
    getProject,
    setProjects,
    refreshProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
