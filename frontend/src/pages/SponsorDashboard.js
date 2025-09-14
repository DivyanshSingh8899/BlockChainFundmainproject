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
  BudgetAllocationChart 
} from '../components/Charts'
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'

const SponsorDashboard = () => {
  const { userProfile } = useAuth()
  const { projects: contextProjects } = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAllocated: 0,
    totalReleased: 0,
    pendingFunds: 0,
    activeProjects: 0
  })
  const [projects, setProjects] = useState([])
  const [transactions, setTransactions] = useState([])
  const [pendingMilestones, setPendingMilestones] = useState([])
  const [chartData, setChartData] = useState({
    fundDistribution: [],
    projectStatus: [],
    budgetAllocation: []
  })

  useEffect(() => {
    loadSponsorData()
  }, [userProfile, contextProjects])

  const loadSponsorData = async () => {
    try {
      setLoading(true)
      
      // Use context projects instead of mock data
      const projectsData = contextProjects || []
      
      // Load transactions
      const { data: transactionsData, error: transactionsError } = await mockDbHelpers.getTransactions({
        user_id: userProfile?.id
      })

      if (transactionsError) throw transactionsError

      // Calculate stats using context project structure
      const totalAllocated = projectsData?.reduce((sum, project) => sum + parseFloat(project.totalBudget), 0) || 0
      const totalReleased = projectsData?.reduce((sum, project) => sum + parseFloat(project.totalReleased), 0) || 0
      const pendingFunds = totalAllocated - totalReleased
      const activeProjects = projectsData?.filter(p => p.active).length || 0

      setStats({
        totalAllocated: totalAllocated.toFixed(4),
        totalReleased: totalReleased.toFixed(4),
        pendingFunds: pendingFunds.toFixed(4),
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

      // Get pending milestones from all projects
      const allMilestones = projectsData?.flatMap(project => 
        project.milestones?.filter(milestone => milestone.completed && !milestone.approved) || []
      ) || []
      setPendingMilestones(allMilestones)

      // Generate chart data
      generateChartData(projectsData || [], transactionsData || [])

    } catch (error) {
      console.error('Error loading sponsor data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (projectsData, transactionsData) => {
    // Fund distribution over time (last 6 months)
    const fundDistribution = [
      { date: 'Jan', deposited: 10.5, released: 8.2 },
      { date: 'Feb', deposited: 15.0, released: 12.1 },
      { date: 'Mar', deposited: 8.5, released: 6.8 },
      { date: 'Apr', deposited: 12.0, released: 9.5 },
      { date: 'May', deposited: 18.0, released: 14.2 },
      { date: 'Jun', deposited: 22.0, released: 18.5 }
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

    // Budget allocation (last 6 months)
    const budgetAllocation = [
      { month: 'Jan', allocated: 25.0, spent: 20.5 },
      { month: 'Feb', allocated: 30.0, spent: 28.2 },
      { month: 'Mar', allocated: 22.0, spent: 18.8 },
      { month: 'Apr', allocated: 35.0, spent: 32.1 },
      { month: 'May', allocated: 28.0, spent: 25.5 },
      { month: 'Jun', allocated: 40.0, spent: 35.8 }
    ]

    setChartData({
      fundDistribution,
      projectStatus,
      budgetAllocation
    })
  }

  const handleApproveMilestone = async (milestoneId) => {
    try {
      const { error } = await mockDbHelpers.updateMilestone(milestoneId, {
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: userProfile?.id
      })

      if (error) throw error

      toast.success('Milestone approved successfully!')
      loadSponsorData() // Reload data
    } catch (error) {
      console.error('Error approving milestone:', error)
      toast.error('Failed to approve milestone')
    }
  }

  const handleRejectMilestone = async (milestoneId) => {
    try {
      const { error } = await mockDbHelpers.updateMilestone(milestoneId, {
        status: 'rejected',
        approved_at: new Date().toISOString(),
        approved_by: userProfile?.id
      })

      if (error) throw error

      toast.success('Milestone rejected')
      loadSponsorData() // Reload data
    } catch (error) {
      console.error('Error rejecting milestone:', error)
      toast.error('Failed to reject milestone')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sponsor Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your project investments and milestone approvals
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Allocated"
            value={`${stats.totalAllocated} ETH`}
            subtitle="Total funds committed"
            icon="dollar"
            color="blue"
          />
          <OverviewCard
            title="Total Released"
            value={`${stats.totalReleased} ETH`}
            subtitle="Funds released to projects"
            icon="trendingUp"
            color="green"
          />
          <OverviewCard
            title="Pending Funds"
            value={`${stats.pendingFunds} ETH`}
            subtitle="Awaiting milestone completion"
            icon="clock"
            color="yellow"
          />
          <OverviewCard
            title="Active Projects"
            value={stats.activeProjects}
            subtitle="Projects currently funded"
            icon="check"
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FundDistributionChart data={chartData.fundDistribution} />
          <ProjectStatusChart data={chartData.projectStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BudgetAllocationChart data={chartData.budgetAllocation} />
          
          {/* Pending Milestones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Milestone Approvals</h3>
            {pendingMilestones.length > 0 ? (
              <div className="space-y-4">
                {pendingMilestones.slice(0, 5).map((milestone) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          Amount: {milestone.amount} ETH
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveMilestone(milestone.id)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectMilestone(milestone.id)}
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingMilestones.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {pendingMilestones.length - 5} more pending approvals...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-500">No pending milestone approvals at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
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
                  userRole="sponsor"
                  onApprove={handleApproveMilestone}
                  onReject={handleRejectMilestone}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-500">You haven't sponsored any projects yet.</p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <TransactionTable transactions={transactions} isLoading={loading} />
      </div>
    </div>
  )
}

export default SponsorDashboard
