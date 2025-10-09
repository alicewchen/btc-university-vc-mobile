import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import ContractService from '@/lib/contracts';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    phantom?: { solana?: any };
    solflare?: any;
  }
}

interface Web3State {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
  walletType: 'ethereum' | 'solana' | null;
  networkName: string | null;
}

interface Web3ContextType extends Web3State {
  connectWallet: (walletType?: 'metamask' | 'walletconnect' | 'phantom' | 'solflare') => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  switchSolanaNetwork: (network: 'mainnet-beta' | 'devnet' | 'testnet') => Promise<void>;
  getBalance: () => Promise<void>;
  contractService: ContractService | null;
  provider: BrowserProvider | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum Mainnet', rpcUrl: 'https://eth.llamarpc.com' },
  5: { name: 'Goerli Testnet', rpcUrl: 'https://goerli.llamarpc.com' },
  11155111: { name: 'Sepolia Testnet', rpcUrl: 'https://sepolia.llamarpc.com' },
  137: { name: 'Polygon Mainnet', rpcUrl: 'https://polygon.llamarpc.com' },
  80001: { name: 'Mumbai Testnet', rpcUrl: 'https://mumbai.llamarpc.com' }
};

const SOLANA_NETWORKS = {
  'mainnet-beta': { name: 'Solana Mainnet', rpcUrl: 'https://api.mainnet-beta.solana.com' },
  'devnet': { name: 'Solana Devnet', rpcUrl: 'https://api.devnet.solana.com' },
  'testnet': { name: 'Solana Testnet', rpcUrl: 'https://api.testnet.solana.com' }
};

