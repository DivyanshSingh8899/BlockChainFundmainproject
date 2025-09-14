import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuthMock'
import { useProjectContext } from '../contexts/ProjectContext'
import { mockDbHelpers } from '../utils/mockData'
import OverviewCard from '../components/OverviewCard'
import ProjectCard from '../components/ProjectCard'
import MilestoneTracker from '../components/MilestoneTracker'
import { 
  MilestoneTrendChart, 
  RevenueExpensesChart 
} from '../components/Charts'
import { 
  Plus, 
  FolderOpen, 
  CheckCircle, 
  Clock,
  TrendingUp,
  DollarSign,
  Filter,
  Search
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ManagerDashboard = () => {
  const { userProfile } = useAuth()
  const { projects: contextProjects } = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedMilestones: 0,
    totalBudget: 0
  })
  const [projects, setProjects] = useState([])
  const [chartData, setChartData] = useState({
    milestoneTrend: [],
    revenueExpenses: []
  })

  useEffect(() => {
    loadManagerData()
  }, [userProfile, contextProjects])

  const loadManagerData = async () => {
    try {
      setLoading(true)
      
      // Use context projects instead of mock data
      const projectsData = contextProjects || []

      // Calculate stats using context project structure
      const totalProjects = projectsData?.length || 0
      const activeProjects = projectsData?.filter(p => p.active).length || 0
      const completedMilestones = projectsData?.reduce((sum, project) => 
        sum + (project.milestones?.filter(m => m.completed || m.approved).length || 0), 0
      ) || 0
      const totalBudget = projectsData?.reduce((sum, project) => sum + parseFloat(project.totalBudget), 0) || 0

      setStats({
        totalProjects,
        activeProjects,
        completedMilestones,
        totalBudget: totalBudget.toFixed(4)
      })

      setProjects(projectsData || [])

      // Generate chart data
      generateChartData(projectsData || [])

    } catch (error) {
      console.error('Error loading manager data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (projectsData) => {
    // Milestone completion trend (last 8 weeks)
    const milestoneTrend = [
      { week: 'W1', completed: 3, pending: 7 },
      { week: 'W2', completed: 5, pending: 5 },
      { week: 'W3', completed: 8, pending: 2 },
      { week: 'W4', completed: 6, pending: 4 },
      { week: 'W5', completed: 9, pending: 1 },
      { week: 'W6', completed: 7, pending: 3 },
      { week: 'W7', completed: 10, pending: 0 },
      { week: 'W8', completed: 8, pending: 2 }
    ]

    // Revenue vs Expenses (last 6 months)
    const revenueExpenses = [
      { month: 'Jan', revenue: 15.5, expenses: 12.2 },
      { month: 'Feb', revenue: 18.0, expenses: 14.8 },
      { month: 'Mar', revenue: 22.5, expenses: 18.5 },
      { month: 'Apr', revenue: 20.0, expenses: 16.2 },
      { month: 'May', revenue: 25.0, expenses: 20.8 },
      { month: 'Jun', revenue: 28.5, expenses: 23.5 }
    ]

    setChartData({
      milestoneTrend,
      revenueExpenses
    })
  }

  const handleUpdateMilestoneStatus = async (milestoneId) => {
    try {
      const { error } = await mockDbHelpers.updateMilestone(milestoneId, {
        status: 'completed',
        completed_at: new Date().toISOString()
      })

      if (error) throw error

      toast.success('Milestone marked as completed!')
      loadManagerData() // Reload data
    } catch (error) {
      console.error('Error updating milestone:', error)
      toast.error('Failed to update milestone status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manager Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create and manage your blockchain projects
              </p>
            </div>
            <Link
              to="/projects/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="Projects created"
            icon="folderOpen"
            color="blue"
          />
          <OverviewCard
            title="Active Projects"
            value={stats.activeProjects}
            subtitle="Currently running"
            icon="check"
            color="green"
          />
          <OverviewCard
            title="Completed Milestones"
            value={stats.completedMilestones}
            subtitle="Milestones finished"
            icon="trendingUp"
            color="purple"
          />
          <OverviewCard
            title="Total Budget"
            value={`${stats.totalBudget} ETH`}
            subtitle="Total project funding"
            icon="dollar"
            color="yellow"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MilestoneTrendChart data={chartData.milestoneTrend} />
          <RevenueExpensesChart data={chartData.revenueExpenses} />
        </div>

        {/* My Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Projects</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="btn-secondary text-sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userRole="manager"
                  onUpdateStatus={handleUpdateMilestoneStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Projects Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first blockchain project to get started.</p>
              <Link
                to="/projects/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Project</span>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Milestones */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Milestones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.slice(0, 2).map((project) => (
                <MilestoneTracker
                  key={project.id}
                  milestones={project.milestones || []}
                  userRole="manager"
                  onUpdateStatus={handleUpdateMilestoneStatus}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/projects/create"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 bg-primary-100 rounded-lg mr-4">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Create Project</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start a new blockchain project</p>
              </div>
            </Link>
            
            <Link
              to="/projects"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">View All Projects</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Browse all available projects</p>
              </div>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Update Profile</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
