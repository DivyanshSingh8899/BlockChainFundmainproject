import React from 'react'
import { useAuth } from '../hooks/useAuthMock'

const AuthDebug = () => {
  const { user, userProfile, isAuthenticated, loading } = useAuth()

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h4>Auth Debug</h4>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>User: {user ? user.email : 'None'}</p>
      <p>Role: {userProfile ? userProfile.role : 'None'}</p>
      <p>LocalStorage: {localStorage.getItem('mock_user') ? 'Has data' : 'Empty'}</p>
    </div>
  )
}

export default AuthDebug
