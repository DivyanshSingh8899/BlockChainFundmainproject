import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Clock, CheckCircle, DollarSign, User, Calendar } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ProjectCard = ({ 
  project, 
  showActions = true, 
  onApprove, 
  onReject,
  onUpdateStatus,
  userRole = null 
}) => {
  const { isDark } = useTheme()
  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    )
  }

  const getProgressPercentage = () => {
    if (!project.milestones || project.milestones.length === 0) return 0
    const completedMilestones = project.milestones.filter(m => m.completed || m.approved || m.status === 'completed' || m.status === 'approved').length
    return (completedMilestones / project.milestones.length) * 100
  }

  const formatAddress = (address) => {
    if (!address) return 'Not connected'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div 
      className="rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold mb-1 line-clamp-1"
            style={{ color: isDark ? '#f3f4f6' : '#111827' }}
          >
            {project.name || project.title}
          </h3>
          <p 
            className="text-sm line-clamp-2"
            style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
          >
            {project.description}
          </p>
        </div>
        {getStatusBadge(project.status || (project.active ? 'active' : 'completed'))}
      </div>

      {/* Project Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span 
            className="flex items-center"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Budget:
          </span>
          <span 
            className="font-medium"
            style={{ color: isDark ? '#f3f4f6' : '#111827' }}
          >{project.totalBudget || project.total_budget} ETH</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span 
            className="flex items-center"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Released:
          </span>
          <span 
            className="font-medium"
            style={{ color: isDark ? '#f3f4f6' : '#111827' }}
          >{project.totalReleased || project.total_released || 0} ETH</span>
        </div>

        <div className="flex justify-between text-sm">
          <span 
            className="flex items-center"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <User className="w-4 h-4 mr-1" />
            Creator:
          </span>
          <span 
            className="font-mono text-xs"
            style={{ color: isDark ? '#d1d5db' : '#374151' }}
          >
            {formatAddress(project.creator || project.manager?.wallet_address)}
          </span>
        </div>

        {project.sponsor && (
          <div className="flex justify-between text-sm">
            <span 
              className="flex items-center"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              <User className="w-4 h-4 mr-1" />
              Sponsor:
            </span>
            <span 
              className="font-mono text-xs"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {formatAddress(project.sponsor || project.sponsor?.wallet_address)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span 
            className="flex items-center"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Created:
          </span>
          <span style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
            {formatDate(project.createdAt || project.created_at)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Progress</span>
            <span style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
              {project.milestones.filter(m => m.completed || m.approved || m.status === 'completed' || m.status === 'approved').length} / {project.milestones.length} milestones
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 btn-primary flex items-center justify-center space-x-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>

          {/* Role-specific actions */}
          {userRole === 'sponsor' && project.milestones && (
            <div className="flex space-x-1">
              {project.milestones.some(m => m.status === 'pending') && (
                <>
                  <button
                    onClick={() => onApprove && onApprove(project.id)}
                    className="btn-secondary text-sm px-3"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject && onReject(project.id)}
                    className="btn-secondary text-sm px-3"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          )}

          {userRole === 'manager' && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(project.id)}
              className="btn-secondary text-sm px-3"
            >
              Update
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectCard
