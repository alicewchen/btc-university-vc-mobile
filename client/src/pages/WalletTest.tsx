import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3, SUPPORTED_CHAINS, SOLANA_NETWORKS } from "@/contexts/Web3Context";
import WalletConnection from "@/components/WalletConnection";
import { 
  Wallet, 
  Network, 
  Coins, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";

export default function WalletTest() {
  const { 
    isConnected, 
    address, 
    balance, 
    chainId, 
    isConnecting,
    walletType,
    networkName,
    switchNetwork,
    switchSolanaNetwork,
    getBalance
  } = useWeb3();

  const getCurrentChainInfo = () => {
    if (walletType === 'solana') {
      return { name: networkName || 'Solana Network' };
    }
    if (!chainId) return null;
    return SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchNetwork(targetChainId);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const handleSwitchSolanaNetwork = async (network: 'mainnet-beta' | 'devnet' | 'testnet') => {
    try {
      await switchSolanaNetwork(network);
    } catch (error) {
      console.error('Failed to switch Solana network:', error);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      await getBalance();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wallet Integration Test</h1>
          <p className="text-xl text-gray-600">
            Test MetaMask and WalletConnect integration for Bitcoin University
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Wallet Connection Variants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-bitcoin-orange" />
                  Default Wallet Component
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WalletConnection variant="default" showBalance={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-blue-600" />
                  Compact Variant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">With Balance:</h4>
                    <WalletConnection variant="compact" showBalance={true} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Without Balance:</h4>
                    <WalletConnection variant="compact" showBalance={false} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Button Only Variant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Default Size:</h4>
                    <WalletConnection variant="button-only" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Full Width:</h4>
                    <WalletConnection variant="button-only" className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Wallet Status and Features */}
          <div className="space-y-6">
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
                      {isConnected ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Not Connected
                        </>
                      )}
                    </Badge>
                  </div>

                  {isConnected && address && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Address:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {`${address.slice(0, 6)}...${address.slice(-4)}`}
                          </code>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Balance:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{balance || 'Loading...'}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={handleRefreshBalance}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Network:</span>
                        <div className="flex items-center gap-2">
                          <Network className="w-4 h-4" />
                          <span className="text-sm">
                            {getCurrentChainInfo()?.name || `Chain ${chainId}`}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {isConnecting && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Connecting...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Network Switching */}
            {isConnected && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="w-5 h-5 mr-2 text-purple-600" />
                    Network Switching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {walletType === 'ethereum' && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Ethereum Networks
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(SUPPORTED_CHAINS).map(([id, chain]) => (
                            <Button
                              key={id}
                              variant={chainId === parseInt(id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSwitchNetwork(parseInt(id))}
                              disabled={chainId === parseInt(id)}
                              className="justify-start"
                            >
                              <Network className="w-4 h-4 mr-2" />
                              {chain.name}
                              {chainId === parseInt(id) && (
                                <CheckCircle className="w-4 h-4 ml-auto text-green-500" />
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {walletType === 'solana' && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Solana Networks
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(SOLANA_NETWORKS).map(([id, network]) => (
                            <Button
                              key={id}
                              variant={networkName === network.name ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSwitchSolanaNetwork(id as 'mainnet-beta' | 'devnet' | 'testnet')}
                              disabled={networkName === network.name}
                              className="justify-start"
                            >
                              <Network className="w-4 h-4 mr-2" />
                              {network.name}
                              {networkName === network.name && (
                                <CheckCircle className="w-4 h-4 ml-auto text-green-500" />
                              )}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Note: Actual network switching is managed through your Solana wallet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Web3 Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">MetaMask Integration</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">WalletConnect Support</span>
                    </div>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Mock
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Phantom Wallet</span>
                    </div>
                    <Badge variant="outline" className="text-purple-700 border-purple-300">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Solflare Wallet</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Multi-Chain Support</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Balance Fetching</span>
                    </div>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">For MetaMask:</h4>
                    <p className="text-gray-600">
                      Make sure you have the MetaMask browser extension installed and unlocked.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">For Phantom Wallet:</h4>
                    <p className="text-gray-600">
                      Install the Phantom browser extension for Solana. Click the Phantom option to connect.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">For Solflare Wallet:</h4>
                    <p className="text-gray-600">
                      Install the Solflare browser extension for Solana. Click the Solflare option to connect.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Multi-Chain Support:</h4>
                    <p className="text-gray-600">
                      The platform supports both Ethereum (MetaMask, WalletConnect) and Solana (Phantom, Solflare) ecosystems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}