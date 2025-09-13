import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthMock';
import { useWallet } from '../hooks/useWallet';
import { 
  Wallet, 
  Menu, 
  X, 
  Home, 
  FolderOpen, 
  Plus, 
  User,
  Info,
  LogOut,
  LogIn,
  UserCheck
} from 'lucide-react';

const Navbar = () => {
  const { 
    isAuthenticated, 
    userProfile, 
    signOut 
  } = useAuth();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, requireAuth: true },
    { name: 'Projects', href: '/projects', icon: FolderOpen, requireAuth: true },
    { name: 'Create Project', href: '/projects/create', icon: Plus, requireAuth: true, requireRole: 'manager' },
    { name: 'Profile', href: '/profile', icon: User, requireAuth: true },
    { name: 'About', href: '/about', icon: Info, requireAuth: false },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };


  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">BlockFund</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation
              .filter(item => !item.requireAuth || isAuthenticated)
              .filter(item => !item.requireRole || userProfile?.role === item.requireRole)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </div>

          {/* Authentication and Wallet */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {userProfile?.full_name || userProfile?.email}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userProfile?.role}
                  </div>
                  {account && (
                    <div className="text-xs text-gray-500 font-mono">
                      {formatAddress(account)}
                    </div>
                  )}
                </div>

                {/* Wallet Connection */}
                {account ? (
                  <button
                    onClick={disconnectWallet}
                    className="btn-secondary text-sm"
                  >
                    Disconnect Wallet
                  </button>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation
                .filter(item => !item.requireAuth || isAuthenticated)
                .filter(item => !item.requireRole || userProfile?.role === item.requireRole)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              
              {/* Mobile auth and wallet buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">
                        {userProfile?.full_name || userProfile?.email}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {userProfile?.role}
                      </div>
                      {account && (
                        <div className="text-xs text-gray-500 font-mono mt-1">
                          {formatAddress(account)}
                        </div>
                      )}
                    </div>
                    
                    {account ? (
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setIsMenuOpen(false);
                        }}
                        className="w-full btn-secondary text-sm mx-3"
                      >
                        Disconnect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          connectWallet();
                          setIsMenuOpen(false);
                        }}
                        disabled={isConnecting}
                        className="w-full btn-primary flex items-center justify-center space-x-2 text-sm mx-3"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full btn-secondary text-sm mx-3 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
