
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectTimestamp, setDisconnectTimestamp] = useState(null);
  const [manuallyDisconnected, setManuallyDisconnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Check if MetaMask is locked
  const isMetaMaskLocked = async () => {
    if (!isMetaMaskInstalled()) return false;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length === 0;
    } catch (error) {
      return true;
    }
  };

  // Get MetaMask status for debugging
  const getMetaMaskStatus = async () => {
    const status = {
      installed: isMetaMaskInstalled(),
      locked: false,
      accounts: [],
      network: null,
      error: null
    };

    if (!status.installed) {
      status.error = 'MetaMask not installed';
      return status;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      status.accounts = accounts;
      status.locked = accounts.length === 0;

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        status.network = {
          chainId: network.chainId.toString(),
          name: network.name
        };
      }
    } catch (error) {
      status.error = error.message;
    }

    return status;
  };

  // Check if Hardhat network is running
  const checkHardhatNetwork = async () => {
    try {
      const response = await fetch('http://localhost:8545', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result === '0x539'; // 1337 in hex
      }
      return false;
    } catch (error) {
      console.log('Hardhat network not running:', error.message);
      return false;
    }
  };

  // Get current account and chain info
  const getAccountInfo = async (isManualConnection = false) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      console.log('Getting account info, isManualConnection:', isManualConnection);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      console.log('Found accounts:', accounts.length, accounts.map(a => a.address));
      
      if (accounts.length > 0) {
        const account = accounts[0];
        const balance = await provider.getBalance(account.address);
        const network = await provider.getNetwork();
        
        const formattedBalance = ethers.formatEther(balance);
        
        setAccount(account.address);
        setBalance(formattedBalance);
        setChainId(network.chainId.toString());
        setIsConnected(true);
        setProvider(provider);
        setSigner(await provider.getSigner());
        setDisconnectTimestamp(null);
        setManuallyDisconnected(false);
        
        console.log('Wallet connected:', {
          address: account.address,
          balance: formattedBalance,
          chainId: network.chainId.toString()
        });
        
        return {
          address: account.address,
          balance: formattedBalance,
          chainId: network.chainId.toString()
        };
      } else {
        // No accounts connected - reset state
        setAccount(null);
        setBalance('0');
        setChainId(null);
        setIsConnected(false);
        setProvider(null);
        setSigner(null);
        setDisconnectTimestamp(Date.now());
        
        // Only set manuallyDisconnected if this is not a manual connection attempt
        if (!isManualConnection) {
          setManuallyDisconnected(true);
        }
        
        console.log('No wallet accounts found - state reset');
        
        return null;
      }
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  };

  // Reset MetaMask connection (helper function)
  const resetMetaMaskConnection = async () => {
    try {
      // Try to clear any pending requests
      if (window.ethereum && window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners();
      }
      
      // Clear any stored connection data
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAccount');
      
      // Reset all state
      setAccount(null);
      setBalance('0');
      setChainId(null);
      setIsConnected(false);
      setProvider(null);
      setSigner(null);
      setManuallyDisconnected(true);
      setDisconnectTimestamp(Date.now());
      
      toast.success('MetaMask connection reset. Please try connecting again.');
      return true;
    } catch (error) {
      console.error('Error resetting MetaMask connection:', error);
      toast.error('Error resetting connection');
      return false;
    }
  };

  // Manual network addition helper
  const addHardhatNetworkManually = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      return false;
    }

    try {
      const networkParams = {
        chainId: '0x539', // 1337 in hex
        chainName: 'Hardhat Local',
        rpcUrls: ['http://localhost:8545', 'http://127.0.0.1:8545'],
        nativeCurrency: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: null,
      };
      
      console.log('Manually adding Hardhat network...');
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      });
      
      toast.success('Hardhat network added successfully!');
      return true;
    } catch (error) {
      console.error('Error manually adding network:', error);
      if (error.code === 4001) {
        toast.error('Network addition rejected by user');
      } else {
        toast.error(`Failed to add network: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  };

  // Force reset MetaMask state (more aggressive approach)
  const forceResetMetaMask = async () => {
    try {
      console.log('Force resetting MetaMask state...');
      
      // Clear all event listeners
      if (window.ethereum) {
        if (window.ethereum.removeAllListeners) {
          window.ethereum.removeAllListeners();
        }
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', () => {});
          window.ethereum.removeListener('chainChanged', () => {});
        }
      }
      
      // Clear all localStorage related to wallet/MetaMask
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('wallet') || key.includes('metamask') || key.includes('ethereum') || key.includes('web3'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        console.log('Removing localStorage key:', key);
        localStorage.removeItem(key);
      });
      
      // Clear sessionStorage as well
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('wallet') || key.includes('metamask') || key.includes('ethereum') || key.includes('web3'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => {
        console.log('Removing sessionStorage key:', key);
        sessionStorage.removeItem(key);
      });
      
      // Reset all state
      setAccount(null);
      setBalance('0');
      setChainId(null);
      setIsConnected(false);
      setProvider(null);
      setSigner(null);
      setManuallyDisconnected(true);
      setDisconnectTimestamp(Date.now());
      setIsConnecting(false);
      setIsDisconnecting(false);
      
      // Wait a moment for state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('MetaMask state reset complete');
      toast.success('MetaMask state completely reset. You can now try connecting again.');
      return true;
    } catch (error) {
      console.error('Error force resetting MetaMask:', error);
      toast.error('Error force resetting MetaMask');
      return false;
    }
  };

  // Connect to MetaMask
  const connectWallet = async (retryCount = 0) => {
    // Enhanced MetaMask detection
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask extension and refresh the page.');
      return false;
    }

    // Check if MetaMask is locked
    const isLocked = await isMetaMaskLocked();
    if (isLocked) {
      toast.error('MetaMask is locked. Please unlock your MetaMask wallet and try again.');
      return false;
    }

    // Check if Hardhat network is running
    const isHardhatRunning = await checkHardhatNetwork();
    if (!isHardhatRunning) {
      toast.error('Hardhat network is not running. Please start it with: npx hardhat node');
      return false;
    }

    // Reset manually disconnected flag when user explicitly tries to connect
    setManuallyDisconnected(false);
    setIsConnecting(true);
    
    // Add delay to prevent circuit breaker issues
    const delay = retryCount === 0 ? 100 : 3000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // First check if we already have accounts
      console.log('Checking existing accounts...');
      const existingAccounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Existing accounts:', existingAccounts);
      
      let accounts;
      if (existingAccounts.length > 0) {
        // Use existing accounts
        accounts = existingAccounts;
        console.log('Using existing accounts:', accounts);
      } else {
        // Request account access
        console.log('Requesting account access...');
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Account access granted, accounts:', accounts);
      }
      
      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please unlock your MetaMask wallet.');
        return false;
      }
      
      const accountInfo = await getAccountInfo(true);
      
      // Check if accountInfo is null (no accounts found)
      if (!accountInfo) {
        toast.error('No wallet accounts found. Please connect your wallet in MetaMask.');
        return false;
      }
      
      // Check if we're on the correct network (localhost for development)
      const expectedChainId = process.env.REACT_APP_CHAIN_ID || '1337';
      console.log('Checking network, current:', accountInfo.chainId, 'expected:', expectedChainId);
      
      if (accountInfo.chainId !== expectedChainId) {
        // Try to switch to the correct network automatically
        console.log('Network mismatch, attempting to switch...');
        toast('Switching to the correct network...', { icon: 'ℹ️' });
        const networkSwitched = await switchNetwork(expectedChainId);
        
        if (!networkSwitched) {
          console.log('Network switch failed, but continuing with connection...');
          toast(`Connected but on wrong network. Please manually switch to Chain ID: ${expectedChainId} in MetaMask`, { icon: '⚠️' });
          // Don't return false, continue with connection
        } else {
          // Get account info again after network switch
          const updatedAccountInfo = await getAccountInfo(true);
          if (!updatedAccountInfo) {
            console.log('Failed to get account info after network switch');
            toast.error('Failed to get account info after network switch');
            return false;
          }
          console.log('Network switch successful, updated chain ID:', updatedAccountInfo.chainId);
        }
      }
      
      toast.success(`Connected to ${accountInfo.address.slice(0, 6)}...${accountInfo.address.slice(-4)}`);
      return true;
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Handle specific error codes
      if (error.code === 4001) {
        toast.error('Connection rejected by user. Please try again and approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        toast.error('Connection request already pending. Please check your MetaMask popup.');
      } else if (error.code === -32603) {
        if (error.message && error.message.includes('circuit breaker')) {
          if (retryCount < 2) {
            toast.error(`MetaMask circuit breaker is open. Retrying in 3 seconds... (${retryCount + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return connectWallet(retryCount + 1);
          } else {
            toast.error('MetaMask circuit breaker is open. Please refresh the page and try again.');
          }
        } else {
          toast.error('MetaMask internal error. Please refresh the page and try again.');
        }
      } else if (error.code === -32601) {
        toast.error('MetaMask method not found. Please update MetaMask to the latest version.');
      } else if (error.code === -32700) {
        toast.error('Invalid JSON request to MetaMask. Please refresh the page and try again.');
      } else if (error.message && error.message.includes('User rejected')) {
        toast.error('Connection rejected by user. Please try again and approve the connection.');
      } else if (error.message && error.message.includes('circuit breaker')) {
        if (retryCount < 2) {
          toast.error(`MetaMask is temporarily blocked. Retrying in 3 seconds... (${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          return connectWallet(retryCount + 1);
        } else {
          toast.error('MetaMask is temporarily blocked. Please refresh the page and try again.');
        }
      } else if (error.message && error.message.includes('Already processing')) {
        toast.error('MetaMask is already processing a request. Please wait and try again.');
      } else if (error.message && error.message.includes('Non-Error promise rejection')) {
        toast.error('MetaMask connection failed. Please refresh the page and try again.');
      } else {
        // Generic error handling
        const errorMessage = error.message || 'Unknown error';
        toast.error(`Failed to connect wallet: ${errorMessage}`);
        
        // Provide additional guidance for common issues
        if (errorMessage.includes('connect') || errorMessage.includes('MetaMask')) {
          toast.error('Please ensure MetaMask is unlocked and try again.', {
            duration: 5000
          });
        }
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async (skipConfirmation = false) => {
    // Show confirmation dialog unless skipped
    if (!skipConfirmation) {
      const confirmed = window.confirm(
        'Are you sure you want to disconnect your wallet? This will remove your wallet connection and you\'ll need to reconnect to perform transactions.'
      );
      
      if (!confirmed) {
        return;
      }
    }
    
    setIsDisconnecting(true);
    
    try {
      // Clear all wallet state
      setAccount(null);
      setBalance('0');
      setChainId(null);
      setIsConnected(false);
      setProvider(null);
      setSigner(null);
      setDisconnectTimestamp(Date.now());
      setManuallyDisconnected(true);
      
      // Clear any stored wallet data from localStorage
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAccount');
      
      // Small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Show success message
      toast.success('Wallet disconnected successfully');
      
      console.log('Wallet disconnected and state cleared', {
        account: null,
        isConnected: false,
        manuallyDisconnected: true,
        disconnectTimestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Error disconnecting wallet');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Switch network
  const switchNetwork = async (chainId) => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      return false;
    }

    try {
      console.log('Switching to network:', chainId);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
      console.log('Network switch successful');
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      console.error('Network switch error details:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
      
      if (error.code === 4902) {
        // Network not added, try to add it
        console.log('Network not found, attempting to add it...');
        try {
          const networkParams = {
            chainId: `0x${parseInt(chainId).toString(16)}`,
            chainName: 'Hardhat Local',
            rpcUrls: ['http://localhost:8545', 'http://127.0.0.1:8545'],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: null, // No block explorer for local network
          };
          
          console.log('Adding network with params:', networkParams);
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
          console.log('Network added successfully');
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          console.error('Add network error details:', {
            code: addError.code,
            message: addError.message,
            name: addError.name
          });
          
          if (addError.code === 4001) {
            toast.error('Network addition rejected by user');
          } else if (addError.code === -32602) {
            toast.error('Invalid network parameters');
          } else {
            toast.error(`Failed to add network: ${addError.message || 'Unknown error'}`);
          }
          return false;
        }
      } else if (error.code === 4001) {
        // User rejected the request
        console.log('User rejected network switch');
        toast.error('Network switch rejected by user');
        return false;
      } else {
        console.log('Unknown network switch error');
        toast.error('Failed to switch network');
        return false;
      }
    }
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (!isConnected || !provider || !account) return;
    
    try {
      const balance = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balance);
      setBalance(formattedBalance);
      console.log('Balance refreshed:', formattedBalance, 'ETH');
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // Auto-disconnect without confirmation when user disconnects in MetaMask
        disconnectWallet(true);
      } else if (accounts[0] !== account && !manuallyDisconnected) {
        console.log('Account changed, updating info...');
        getAccountInfo();
      }
    };

    const handleChainChanged = (chainId) => {
      console.log('Chain changed, updating info...');
      setChainId(chainId);
      if (!manuallyDisconnected) {
        getAccountInfo();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected (only if not manually disconnected)
    if (!manuallyDisconnected) {
      console.log('Auto-checking wallet connection...');
      getAccountInfo().catch((error) => {
        console.log('No wallet connected initially:', error.message);
        // Not connected, that's fine
      });
    } else {
      console.log('Skipping auto-connection check - wallet was manually disconnected');
    }

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [manuallyDisconnected]); // Changed dependency from [account] to [manuallyDisconnected]

  // Auto-refresh balance every 15 seconds for better UX
  useEffect(() => {
    if (!isConnected || !provider || !account) return;

    const interval = setInterval(refreshBalance, 15000);
    return () => clearInterval(interval);
  }, [isConnected, provider, account]);

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    isDisconnecting,
    disconnectTimestamp,
    manuallyDisconnected,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    resetMetaMaskConnection,
    forceResetMetaMask,
    addHardhatNetworkManually,
    isMetaMaskInstalled,
    getMetaMaskStatus
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
