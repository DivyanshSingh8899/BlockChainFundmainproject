import { useState, useEffect, createContext, useContext } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('mock_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setUserProfile(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      console.log('Mock signup with:', { email, userData })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock user with proper ID based on role
      const roleIdMap = {
        sponsor: 'sponsor-1',
        manager: 'manager-1',
        auditor: 'auditor-1'
      }
      
      const mockUser = {
        id: roleIdMap[userData.role] || Date.now().toString(),
        email,
        full_name: userData.full_name,
        role: userData.role,
        wallet_address: userData.wallet_address || '0x0000000000000000000000000000000000000000',
        created_at: new Date().toISOString()
      }
      
      // Save to localStorage
      localStorage.setItem('mock_user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setUserProfile(mockUser)
      
      console.log('Mock signup successful:', mockUser)
      toast.success('Account created successfully!')
      
      return { data: { user: mockUser }, error: null }
      
    } catch (error) {
      console.error('Mock signup error:', error)
      toast.error('Failed to create account')
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      console.log('Mock signin with:', { email })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user exists in localStorage or create demo user
      const savedUser = localStorage.getItem('mock_user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (user.email === email) {
          setUser(user)
          setUserProfile(user)
          toast.success('Signed in successfully!')
          
          return { data: { user }, error: null }
        }
      }
      
      // Handle demo users
      const demoUsers = {
        'sponsor@example.com': { role: 'sponsor', id: 'sponsor-1', full_name: 'John Sponsor' },
        'manager@example.com': { role: 'manager', id: 'manager-1', full_name: 'Jane Manager' },
        'auditor@example.com': { role: 'auditor', id: 'auditor-1', full_name: 'Bob Auditor' }
      }
      
      if (demoUsers[email] && password === 'password123') {
        const demoUser = {
          id: demoUsers[email].id,
          email,
          full_name: demoUsers[email].full_name,
          role: demoUsers[email].role,
          wallet_address: '0x0000000000000000000000000000000000000000',
          created_at: new Date().toISOString()
        }
        
        localStorage.setItem('mock_user', JSON.stringify(demoUser))
        setUser(demoUser)
        setUserProfile(demoUser)
        toast.success('Signed in successfully!')
        
        return { data: { user: demoUser }, error: null }
      }
      
      toast.error('Invalid credentials')
      return { data: null, error: { message: 'Invalid credentials' } }
      
    } catch (error) {
      console.error('Mock signin error:', error)
      toast.error('Failed to sign in')
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('mock_user')
      setUser(null)
      setUserProfile(null)
      toast.success('Signed out successfully!')
    } catch (error) {
      console.error('Mock signout error:', error)
      toast.error('Failed to sign out')
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
