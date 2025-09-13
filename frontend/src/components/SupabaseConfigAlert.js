import React from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'

const SupabaseConfigAlert = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Configuration Required
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Supabase is not properly configured. Please set up your environment variables:
            </p>
            
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Required Environment Variables:</h3>
              <div className="space-y-2 text-sm font-mono">
                <div>REACT_APP_SUPABASE_URL=your-supabase-url</div>
                <div>REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Steps to configure:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500 inline-flex items-center">
                  supabase.com <ExternalLink className="h-3 w-3 ml-1" />
                </a></li>
                <li>Get your project URL and anon key from the API settings</li>
                <li>Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in the frontend directory</li>
                <li>Add the environment variables to the <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Database Schema Required:</h4>
              <p className="text-sm text-blue-700">
                You'll also need to create the database tables for users, projects, milestones, and transactions.
                Check the documentation for the complete schema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupabaseConfigAlert
