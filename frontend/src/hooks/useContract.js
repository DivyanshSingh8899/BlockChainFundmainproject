import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import toast from 'react-hot-toast';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [contractABI, setContractABI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load contract ABI and address
  useEffect(() => {
    const loadContract = async () => {
      try {
        // Use the deployed contract address
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        setContractAddress(contractAddress);
        
        // Try to load from the contract file created during deployment
        try {
          const contractData = await import('../contracts/ProjectFunding.json');
          if (contractData.default && contractData.default.abi) {
            setContractABI(contractData.default.abi);
          }
        } catch (importError) {
          console.warn('Could not load contract ABI from file, will use fallback');
        }
        
        console.log('✅ Contract address loaded:', contractAddress);
      } catch (error) {
        console.error('Error loading contract data:', error);
      }
    };

    loadContract();
  }, []);

  // Initialize contract when provider and ABI are available
  useEffect(() => {
    if (provider && contractABI && contractAddress) {
      try {
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
        toast.error('Failed to initialize contract');
      }
    }
  }, [provider, contractABI, contractAddress]);

  // Contract interaction methods
  const createProject = async (projectData) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not available');
    }

    setIsLoading(true);
    try {
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.createProject(
        projectData.name,
        projectData.description,
        projectData.sponsor,
        projectData.milestoneDescriptions,
        projectData.milestoneAmounts,
        projectData.milestoneDueDates
      );

      const receipt = await tx.wait();
      
      // Extract project ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog.name === 'ProjectCreated';
        } catch {
          return false;
        }
      });

      const projectId = event ? contract.interface.parseLog(event).args[0] : null;

      toast.success(`Project created successfully! ID: ${projectId}`);
      
      return {
        projectId: projectId.toString(),
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const depositFunds = async (projectId, amount) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not available');
    }

    setIsLoading(true);
    try {
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.depositFunds(projectId, {
        value: ethers.parseEther(amount.toString())
      });

      const receipt = await tx.wait();
      
      toast.success(`Funds deposited successfully! Amount: ${amount} ETH`);
      
      return {
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Error depositing funds:', error);
      toast.error('Failed to deposit funds');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMilestone = async (projectId, milestoneIndex) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not available');
    }

    setIsLoading(true);
    try {
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.completeMilestone(projectId, milestoneIndex);
      const receipt = await tx.wait();
      
      toast.success('Milestone marked as completed!');
      
      return {
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Error completing milestone:', error);
      toast.error('Failed to complete milestone');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveMilestone = async (projectId, milestoneIndex) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not available');
    }

    setIsLoading(true);
    try {
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.approveMilestone(projectId, milestoneIndex);
      const receipt = await tx.wait();
      
      toast.success('Milestone approved and funds released!');
      
      return {
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Error approving milestone:', error);
      toast.error('Failed to approve milestone');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Read-only methods
  const getProject = async (projectId) => {
    if (!contract) {
      throw new Error('Contract not available');
    }

    try {
      const project = await contract.getProject(projectId);
      const milestones = await contract.getProjectMilestones(projectId);

      return {
        id: project.id.toString(),
        name: project.name,
        description: project.description,
        creator: project.creator,
        sponsor: project.sponsor,
        totalBudget: ethers.formatEther(project.totalBudget),
        totalDeposited: ethers.formatEther(project.totalDeposited),
        totalReleased: ethers.formatEther(project.totalReleased),
        currentMilestone: project.currentMilestone.toString(),
        active: project.active,
        createdAt: new Date(Number(project.createdAt) * 1000).toISOString(),
        milestones: milestones.map((milestone, index) => ({
          index,
          description: milestone.description,
          amount: ethers.formatEther(milestone.amount),
          completed: milestone.completed,
          approved: milestone.approved,
          paid: milestone.paid,
          dueDate: new Date(Number(milestone.dueDate) * 1000).toISOString()
        }))
      };

    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  };

  const getUserProjects = async (userAddress) => {
    if (!contract) {
      throw new Error('Contract not available');
    }

    try {
      const projectIds = await contract.getUserProjects(userAddress);
      const projects = [];

      for (const projectId of projectIds) {
        try {
          const project = await getProject(projectId.toString());
          projects.push(project);
        } catch (error) {
          console.warn(`Project ${projectId} not found:`, error.message);
        }
      }

      return projects;

    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  };

  const getSponsoredProjects = async (sponsorAddress) => {
    if (!contract) {
      throw new Error('Contract not available');
    }

    try {
      const projectIds = await contract.getSponsoredProjects(sponsorAddress);
      const projects = [];

      for (const projectId of projectIds) {
        try {
          const project = await getProject(projectId.toString());
          projects.push(project);
        } catch (error) {
          console.warn(`Project ${projectId} not found:`, error.message);
        }
      }

      return projects;

    } catch (error) {
      console.error('Error fetching sponsored projects:', error);
      throw error;
    }
  };

  const getTotalProjects = async () => {
    if (!contract) {
      throw new Error('Contract not available');
    }

    try {
      const total = await contract.getTotalProjects();
      return total.toString();
    } catch (error) {
      console.error('Error fetching total projects:', error);
      throw error;
    }
  };

  const getContractBalance = async () => {
    if (!contract) {
      throw new Error('Contract not available');
    }

    try {
      const balance = await contract.getContractBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching contract balance:', error);
      throw error;
    }
  };

  const value = {
    contract,
    contractAddress,
    contractABI,
    isLoading,
    isReady: !!(contract && contractAddress && contractABI),
    createProject,
    depositFunds,
    completeMilestone,
    approveMilestone,
    getProject,
    getUserProjects,
    getSponsoredProjects,
    getTotalProjects,
    getContractBalance
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
