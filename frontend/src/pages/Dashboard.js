import React from 'react';
import { useAuth } from '../hooks/useAuthMock';
import SponsorDashboard from './SponsorDashboard';
import ManagerDashboard from './ManagerDashboard';
import AuditorDashboard from './AuditorDashboard';

const Dashboard = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (userProfile?.role) {
    case 'sponsor':
      return <SponsorDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'auditor':
      return <AuditorDashboard />;
    default:
  return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Invalid User Role
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account has an invalid role. Please contact support.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Current role: {userProfile?.role || 'None'}
            </p>
      </div>
    </div>
  );
  }
};

export default Dashboard;