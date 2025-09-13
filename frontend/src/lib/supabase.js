import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lckoekqbnihdrppeirrl.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja29la3FibmloZHJwcGVpcnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDkxNDIsImV4cCI6MjA3MzE4NTE0Mn0.gHBjSLEbB2u3sPoQJVX-lYown0UVzlVigZR12ZLEMK4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for authentication
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get user profile with role
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// Database helper functions
export const dbHelpers = {
  // Projects
  getProjects: async (filters = {}) => {
    let query = supabase.from('projects').select(`
      *,
      manager:users!projects_manager_id_fkey(*),
      milestones(*)
    `)
    
    if (filters.manager_id) {
      query = query.eq('manager_id', filters.manager_id)
    }
    if (filters.sponsor_id) {
      query = query.eq('sponsor_id', filters.sponsor_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    return { data, error }
  },

  createProject: async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    return { data, error }
  },

  updateProject: async (projectId, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    return { data, error }
  },

  // Milestones
  getMilestones: async (projectId) => {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at')
    return { data, error }
  },

  createMilestone: async (milestoneData) => {
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestoneData)
      .select()
      .single()
    return { data, error }
  },

  updateMilestone: async (milestoneId, updates) => {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single()
    return { data, error }
  },

  // Transactions
  getTransactions: async (filters = {}) => {
    let query = supabase.from('transactions').select(`
      *,
      project:projects(*),
      milestone:milestones(*)
    `)
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  createTransaction: async (transactionData) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()
    return { data, error }
  }
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your-supabase-url' && 
    supabaseAnonKey !== 'your-supabase-anon-key')
}