export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    error: null,
    walletType: null,
    networkName: null
  });

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contractService, setContractService] = useState<ContractService | null>(null);

  // Check if wallets are available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  const isPhantomAvailable = () => {
    return typeof window !== 'undefined' && (typeof window.solana !== 'undefined' || typeof window.phantom?.solana !== 'undefined');
  };

  const isSolflareAvailable = () => {
    return typeof window !== 'undefined' && typeof window.solflare !== 'undefined';
  };

  const getSolanaProvider = () => {
    if (window.phantom?.solana) return window.phantom.solana;
    if (window.solana) return window.solana;
    return null;
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format balance
  const formatBalance = (balance: string) => {
    const balanceInEth = parseFloat(balance) / Math.pow(10, 18);
    return balanceInEth.toFixed(4);
  };

  // Get user's balance (ETH or SOL)
  const getBalance = async () => {
    if (!state.address) return;

    try {
      if (state.walletType === 'ethereum' && window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [state.address, 'latest']
        });
        
        const formattedBalance = formatBalance(parseInt(balance, 16).toString());
        setState(prev => ({ ...prev, balance: `${formattedBalance} ETH` }));
      } else if (state.walletType === 'solana') {
        // For Solana, we'll mock the balance for now since it requires RPC connection
        const mockBalance = (Math.random() * 10).toFixed(4);
        setState(prev => ({ ...prev, balance: `${mockBalance} SOL` }));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!isMetaMaskAvailable()) {
      throw new Error('MetaMask is not installed. Please install MetaMask browser extension.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const parsedChainId = parseInt(chainId, 16);
      const networkName = SUPPORTED_CHAINS[parsedChainId as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${parsedChainId}`;

      setState(prev => ({
        ...prev,
        isConnected: true,
        address: accounts[0],
        chainId: parsedChainId,
        walletType: 'ethereum',
        networkName,
        error: null
      }));

      // Initialize provider and contract service
      const web3Provider = new BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      setContractService(new ContractService(web3Provider, parsedChainId));
      
      // Get balance after a short delay to ensure state is updated
      setTimeout(async () => {
        try {
          await getBalance();
        } catch (balanceError) {
          console.error('Error fetching balance:', balanceError);
        }
      }, 100);

    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      
      let errorMessage = 'Failed to connect to MetaMask';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is already processing a request. Please wait and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Connect to Phantom wallet
  const connectPhantom = async () => {
    const provider = getSolanaProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet is not installed. Please install Phantom browser extension.');
    }

    try {
      const response = await provider.connect();
      const address = response.publicKey.toString();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: address,
        chainId: null,
        walletType: 'solana',
        networkName: 'Solana Mainnet',
        error: null
      }));

      // Get balance
      await getBalance();

    } catch (error: any) {
      console.error('Phantom connection error:', error);
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error(error.message || 'Failed to connect to Phantom wallet');
    }
  };

  // Connect to Solflare wallet
  const connectSolflare = async () => {
    if (!isSolflareAvailable()) {
      throw new Error('Solflare wallet is not installed. Please install Solflare browser extension.');
    }

    try {
      const response = await window.solflare.connect();
      const address = response.publicKey.toString();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: address,
        chainId: null,
        walletType: 'solana',
        networkName: 'Solana Mainnet',
        error: null
      }));

      // Get balance
      await getBalance();

    } catch (error: any) {
      console.error('Solflare connection error:', error);
      throw new Error(error.message || 'Failed to connect to Solflare wallet');
    }
  };

  // Connect to WalletConnect (mock implementation for now)
  const connectWalletConnect = async () => {
    // For now, we'll simulate WalletConnect connection
    // In production, this would use WalletConnect SDK
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const mockBalance = (Math.random() * 10).toFixed(4);
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: mockAddress,
        balance: `${mockBalance} ETH`,
        chainId: 1,
        walletType: 'ethereum',
        networkName: 'Ethereum Mainnet',
        error: null
      }));
      
    } catch (error: any) {
      console.error('WalletConnect connection error:', error);
      throw new Error('Failed to connect via WalletConnect');
    }
  };

  // Main connect function
  const connectWallet = async (walletType: 'metamask' | 'walletconnect' | 'phantom' | 'solflare' = 'metamask') => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (walletType === 'metamask') {
        await connectMetaMask();
      } else if (walletType === 'walletconnect') {
        await connectWalletConnect();
      } else if (walletType === 'phantom') {
        await connectPhantom();
      } else if (walletType === 'solflare') {
        await connectSolflare();
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // Clear test wallet in development mode
      if (import.meta.env.MODE === 'development') {
        localStorage.removeItem('test-wallet-address');
        localStorage.removeItem('test-user-data');
      }

      // Disconnect Solana wallets
      if (state.walletType === 'solana') {
        const provider = getSolanaProvider();
        if (provider && provider.disconnect) {
          await provider.disconnect();
        }
        if (window.solflare && window.solflare.disconnect) {
          await window.solflare.disconnect();
        }
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }

    setState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      isConnecting: false,
      error: null,
      walletType: null,
      networkName: null
    });
    
    setProvider(null);
    setContractService(null);
  };

  // Switch Ethereum network
  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (error: any) {
      // If network doesn't exist, try to add it
      if (error.code === 4902) {
        const chainInfo = SUPPORTED_CHAINS[targetChainId as keyof typeof SUPPORTED_CHAINS];
        if (chainInfo) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chainInfo.name,
              rpcUrls: [chainInfo.rpcUrl]
            }]
          });
        }
      } else {
        throw error;
      }
    }
  };

  // Switch Solana network
  const switchSolanaNetwork = async (network: 'mainnet-beta' | 'devnet' | 'testnet') => {
    if (state.walletType !== 'solana') {
      throw new Error('Not connected to a Solana wallet');
    }

    // Note: Network switching for Solana wallets is usually done in the wallet UI
    // This is a placeholder for future implementation
    setState(prev => ({
      ...prev,
      networkName: SOLANA_NETWORKS[network].name
    }));
  };

  // Listen for account and network changes
  useEffect(() => {
    // Ethereum event listeners
    if (window.ethereum && state.walletType === 'ethereum') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setState(prev => ({ ...prev, address: accounts[0] }));
          getBalance();
        }
      };

      const handleChainChanged = (chainId: string) => {
        const parsedChainId = parseInt(chainId, 16);
        setState(prev => ({ 
          ...prev, 
          chainId: parsedChainId,
          networkName: SUPPORTED_CHAINS[parsedChainId as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${parsedChainId}`
        }));
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }

    // Solana event listeners
    if (state.walletType === 'solana') {
      const provider = getSolanaProvider();
      if (provider) {
        const handleAccountChanged = (publicKey: any) => {
          if (publicKey) {
            setState(prev => ({ ...prev, address: publicKey.toString() }));
            getBalance();
          } else {
            disconnectWallet();
          }
        };

        const handleDisconnect = () => {
          disconnectWallet();
        };

        provider.on('accountChanged', handleAccountChanged);
        provider.on('disconnect', handleDisconnect);

        return () => {
          provider.removeListener('accountChanged', handleAccountChanged);
          provider.removeListener('disconnect', handleDisconnect);
        };
      }
    }
  }, [state.walletType]);

  // Check for existing connections on mount
  useEffect(() => {
    const checkConnections = async () => {
      // Check for test wallet in development mode first
      if (import.meta.env.MODE === 'development') {
        const testWalletAddress = localStorage.getItem('test-wallet-address');
        const testUserData = localStorage.getItem('test-user-data');
        
        if (testWalletAddress && testUserData) {
          const userData = JSON.parse(testUserData);
          console.log('🧪 Test wallet detected:', testWalletAddress);
          
          setState(prev => ({
            ...prev,
            isConnected: true,
            address: testWalletAddress,
            balance: `${userData.balance} ETH`,
            chainId: 1337, // Local development chain
            walletType: 'ethereum',
            networkName: 'Test Network'
          }));
          return; // Exit early if test wallet is active
        }
      }

      // Check Ethereum connection
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId'
            });

            setState(prev => ({
              ...prev,
              isConnected: true,
              address: accounts[0],
              chainId: parseInt(chainId, 16),
              walletType: 'ethereum',
              networkName: SUPPORTED_CHAINS[parseInt(chainId, 16) as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${parseInt(chainId, 16)}`
            }));

            await getBalance();
            return; // Exit early if Ethereum is connected
          }
        } catch (error) {
          console.error('Error checking Ethereum connection:', error);
        }
      }

      // Check Solana connection
      const solanaProvider = getSolanaProvider();
      if (solanaProvider) {
        try {
          if (solanaProvider.isConnected) {
            const publicKey = solanaProvider.publicKey;
            if (publicKey) {
              setState(prev => ({
                ...prev,
                isConnected: true,
                address: publicKey.toString(),
                chainId: null,
                walletType: 'solana',
                networkName: 'Solana Mainnet'
              }));

              await getBalance();
            }
          }
        } catch (error) {
          console.error('Error checking Solana connection:', error);
        }
      }
    };

    checkConnections();
  }, []);

  const value: Web3ContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    switchSolanaNetwork,
    getBalance,
    contractService,
    provider
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export { SUPPORTED_CHAINS, SOLANA_NETWORKS };