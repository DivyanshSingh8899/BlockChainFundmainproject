import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuthMock'
import { useProjectContext } from '../contexts/ProjectContext'
import { mockDbHelpers } from '../utils/mockData'
import OverviewCard from '../components/OverviewCard'
import ProjectCard from '../components/ProjectCard'
import TransactionTable from '../components/TransactionTable'
import MilestoneTracker from '../components/MilestoneTracker'
import { 
  FundDistributionChart, 
  ProjectStatusChart, 
  MilestoneTrendChart 
} from '../components/Charts'
import { 
  Eye, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  Filter,
  Search,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

const AuditorDashboard = () => {
  const { userProfile } = useAuth()
  const { projects: contextProjects } = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTransactions: 0,
    totalVolume: 0,
    activeProjects: 0
  })
  const [projects, setProjects] = useState([])
  const [transactions, setTransactions] = useState([])
  const [chartData, setChartData] = useState({
    fundDistribution: [],
    projectStatus: [],
    milestoneTrend: []
  })

  useEffect(() => {
    loadAuditorData()
  }, [userProfile, contextProjects])

  const loadAuditorData = async () => {
    try {
      setLoading(true)
      
      // Use context projects instead of mock data
      const projectsData = contextProjects || []

      // Load all transactions
      const { data: transactionsData, error: transactionsError } = await mockDbHelpers.getTransactions()

      if (transactionsError) throw transactionsError

      // Calculate stats using context project structure
      const totalProjects = projectsData?.length || 0
      const totalTransactions = transactionsData?.length || 0
      const totalVolume = transactionsData?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0
      const activeProjects = projectsData?.filter(p => p.active).length || 0

      setStats({
        totalProjects,
        totalTransactions,
        totalVolume: totalVolume.toFixed(4),
        activeProjects
      })

      // Sort projects: Active projects first, then completed projects
      const sortedProjects = (projectsData || []).sort((a, b) => {
        // Active projects (active: true) come first
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;
        
        // If both have same status, sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setProjects(sortedProjects)
      setTransactions(transactionsData || [])

      // Generate chart data
      generateChartData(projectsData || [], transactionsData || [])

    } catch (error) {
      console.error('Error loading auditor data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (projectsData, transactionsData) => {
    // Fund distribution over time (last 6 months)
    const fundDistribution = [
      { date: 'Jan', deposited: 45.5, released: 38.2 },
      { date: 'Feb', deposited: 52.0, released: 45.1 },
      { date: 'Mar', deposited: 38.5, released: 32.8 },
      { date: 'Apr', deposited: 48.0, released: 41.5 },
      { date: 'May', deposited: 55.0, released: 48.2 },
      { date: 'Jun', deposited: 62.0, released: 55.5 }
    ]

    // Project status distribution
    const statusCounts = projectsData.reduce((acc, project) => {
      // Map active field to status string
      const status = project.active ? 'active' : 'completed'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const projectStatus = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }))

    // Milestone completion trend (last 8 weeks)
    const milestoneTrend = [
      { week: 'W1', completed: 12, pending: 18 },
      { week: 'W2', completed: 15, pending: 15 },
      { week: 'W3', completed: 18, pending: 12 },
      { week: 'W4', completed: 14, pending: 16 },
      { week: 'W5', completed: 20, pending: 10 },
      { week: 'W6', completed: 16, pending: 14 },
      { week: 'W7', completed: 22, pending: 8 },
      { week: 'W8', completed: 19, pending: 11 }
    ]

    setChartData({
      fundDistribution,
      projectStatus,
      milestoneTrend
    })
  }

  const exportData = (type) => {
    // This would typically generate and download a CSV/PDF report
    toast.success(`${type} report exported successfully!`)
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Auditor Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor and analyze all blockchain projects and transactions
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => exportData('Projects')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Projects</span>
              </button>
              <button 
                onClick={() => exportData('Transactions')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Transactions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="All projects in system"
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
            title="Total Transactions"
            value={stats.totalTransactions}
            subtitle="All recorded transactions"
            icon="barChart3"
            color="purple"
          />
          <OverviewCard
            title="Total Volume"
            value={`${stats.totalVolume} ETH`}
            subtitle="Total transaction volume"
            icon="dollar"
            color="yellow"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FundDistributionChart data={chartData.fundDistribution} />
          <ProjectStatusChart data={chartData.projectStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MilestoneTrendChart data={chartData.milestoneTrend} />
          
          {/* System Health */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors duration-300">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">All Systems Operational</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">✓</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-300">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Database Connected</span>
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400">✓</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors duration-300">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">3 Pending Reviews</span>
                </div>
                <span className="text-sm text-yellow-600 dark:text-yellow-400">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Projects</h2>
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
              {projects.slice(0, 6).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userRole="auditor"
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Projects Found</h3>
              <p className="text-gray-500 dark:text-gray-400">No projects have been created in the system yet.</p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <TransactionTable transactions={transactions.slice(0, 10)} isLoading={loading} />

        {/* Recent Milestones */}
        {projects.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Milestones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.slice(0, 2).map((project) => (
                <MilestoneTracker
                  key={project.id}
                  milestones={project.milestones || []}
                  userRole="auditor"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditorDashboard
