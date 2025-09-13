import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  DollarSign,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

const Projects = () => {
  const { account, isConnected } = useWallet();
  
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Use mock data since backend is not available
        const mockProjects = [
          {
            id: '1',
            name: 'Blockchain E-Learning Platform',
            description: 'A comprehensive e-learning platform built on blockchain technology with smart contracts for course certification and NFT-based achievements',
            creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            sponsor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            totalBudget: '15.5',
            totalDeposited: '15.5',
            totalReleased: '8.5',
            currentMilestone: '4',
            active: true,
            milestones: [
              { id: 1, description: 'Project Setup', amount: '2.0', dueDate: '2024-01-15' },
              { id: 2, description: 'Smart Contract Development', amount: '5.0', dueDate: '2024-02-15' },
              { id: 3, description: 'Frontend Development', amount: '4.0', dueDate: '2024-03-15' },
              { id: 4, description: 'Testing & Deployment', amount: '3.0', dueDate: '2024-04-15' },
              { id: 5, description: 'Documentation', amount: '1.5', dueDate: '2024-05-15' }
            ],
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            name: 'DeFi Yield Farming Dashboard',
            description: 'A decentralized finance dashboard for yield farming optimization with real-time analytics and automated strategies',
            creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            sponsor: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            totalBudget: '25.0',
            totalDeposited: '25.0',
            totalReleased: '0.0',
            currentMilestone: '0',
            active: true,
            milestones: [
              { id: 1, description: 'Research & Planning', amount: '3.0', dueDate: '2024-01-20' },
              { id: 2, description: 'Smart Contract Architecture', amount: '8.0', dueDate: '2024-02-20' },
              { id: 3, description: 'Frontend Interface', amount: '7.0', dueDate: '2024-03-20' },
              { id: 4, description: 'Analytics Engine', amount: '5.0', dueDate: '2024-04-20' },
              { id: 5, description: 'Security Audit', amount: '2.0', dueDate: '2024-05-20' }
            ],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            name: 'NFT Marketplace for Artists',
            description: 'A decentralized marketplace for digital artists to mint, sell, and trade their artwork as NFTs with royalty mechanisms',
            creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            sponsor: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            totalBudget: '12.0',
            totalDeposited: '12.0',
            totalReleased: '6.0',
            currentMilestone: '2',
            active: true,
            milestones: [
              { id: 1, description: 'NFT Contract Development', amount: '4.0', dueDate: '2024-01-10' },
              { id: 2, description: 'Marketplace Frontend', amount: '4.0', dueDate: '2024-02-10' },
              { id: 3, description: 'Artist Dashboard', amount: '2.0', dueDate: '2024-03-10' },
              { id: 4, description: 'Payment Integration', amount: '2.0', dueDate: '2024-04-10' }
            ],
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            name: 'DAO Governance Platform',
            description: 'A decentralized autonomous organization platform for community governance with voting mechanisms and proposal management',
            creator: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            sponsor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            totalBudget: '18.5',
            totalDeposited: '18.5',
            totalReleased: '18.5',
            currentMilestone: '4',
            active: false,
            milestones: [
              { id: 1, description: 'Governance Contract', amount: '6.0', dueDate: '2023-12-01' },
              { id: 2, description: 'Voting Interface', amount: '5.0', dueDate: '2023-12-15' },
              { id: 3, description: 'Proposal System', amount: '4.0', dueDate: '2024-01-01' },
              { id: 4, description: 'Final Testing', amount: '3.5', dueDate: '2024-01-15' }
            ],
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [account]);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => {
        if (filterStatus === 'active') return project.active;
        if (filterStatus === 'completed') return !project.active;
        return true;
      });
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchTerm, filterStatus]);

  const getStatusBadge = (project) => {
    if (!project.active) {
      return (
        <span className="status-badge status-completed">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    }
    
    return (
      <span className="status-badge status-active">
        <Clock className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  const getProgressPercentage = (project) => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    return (parseInt(project.currentMilestone) / project.milestones.length) * 100;
  };

  const ProjectCard = ({ project }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {project.name}
        </h3>
        {getStatusBadge(project)}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Creator:</span>
          <span className="font-mono text-xs">
            {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sponsor:</span>
          <span className="font-mono text-xs">
            {project.sponsor.slice(0, 6)}...{project.sponsor.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Budget:</span>
          <span className="font-medium">{project.totalBudget} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Released:</span>
          <span className="font-medium">{project.totalReleased} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress:</span>
          <span className="font-medium">
            {project.currentMilestone}/{project.milestones?.length || 0} milestones
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${getProgressPercentage(project)}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
        <span>{project.milestones.length} milestones</span>
      </div>
      
      <Link
        to={`/projects/${project.id}`}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Link>
    </div>
  );

  const Pagination = () => {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to view projects.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Projects
              </h1>
              <p className="text-gray-600">
                Explore blockchain-based projects and their funding progress.
              </p>
            </div>
            <Link
              to="/projects/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.active).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + parseFloat(p.totalBudget), 0).toFixed(2)} ETH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {currentProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No projects have been created yet.'}
            </p>
            <Link to="/projects/create" className="btn-primary">
              Create the First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
