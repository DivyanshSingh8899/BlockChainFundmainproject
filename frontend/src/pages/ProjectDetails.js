import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useProjectContext } from '../contexts/ProjectContext';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const { getProject, updateProject, updateMilestone } = useProjectContext();
  
  const [project, setProject] = useState(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // Try to fetch from backend API first
        try {
          const response = await fetch(`http://localhost:3001/api/projects/${id}`);
          if (response.ok) {
            const data = await response.json();
            setProject(data.project);
            setIsLoadingProject(false);
            return;
          }
        } catch (apiError) {
          console.warn('Backend API not available, using context data:', apiError);
        }

        // Fallback to context data
        const contextProject = getProject(id);
        console.log('ProjectDetails: Context project found:', contextProject);
        if (contextProject) {
          setProject(contextProject);
        } else {
          console.error('ProjectDetails: Project not found with ID:', id);
          throw new Error('Project not found');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project');
        navigate('/projects');
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  // Update local project state when context data changes
  useEffect(() => {
    if (id) {
      const contextProject = getProject(id);
      if (contextProject && project) {
        // Only update if there are actual differences to avoid unnecessary re-renders
        const hasChanges = JSON.stringify(contextProject) !== JSON.stringify(project);
        if (hasChanges) {
          setProject(contextProject);
        }
      }
    }
  }, [id, project]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsDepositing(true);
    try {
      // For demo purposes, just show success message
      toast.success(`Demo: Deposited ${depositAmount} ETH to project ${id}`);
      setDepositAmount('');
      
      const newTotalDeposited = (parseFloat(project.totalDeposited) + parseFloat(depositAmount)).toString();
      
      // Update both local state and context for synchronization
      setProject(prev => ({
        ...prev,
        totalDeposited: newTotalDeposited
      }));
      
      // Update context to ensure other components see the change
      updateProject(id, {
        totalDeposited: newTotalDeposited
      });
    } catch (error) {
      console.error('Error depositing funds:', error);
      toast.error('Failed to deposit funds');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCompleteMilestone = async (milestoneIndex) => {
    setIsCompleting(true);
    try {
      // For demo purposes, just show success message
      toast.success(`Demo: Marked milestone ${milestoneIndex + 1} as completed`);
      
      // Update both local state and context for synchronization
      const milestoneUpdates = { completed: true };
      
      // Update context
      updateMilestone(id, milestoneIndex, milestoneUpdates);
      
      // Update local state
      setProject(prev => ({
        ...prev,
        milestones: prev.milestones.map((milestone, index) => 
          index === milestoneIndex 
            ? { ...milestone, ...milestoneUpdates }
            : milestone
        )
      }));
    } catch (error) {
      console.error('Error completing milestone:', error);
      toast.error('Failed to complete milestone');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleApproveMilestone = async (milestoneIndex) => {
    setIsApproving(true);
    try {
      // For demo purposes, just show success message
      toast.success(`Demo: Approved milestone ${milestoneIndex + 1} and released funds`);
      
      // Update project state for demo
      const milestone = project.milestones[milestoneIndex];
      const newTotalReleased = (parseFloat(project.totalReleased) + parseFloat(milestone.amount)).toString();
      const newCurrentMilestone = (parseInt(project.currentMilestone) + 1).toString();
      
      // Update context first to ensure other components see the change
      updateProject(id, {
        totalReleased: newTotalReleased,
        currentMilestone: newCurrentMilestone
      });
      updateMilestone(id, milestoneIndex, { approved: true, paid: true });
      
      // Update local state
      setProject(prev => ({
        ...prev,
        totalReleased: newTotalReleased,
        currentMilestone: newCurrentMilestone,
        milestones: prev.milestones.map((milestone, index) => 
          index === milestoneIndex 
            ? { ...milestone, approved: true, paid: true }
            : milestone
        )
      }));
    } catch (error) {
      console.error('Error approving milestone:', error);
      toast.error('Failed to approve milestone');
    } finally {
      setIsApproving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getMilestoneStatus = (milestone, index) => {
    if (milestone.paid) return 'completed';
    if (milestone.approved) return 'awaiting-approval';
    if (milestone.completed) return 'awaiting-approval';
    return 'pending';
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'awaiting-approval':
        return <Clock className="w-5 h-5 text-warning-600" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getMilestoneBadge = (status, isOverdue, isCurrent) => {
    // Safeguard: completed milestones should never show as current
    if (status === 'completed') return 'milestone-completed';
    if (isCurrent && status !== 'completed') return 'milestone-current';
    if (isOverdue && status === 'pending') return 'milestone-overdue';
    switch (status) {
      case 'completed':
        return 'milestone-completed';
      case 'awaiting-approval':
        return 'milestone-awaiting-approval';
      case 'pending':
        return 'milestone-pending';
      default:
        return 'milestone-pending';
    }
  };

  const canCompleteMilestone = (milestoneIndex) => {
    // For demo purposes, allow any user to complete milestones
    return project && 
           milestoneIndex === parseInt(project.currentMilestone) &&
           !project.milestones[milestoneIndex].completed;
  };

  const canApproveMilestone = (milestoneIndex) => {
    // For demo purposes, allow any user to approve milestones
    return project && 
           project.milestones[milestoneIndex].completed &&
           !project.milestones[milestoneIndex].approved;
  };

  const canDeposit = () => {
    // For demo purposes, allow any user to deposit funds
    return project && 
           parseFloat(project.totalDeposited) < parseFloat(project.totalBudget);
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="btn-primary"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Remove wallet connection requirement for demo purposes
  // if (!isConnected) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //           Connect Your Wallet
  //         </h2>
  //         <p className="text-gray-600">
  //           Please connect your MetaMask wallet to view project details.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const progressPercentage = project.milestones?.length ? 
    (project.milestones.filter(m => m.paid).length / project.milestones.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="flex items-center space-x-4">
                <span className={`status-badge ${
                  project.active ? 'status-active' : 'status-inactive'
                }`}>
                  {project.active ? 'Active' : 'Completed'}
                </span>
                <span className="text-sm text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {project.totalBudget} ETH
              </div>
              <div className="text-sm text-gray-500">Total Budget</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Project Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {project.totalDeposited} ETH
                  </div>
                  <div className="text-sm text-gray-500">Deposited</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {project.totalReleased} ETH
                  </div>
                  <div className="text-sm text-gray-500">Released</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {project.milestones?.filter(m => m.completed && m.approved && m.paid).length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Completed Milestones</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {project.milestones?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Milestones</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Project Milestones
              </h2>
              
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => {
                  const status = getMilestoneStatus(milestone, index);
                  const isOverdue = new Date(milestone.dueDate) < new Date() && status === 'pending';
                  // Only show as current if it's the current milestone AND not completed/paid
                  const isCurrent = index === parseInt(project.currentMilestone) && 
                                   status !== 'completed' && 
                                   !milestone.paid;
                  
                  return (
                    <div key={index} className={`border rounded-lg p-4 transition-all duration-200 ${
                      isCurrent 
                        ? 'border-primary-300 bg-primary-50 shadow-md' 
                        : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getMilestoneIcon(status)}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Milestone {index + 1}
                              {isCurrent && (
                                <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {milestone.amount} ETH
                          </div>
                          <span className={`status-badge ${getMilestoneBadge(status, isOverdue, isCurrent)}`}>
                            {status === 'awaiting-approval' ? 'Awaiting Approval' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        {isOverdue && (
                          <span className="text-danger-600 font-medium">Overdue</span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {canCompleteMilestone(index) && (
                          <button
                            onClick={() => handleCompleteMilestone(index)}
                            disabled={isCompleting}
                            className="btn-warning text-sm"
                          >
                            {isCompleting ? 'Completing...' : 'Mark Complete'}
                          </button>
                        )}
                        
                        {canApproveMilestone(index) && (
                          <button
                            onClick={() => handleApproveMilestone(index)}
                            disabled={isApproving}
                            className="btn-success text-sm"
                          >
                            {isApproving ? 'Approving...' : 'Approve & Release'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Creator</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-sm">
                      {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(project.creator)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Sponsor</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-sm">
                      {project.sponsor.slice(0, 6)}...{project.sponsor.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(project.sponsor)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Project ID</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-sm">{project.id}</span>
                    <button
                      onClick={() => copyToClipboard(project.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Funds */}
            {canDeposit() && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Deposit Funds
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Amount (ETH)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="input-field"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Remaining budget: {(parseFloat(project.totalBudget) - parseFloat(project.totalDeposited)).toFixed(4)} ETH
                  </div>
                  
                  <button
                    onClick={handleDeposit}
                    disabled={isDepositing || !depositAmount}
                    className="btn-primary w-full"
                  >
                    {isDepositing ? 'Depositing...' : 'Deposit Funds'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
