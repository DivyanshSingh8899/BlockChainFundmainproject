import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Clock, CheckCircle, DollarSign, User, Calendar } from 'lucide-react'

const ProjectCard = ({ 
  project, 
  showActions = true, 
  onApprove, 
  onReject,
  onUpdateStatus,
  userRole = null 
}) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {project.name || project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        </div>
        {getStatusBadge(project.status || (project.active ? 'active' : 'completed'))}
      </div>

      {/* Project Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Budget:
          </span>
          <span className="font-medium">{project.totalBudget || project.total_budget} ETH</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Released:
          </span>
          <span className="font-medium">{project.totalReleased || project.total_released || 0} ETH</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <User className="w-4 h-4 mr-1" />
            Creator:
          </span>
          <span className="font-mono text-xs">
            {formatAddress(project.creator || project.manager?.wallet_address)}
          </span>
        </div>

        {project.sponsor && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Sponsor:
            </span>
            <span className="font-mono text-xs">
              {formatAddress(project.sponsor || project.sponsor?.wallet_address)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Created:
          </span>
          <span className="text-gray-600">{formatDate(project.createdAt || project.created_at)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-600">
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
