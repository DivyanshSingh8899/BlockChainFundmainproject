import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, authHelpers, dbHelpers } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext()

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await authHelpers.getUserProfile(userId)
      if (error) throw error
      setUserProfile(data)
      return data
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser()
        if (error) throw error

        if (user) {
          setUser(user)
          setIsAuthenticated(true)
          await loadUserProfile(user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign up function
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      console.log('=== SIGNUP DEBUG INFO ===')
      console.log('Attempting signup with:', { email, userData })
      console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY)
      console.log('Supabase Key length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length)
      console.log('Supabase Key starts with:', process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 20))
      
      // Test Supabase connection first
      try {
        const { data: testData, error: testError } = await supabase.auth.getUser()
        console.log('Supabase connection test:', { testData, testError })
      } catch (testErr) {
        console.error('Supabase connection failed:', testErr)
      }
      
      const { data, error } = await authHelpers.signUp(email, password, userData)
      console.log('Signup response:', { data, error })

      if (error) throw error

      // Create user profile in database
      if (data.user) {
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          role: userData.role || 'manager',
          wallet_address: userData.wallet_address || null
        }

        const { error: profileError } = await supabase
          .from('users')
          .insert(profileData)

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }

      toast.success('Account created successfully! Please check your email to verify your account.')
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error.message || 'Failed to create account'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await authHelpers.signIn(email, password)

      if (error) throw error

      toast.success('Signed in successfully!')
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error.message || 'Failed to sign in'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await authHelpers.signOut()

      if (error) throw error

      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
      toast.success('Signed out successfully!')
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error.message || 'Failed to sign out'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { data, error } = await authHelpers.updateUserProfile(user.id, updates)
      if (error) throw error

      setUserProfile(data)
      toast.success('Profile updated successfully!')
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update profile'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return userProfile?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userProfile?.role)
  }

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    hasAnyRole,
    loadUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
