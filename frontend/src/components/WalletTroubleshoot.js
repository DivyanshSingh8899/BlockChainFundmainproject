import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { AlertTriangle, RefreshCw, Wifi, Settings } from 'lucide-react';

const WalletTroubleshoot = () => {
  const { forceResetMetaMask, addHardhatNetworkManually, checkHardhatNetwork } = useWallet();
  const [isResetting, setIsResetting] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);
  const [hardhatStatus, setHardhatStatus] = useState(null);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await forceResetMetaMask();
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddNetwork = async () => {
    setIsAddingNetwork(true);
    try {
      await addHardhatNetworkManually();
    } finally {
      setIsAddingNetwork(false);
    }
  };

  const checkHardhat = async () => {
    try {
      const isRunning = await checkHardhatNetwork();
      setHardhatStatus(isRunning ? 'running' : 'stopped');
    } catch (error) {
      setHardhatStatus('error');
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Wallet Connection Issues?
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            If you're experiencing connection problems, try these solutions:
          </p>
          
          <div className="space-y-2">
            {/* Hardhat Status Check */}
            <div className="flex items-center space-x-2">
              <button
                onClick={checkHardhat}
                className="flex items-center space-x-1 text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
              >
                <Wifi className="w-3 h-3" />
                <span>Check Hardhat</span>
              </button>
              {hardhatStatus && (
                <span className={`text-xs px-2 py-1 rounded ${
                  hardhatStatus === 'running' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {hardhatStatus === 'running' ? 'Running' : 'Not Running'}
                </span>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center space-x-1 text-xs px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Connection'}</span>
            </button>

            {/* Add Network Button */}
            <button
              onClick={handleAddNetwork}
              disabled={isAddingNetwork}
              className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              <Settings className="w-3 h-3" />
              <span>{isAddingNetwork ? 'Adding...' : 'Add Network'}</span>
            </button>
          </div>

          <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
            <p><strong>Still having issues?</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Make sure Hardhat is running: <code>npx hardhat node</code></li>
              <li>Refresh the page after resetting</li>
              <li>Try disconnecting and reconnecting in MetaMask</li>
              <li>Check if MetaMask is unlocked</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTroubleshoot;
