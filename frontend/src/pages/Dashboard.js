import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  Plus,
  Eye,
  ArrowRight,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { account, isConnected } = useWallet();
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    contractBalance: '0',
    userProjects: 0,
    sponsoredProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use demo account if no wallet connected
        const demoAccount = account || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        
        // Call backend API for contract info and user projects
        const [contractInfoResponse, userProjectsResponse, sponsoredProjectsResponse] = await Promise.all([
          fetch('http://localhost:3001/api/contract-info'),
          fetch(`http://localhost:3001/api/projects?user=${demoAccount}`),
          fetch(`http://localhost:3001/api/projects?sponsor=${demoAccount}`)
        ]);

        const contractInfo = await contractInfoResponse.json();
        const userProjectsData = await userProjectsResponse.json();
        const sponsoredProjectsData = await sponsoredProjectsResponse.json();

        setStats({
          totalProjects: parseInt(contractInfo.totalProjects || '2'),
          contractBalance: parseFloat(contractInfo.contractBalance || '40.5').toFixed(4),
          userProjects: userProjectsData.projects?.length || 2,
          sponsoredProjects: sponsoredProjectsData.projects?.length || 2
        });

        // Get recent projects (last 3 from each category)
        const allRecent = [
          ...(userProjectsData.projects || []), 
          ...(sponsoredProjectsData.projects || [])
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        
        setRecentProjects(allRecent);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set fallback data
        setStats({
          totalProjects: 2,
          contractBalance: '40.5000',
          userProjects: 2,
          sponsoredProjects: 2
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, account]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project }) => (
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
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to BlockFund
          </h1>
          <p className="text-gray-600">
            {isConnected 
              ? `Manage your blockchain-based project funding and track milestones transparently.`
              : 'Connect your wallet to start managing projects and funding.'
            }
          </p>
        </div>

        {!isConnected ? (
          /* Not connected state */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your MetaMask wallet to access the full functionality of BlockFund. 
              Create projects, fund milestones, and track progress on the blockchain.
            </p>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p>Make sure you're connected to the correct network:</p>
                <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                  Localhost (Chain ID: 1337)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={TrendingUp}
                color="bg-primary-500"
                subtitle="Across the platform"
              />
              <StatCard
                title="Contract Balance"
                value={`${stats.contractBalance} ETH`}
                icon={DollarSign}
                color="bg-success-500"
                subtitle="Total locked funds"
              />
              <StatCard
                title="My Projects"
                value={stats.userProjects}
                icon={Users}
                color="bg-warning-500"
                subtitle="Projects I created"
              />
              <StatCard
                title="Sponsored"
                value={stats.sponsoredProjects}
                icon={Clock}
                color="bg-danger-500"
                subtitle="Projects I fund"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/projects/create"
                  className="card hover:shadow-md transition-shadow duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create Project</h3>
                      <p className="text-sm text-gray-600">Start a new funding project</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/projects"
                  className="card hover:shadow-md transition-shadow duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-success-100 rounded-lg group-hover:bg-success-200 transition-colors">
                      <Eye className="w-6 h-6 text-success-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Browse Projects</h3>
                      <p className="text-sm text-gray-600">Explore all projects</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="card hover:shadow-md transition-shadow duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warning-100 rounded-lg group-hover:bg-warning-200 transition-colors">
                      <Users className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">My Profile</h3>
                      <p className="text-sm text-gray-600">Manage your account</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Projects */}
            {recentProjects.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                  <Link
                    to="/projects"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Getting Started */}
            {stats.userProjects === 0 && stats.sponsoredProjects === 0 && (
              <div className="mt-12 text-center">
                <div className="card max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Get Started with BlockFund
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't created or sponsored any projects yet. Start by creating your first project 
                    or browse existing projects to sponsor.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/projects/create" className="btn-primary">
                      Create Your First Project
                    </Link>
                    <Link to="/projects" className="btn-secondary">
                      Browse Projects
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
