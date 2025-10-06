import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWeb3, SUPPORTED_CHAINS, SOLANA_NETWORKS } from '@/contexts/Web3Context';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  LogOut,
  Network,
  DollarSign
} from 'lucide-react';

interface WalletConnectionProps {
  variant?: 'default' | 'compact' | 'button-only';
  showBalance?: boolean;
  className?: string;
}

export default function WalletConnection({ 
  variant = 'default', 
  showBalance = true,
  className = '' 
}: WalletConnectionProps) {
  const { 
    isConnected, 
    address, 
    balance, 
    chainId, 
    isConnecting, 
    error,
    walletType,
    networkName,
    connectWallet, 
    disconnectWallet,
    switchNetwork,
    switchSolanaNetwork
  } = useWeb3();
  
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'walletconnect' | 'phantom' | 'solflare' | null>(null);

  const walletOptions = [
    {
      id: 'metamask' as const,
      name: 'MetaMask',
      icon: '🦊',
      available: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    },
    {
      id: 'phantom' as const,
      name: 'Phantom',
      icon: '👻',
      available: typeof window !== 'undefined' && (typeof window.solana !== 'undefined' || typeof window.phantom?.solana !== 'undefined')
    },
    {
      id: 'walletconnect' as const,
      name: 'WalletConnect',
      icon: '📱',
      available: true
    },
    {
      id: 'solflare' as const,
      name: 'Solflare',
      icon: '☀️',
      available: typeof window !== 'undefined' && typeof window.solflare !== 'undefined'
    }
  ];

  const handleConnect = async (walletType: 'metamask' | 'walletconnect' | 'phantom' | 'solflare') => {
    console.log('WalletConnection: Starting connection for', walletType);
    setSelectedWallet(walletType);
    
    try {
      console.log('WalletConnection: Calling connectWallet...');
      await connectWallet(walletType);
      console.log('WalletConnection: Connection successful');
      
      setIsOpen(false);
      
      const walletNames = {
        metamask: 'MetaMask',
        walletconnect: 'WalletConnect',
        phantom: 'Phantom',
        solflare: 'Solflare'
      };

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletNames[walletType]}`
      });
    } catch (error: any) {
      console.error('WalletConnection: Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSelectedWallet(null);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected"
    });
  };

  const getCurrentChainName = () => {
    if (walletType === 'solana') {
      return networkName || 'Solana Network';
    }
    if (!chainId) return 'Unknown Network';
    const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
    return chain ? chain.name : `Network ${chainId}`;
  };

  const isUnsupportedNetwork = () => {
    if (walletType === 'solana') return false; // Solana networks are managed differently
    return chainId && !SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Button-only variant
  if (variant === 'button-only') {
    if (isConnected && address) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Button variant="outline" onClick={handleCopyAddress} className="h-8">
            <Wallet className="w-4 h-4 mr-2" />
            {formatAddress(address)}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDisconnect} className="h-8 px-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className={`bg-bitcoin-orange hover:bg-bitcoin-orange/90 ${className}`}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {walletOptions.map((option) => (
              <Button 
                key={option.id}
                variant={selectedWallet === option.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  !option.available ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => option.available && handleConnect(option.id)}
                disabled={!option.available || isConnecting}
              >
                {selectedWallet === option.id && isConnecting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="text-2xl">{option.icon}</span>
                )}
                <div className="text-center">
                  <div className="font-medium text-sm">{option.name}</div>
                  {!option.available && (
                    <div className="text-xs text-red-500">Not Available</div>
                  )}
                </div>
              </Button>
            ))}
            
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    if (isConnected && address) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            {formatAddress(address)}
          </Badge>
          {showBalance && balance && (
            <Badge variant="outline">
              {balance}
            </Badge>
          )}
        </div>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {walletOptions.map((option) => (
              <Button 
                key={option.id}
                variant={selectedWallet === option.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  !option.available ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => option.available && handleConnect(option.id)}
                disabled={!option.available || isConnecting}
              >
                {selectedWallet === option.id && isConnecting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="text-2xl">{option.icon}</span>
                )}
                <div className="text-center">
                  <div className="font-medium text-sm">{option.name}</div>
                  {!option.available && (
                    <div className="text-xs text-red-500">Not Available</div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Default full card variant
  if (isConnected && address) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Wallet Connected
            </span>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Address:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono">{formatAddress(address)}</code>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {showBalance && balance && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance:</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-sm">{balance}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network:</span>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                <span className="text-sm">{getCurrentChainName()}</span>
                {isUnsupportedNetwork() && (
                  <Badge variant="destructive" className="text-xs">
                    Unsupported
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isUnsupportedNetwork() && walletType === 'ethereum' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Unsupported Network</p>
                  <p className="text-xs text-yellow-600">
                    Please switch to a supported network for full functionality.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => switchNetwork(1)}
              >
                Switch to Ethereum Mainnet
              </Button>
            </div>
          )}

          {walletType === 'solana' && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Solana Network</p>
                  <p className="text-xs text-purple-600">
                    Network switching is managed through your wallet interface
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Not connected state
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Connect your wallet to participate in DAO governance, vote on proposals, and manage your tokens.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {walletOptions.map((option) => (
            <Button 
              key={option.id}
              variant={selectedWallet === option.id ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                !option.available ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => option.available && handleConnect(option.id)}
              disabled={!option.available || isConnecting}
            >
              {selectedWallet === option.id && isConnecting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="text-2xl">{option.icon}</span>
              )}
              <div className="text-center">
                <div className="font-medium text-sm">{option.name}</div>
                {!option.available && (
                  <div className="text-xs text-red-500">Not Available</div>
                )}
              </div>
            </Button>
          ))}
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}