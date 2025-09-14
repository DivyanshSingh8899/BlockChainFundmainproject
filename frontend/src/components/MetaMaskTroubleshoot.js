import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const MetaMaskTroubleshoot = () => {
  const { getMetaMaskStatus, isMetaMaskInstalled } = useWallet();
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const metaMaskStatus = await getMetaMaskStatus();
      setStatus(metaMaskStatus);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-500';
    if (status.error) return 'text-red-500';
    if (status.installed && !status.locked) return 'text-green-500';
    if (status.installed && status.locked) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStatusIcon = (status) => {
    if (!status) return '❓';
    if (status.error) return '❌';
    if (status.installed && !status.locked) return '✅';
    if (status.installed && status.locked) return '🔒';
    return '❓';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        MetaMask Troubleshooting
      </h3>
      
      <button
        onClick={checkStatus}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4"
      >
        {isLoading ? 'Checking...' : 'Check MetaMask Status'}
      </button>

      {status && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getStatusIcon(status)}</span>
            <span className={`font-medium ${getStatusColor(status)}`}>
              MetaMask Status
            </span>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Installed:</span>{' '}
                <span className={status.installed ? 'text-green-600' : 'text-red-600'}>
                  {status.installed ? 'Yes' : 'No'}
                </span>
              </div>
              
              {status.installed && (
                <>
                  <div>
                    <span className="font-medium">Locked:</span>{' '}
                    <span className={status.locked ? 'text-yellow-600' : 'text-green-600'}>
                      {status.locked ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Accounts:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-300">
                      {status.accounts.length}
                    </span>
                  </div>
                  
                  {status.network && (
                    <div>
                      <span className="font-medium">Network:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-300">
                        {status.network.name} (Chain ID: {status.network.chainId})
                      </span>
                    </div>
                  )}
                </>
              )}
              
              {status.error && (
                <div>
                  <span className="font-medium text-red-600">Error:</span>{' '}
                  <span className="text-red-600">{status.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Troubleshooting suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 text-sm">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Troubleshooting Tips:
            </h4>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200">
              {!status.installed && (
                <li>• Install MetaMask browser extension</li>
              )}
              {status.installed && status.locked && (
                <li>• Unlock your MetaMask wallet</li>
              )}
              {status.installed && !status.locked && status.accounts.length === 0 && (
                <li>• Create or import an account in MetaMask</li>
              )}
              {status.error && (
                <li>• Refresh the page and try again</li>
              )}
              <li>• Make sure you're on the correct network</li>
              <li>• Check if Hardhat node is running</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaMaskTroubleshoot;
