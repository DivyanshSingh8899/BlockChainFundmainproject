import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuthMock'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'
import SupabaseConfigAlert from '../components/SupabaseConfigAlert'
import { fillDemoUser } from '../utils/demoUsers'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated, userProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, userProfile, navigate, location])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDemoUser = (role) => {
    const demoUser = fillDemoUser(role)
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: demoUser.password
      })
      toast.success(`Demo ${role} user loaded!`)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const result = await signIn(formData.email, formData.password)
      
      if (result.data && result.data.user) {
        // Redirect to dashboard after successful login
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard'
          navigate(from, { replace: true })
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return <SupabaseConfigAlert />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Sign in to BlockFund
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Demo User Buttons */}
            <div className="mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Demo Access:</p>
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleDemoUser('sponsor')}
                    className="flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Sponsor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoUser('manager')}
                    className="flex items-center px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoUser('auditor')}
                    className="flex items-center px-3 py-2 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Auditor
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Sign in</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p><strong>Sponsor:</strong> sponsor@example.com / password123</p>
                <p><strong>Manager:</strong> manager@example.com / password123</p>
                <p><strong>Auditor:</strong> auditor@example.com / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
