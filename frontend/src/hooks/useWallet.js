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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Get current account and chain info
  const getAccountInfo = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0];
        const balance = await provider.getBalance(account.address);
        const network = await provider.getNetwork();
        
        setAccount(account.address);
        setBalance(ethers.formatEther(balance));
        setChainId(network.chainId.toString());
        setIsConnected(true);
        setProvider(provider);
        setSigner(await provider.getSigner());
        
        return {
          address: account.address,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString()
        };
      }
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('Please install MetaMask to continue');
      return false;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const accountInfo = await getAccountInfo();
      
      // Check if we're on the correct network (localhost for development)
      const expectedChainId = process.env.REACT_APP_CHAIN_ID || '1337';
      if (accountInfo.chainId !== expectedChainId) {
        toast.error(`Please switch to the correct network (Chain ID: ${expectedChainId})`);
        return false;
      }
      
      toast.success(`Connected to ${accountInfo.address.slice(0, 6)}...${accountInfo.address.slice(-4)}`);
      return true;
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      if (error.code === 4001) {
        toast.error('Please connect your MetaMask wallet');
      } else if (error.code === -32002) {
        toast.error('Connection request already pending');
      } else {
        toast.error('Failed to connect wallet');
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
    setProvider(null);
    setSigner(null);
    toast.success('Wallet disconnected');
  };

  // Switch network
  const switchNetwork = async (chainId) => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(chainId).toString(16)}`,
              chainName: 'Localhost',
              rpcUrls: ['http://localhost:8545'],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add network');
          return false;
        }
      } else {
        toast.error('Failed to switch network');
        return false;
      }
    }
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (!isConnected || !provider) return;
    
    try {
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        getAccountInfo();
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(chainId);
      getAccountInfo();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    getAccountInfo().catch(() => {
      // Not connected, that's fine
    });

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account]);

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [isConnected, provider, account]);

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    isMetaMaskInstalled
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
