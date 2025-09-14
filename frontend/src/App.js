import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuthMock';
import { WalletProvider } from './hooks/useWallet';
import { ContractProvider } from './hooks/useContract';
import { ProjectProvider } from './contexts/ProjectContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthDebug from './components/AuthDebug';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import About from './pages/About';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <WalletProvider>
        <ContractProvider>
          <ProjectProvider>
            <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <AuthDebug />
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    isAuthenticated ? (
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    ) : (
                      <Login />
                    )
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects/create" element={
                    <ProtectedRoute requiredRoles={['manager']}>
                      <CreateProject />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects/:id" element={
                    <ProtectedRoute>
                      <ProjectDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              
              <Footer />
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
            </Router>
          </ProjectProvider>
        </ContractProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
