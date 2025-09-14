import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { 
  User, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { account, balance, isConnected, refreshBalance, disconnectWallet, isDisconnecting, disconnectTimestamp } = useWallet();
  
  const [userProjects, setUserProjects] = useState([]);
  const [sponsoredProjects, setSponsoredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Manual balance refresh function
  const handleRefreshBalance = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsRefreshingBalance(true);
    try {
      await refreshBalance();
      toast.success('Balance refreshed successfully');
    } catch (error) {
      console.error('Error refreshing balance:', error);
      toast.error('Failed to refresh balance');
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Auto-refresh balance when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      refreshBalance();
    }
  }, [isConnected, account, refreshBalance]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Use mock data since backend is not available
        const mockUserProjects = [
          {
            id: '1',
            name: 'Blockchain E-Learning Platform',
            description: 'A comprehensive e-learning platform built on blockchain technology with smart contracts for course certification and NFT-based achievements',
            creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            sponsor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            totalBudget: '15.5',
            totalDeposited: '15.5',
            totalReleased: '15.5',
            currentMilestone: '5',
            active: false,
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
          }
        ];

        const mockSponsoredProjects = [
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
          }
        ];

        setUserProjects(mockUserProjects);
        setSponsoredProjects(mockSponsoredProjects);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserProjects([]);
        setSponsoredProjects([]);
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {project.name}
        </h3>
        <span className={`status-badge ${
          project.active ? 'status-active' : 'status-inactive'
        }`}>
          {project.active ? 'Active' : 'Completed'}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Budget:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{project.totalBudget} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Released:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{project.totalReleased} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Progress:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {project.milestones.filter(m => m.paid).length}/{project.milestones.length} milestones
          </span>
        </div>
        {type === 'sponsored' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Creator:</span>
            <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
              {formatAddress(project.creator)}
            </span>
          </div>
        )}
        {type === 'created' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Sponsor:</span>
            <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
              {formatAddress(project.sponsor)}
            </span>
          </div>
        )}
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
        <div 
          className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(project.milestones.filter(m => m.paid).length / project.milestones.length) * 100}%` 
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {formatAddress(account)}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>
                    Balance: {isConnected ? `${parseFloat(balance || '0').toFixed(4)} ETH` : 'Connect wallet to view balance'}
                  </span>
                  {isConnected && (
                    <button
                      onClick={handleRefreshBalance}
                      disabled={isRefreshingBalance}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
                {account && (
                  <div key={`profile-wallet-${disconnectTimestamp || 'connected'}`} className="flex items-center space-x-4">
                    <button
                      onClick={() => copyToClipboard(account)}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Address</span>
                    </button>
                    <button
                      onClick={disconnectWallet}
                      disabled={isDisconnecting}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDisconnecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          <span>Disconnecting...</span>
                        </>
                      ) : (
                        <>
                          <span>Disconnect Wallet</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects Created</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userProjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.totalBudget} ETH</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-danger-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.completedProjects}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects Sponsored</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sponsoredProjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-success-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sponsored</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sponsoredStats.totalBudget} ETH</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-warning-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Funds Released</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sponsoredStats.totalReleased} ETH</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
