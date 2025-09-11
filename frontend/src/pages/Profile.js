import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { 
  User, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { account, balance, isConnected } = useWallet();
  
  const [userProjects, setUserProjects] = useState([]);
  const [sponsoredProjects, setSponsoredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Use demo account if no wallet connected
        const demoAccount = account || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        
        // Call backend API instead of contract directly
        const [createdResponse, sponsoredResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/projects?user=${demoAccount}`),
          fetch(`http://localhost:3001/api/projects?sponsor=${demoAccount}`)
        ]);

        const createdData = await createdResponse.json();
        const sponsoredData = await sponsoredResponse.json();

        setUserProjects(createdData.projects || []);
        setSponsoredProjects(sponsoredData.projects || []);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isConnected, account]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getProjectStats = (projects) => {
    const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.totalBudget), 0);
    const totalReleased = projects.reduce((sum, p) => sum + parseFloat(p.totalReleased), 0);
    const activeProjects = projects.filter(p => p.active).length;
    const completedProjects = projects.filter(p => !p.active).length;

    return {
      totalBudget: totalBudget.toFixed(4),
      totalReleased: totalReleased.toFixed(4),
      activeProjects,
      completedProjects
    };
  };

  const ProjectCard = ({ project, type }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {project.name}
        </h3>
        <span className={`status-badge ${
          project.active ? 'status-active' : 'status-inactive'
        }`}>
          {project.active ? 'Active' : 'Completed'}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="space-y-2 mb-4">
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
            {project.currentMilestone}/{project.milestones.length} milestones
          </span>
        </div>
        {type === 'sponsored' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Creator:</span>
            <span className="font-mono text-xs">
              {formatAddress(project.creator)}
            </span>
          </div>
        )}
        {type === 'created' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sponsor:</span>
            <span className="font-mono text-xs">
              {formatAddress(project.sponsor)}
            </span>
          </div>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(parseInt(project.currentMilestone) / project.milestones.length) * 100}%` 
          }}
        />
      </div>
      
      <Link
        to={`/projects/${project.id}`}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <ExternalLink className="w-4 h-4" />
        <span>View Details</span>
      </Link>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userStats = getProjectStats(userProjects);
  const sponsoredStats = getProjectStats(sponsoredProjects);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your projects and track your funding activities.
          </p>
        </div>

        {/* Profile Info */}
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formatAddress(account)}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Balance: {parseFloat(balance).toFixed(4)} ETH</span>
                <button
                  onClick={() => copyToClipboard(account)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects Created</p>
                <p className="text-2xl font-bold text-gray-900">{userProjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalBudget} ETH</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-danger-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedProjects}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsored Projects Stats */}
        {sponsoredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projects Sponsored</p>
                  <p className="text-2xl font-bold text-gray-900">{sponsoredProjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-success-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sponsored</p>
                  <p className="text-2xl font-bold text-gray-900">{sponsoredStats.totalBudget} ETH</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-warning-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Funds Released</p>
                  <p className="text-2xl font-bold text-gray-900">{sponsoredStats.totalReleased} ETH</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <Link to="/projects/create" className="btn-primary">
              Create New Project
            </Link>
          </div>
          
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} type="created" />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Projects Created
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any projects yet. Start by creating your first project.
              </p>
              <Link to="/projects/create" className="btn-primary">
                Create Your First Project
              </Link>
            </div>
          )}
        </div>

        {/* Sponsored Projects */}
        {sponsoredProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sponsored Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsoredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} type="sponsored" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
