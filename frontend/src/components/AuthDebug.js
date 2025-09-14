import React from 'react'
import { useAuth } from '../hooks/useAuthMock'

const AuthDebug = () => {
  const { user, userProfile, isAuthenticated, loading } = useAuth()

  return (
    <div className="fixed top-2 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg text-xs z-50 shadow-lg transition-colors duration-300">
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Auth Debug</h4>
      <p className="text-gray-700 dark:text-gray-300">Loading: {loading ? 'Yes' : 'No'}</p>
      <p className="text-gray-700 dark:text-gray-300">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p className="text-gray-700 dark:text-gray-300">User: {user ? user.email : 'None'}</p>
      <p className="text-gray-700 dark:text-gray-300">Role: {userProfile ? userProfile.role : 'None'}</p>
      <p className="text-gray-700 dark:text-gray-300">LocalStorage: {localStorage.getItem('mock_user') ? 'Has data' : 'Empty'}</p>
    </div>
  )
}

export default AuthDebug
