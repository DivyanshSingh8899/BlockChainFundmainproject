import React from 'react'
import { CheckCircle, Clock, XCircle, Calendar, DollarSign, User } from 'lucide-react'

const MilestoneTracker = ({ 
  milestones, 
  userRole, 
  onApprove, 
  onReject, 
  onUpdateStatus,
  isLoading = false 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const canApprove = (milestone) => {
    return userRole === 'sponsor' && milestone.status === 'completed'
  }

  const canUpdate = (milestone) => {
    return userRole === 'manager' && milestone.status === 'pending'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-5 w-5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones</h3>
          <p className="text-gray-500">No milestones have been created for this project yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones</h3>
      
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(milestone.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      Milestone {index + 1}: {milestone.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                      {milestone.status.replace('_', ' ').charAt(0).toUpperCase() + milestone.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span className="font-medium">{milestone.amount} ETH</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Due: {formatDate(milestone.due_date)}</span>
                    </div>
                    
                    {milestone.completed_at && (
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        <span>Completed: {formatDate(milestone.completed_at)}</span>
                      </div>
                    )}
                    
                    {milestone.approved_at && (
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>Approved: {formatDate(milestone.approved_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex-shrink-0 ml-4">
                {canApprove(milestone) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApprove && onApprove(milestone.id)}
                      className="btn-primary text-xs px-3 py-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(milestone.id)}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {canUpdate(milestone) && (
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(milestone.id)}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>
            {milestones.filter(m => m.status === 'completed' || m.status === 'approved').length} / {milestones.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(milestones.filter(m => m.status === 'completed' || m.status === 'approved').length / milestones.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MilestoneTracker
