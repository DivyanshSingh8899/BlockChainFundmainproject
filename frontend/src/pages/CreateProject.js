import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const { createProject, isLoading } = useContract();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sponsor: '',
    milestones: [
      { description: '', amount: '', dueDate: '' }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { description: '', amount: '', dueDate: '' }]
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      const newMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        milestones: newMilestones
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Project description is required');
      return false;
    }
    
    if (!formData.sponsor.trim()) {
      toast.error('Sponsor address is required');
      return false;
    }
    
    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.sponsor)) {
      toast.error('Invalid sponsor address format');
      return false;
    }
    
    for (let i = 0; i < formData.milestones.length; i++) {
      const milestone = formData.milestones[i];
      
      if (!milestone.description.trim()) {
        toast.error(`Milestone ${i + 1} description is required`);
        return false;
      }
      
      if (!milestone.amount || parseFloat(milestone.amount) <= 0) {
        toast.error(`Milestone ${i + 1} amount must be greater than 0`);
        return false;
      }
      
      if (!milestone.dueDate) {
        toast.error(`Milestone ${i + 1} due date is required`);
        return false;
      }
      
      const dueDate = new Date(milestone.dueDate);
      if (dueDate <= new Date()) {
        toast.error(`Milestone ${i + 1} due date must be in the future`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare milestone data
      const milestoneDescriptions = formData.milestones.map(m => m.description);
      const milestoneAmounts = formData.milestones.map(m => m.amount);
      const milestoneDueDates = formData.milestones.map(m => 
        Math.floor(new Date(m.dueDate).getTime() / 1000)
      );
      
      const projectData = {
        name: formData.name,
        description: formData.description,
        sponsor: formData.sponsor,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates
      };
      
      const result = await createProject(projectData);
      
      toast.success('Project created successfully!');
      navigate(`/projects/${result.projectId}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalBudget = () => {
    return formData.milestones.reduce((total, milestone) => {
      return total + (parseFloat(milestone.amount) || 0);
    }, 0).toFixed(4);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your MetaMask wallet to create a project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new blockchain-based project with milestone-based funding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Project Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Project Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter project name"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="label">
                  Sponsor Address *
                </label>
                <input
                  type="text"
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange('sponsor', e.target.value)}
                  className="input-field font-mono"
                  placeholder="0x..."
                  maxLength={42}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The address that will fund this project
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="label">
                Project Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field h-32 resize-none"
                placeholder="Describe your project goals, objectives, and deliverables..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Project Milestones
              </h2>
              <button
                type="button"
                onClick={addMilestone}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Milestone</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Milestone {index + 1}
                    </h3>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-danger-600 hover:text-danger-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="label">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        className="input-field"
                        placeholder="Describe this milestone..."
                        maxLength={200}
                      />
                    </div>
                    
                    <div>
                      <label className="label">
                        Amount (ETH) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={milestone.amount}
                          onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                          className="input-field pr-8"
                          placeholder="0.0"
                        />
                        <DollarSign className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="label">
                        Due Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                          className="input-field pr-8"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">Total Budget:</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {calculateTotalBudget()} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
