import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function MetaMaskDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { connectWallet, isConnected, address, error } = useWeb3();

  useEffect(() => {
    checkMetaMaskStatus();
  }, []);

  const checkMetaMaskStatus = () => {
    const info: any = {
      windowExists: typeof window !== 'undefined',
      ethereumExists: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
      isMetaMask: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      providerDetails: null
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      info.providerDetails = {
        isMetaMask: window.ethereum.isMetaMask,
        chainId: window.ethereum.chainId,
        networkVersion: window.ethereum.networkVersion,
        selectedAddress: window.ethereum.selectedAddress
      };
    }

    setDebugInfo(info);
  };

  const testDirectConnection = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Testing direct MetaMask connection...');
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      console.log('Direct connection successful:', accounts);
      alert(`Direct connection successful! Account: ${accounts[0]}`);
      
      checkMetaMaskStatus();
    } catch (error: any) {
      console.error('Direct connection failed:', error);
      alert(`Direct connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testContextConnection = async () => {
    setIsLoading(true);
    try {
      await connectWallet('metamask');
      alert('Context connection successful!');
    } catch (error: any) {
      alert(`Context connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MetaMask Debug</h1>
          <p className="text-xl text-gray-600">
            Debug MetaMask connection issues
          </p>
        </div>

        <div className="space-y-6">
          {/* Status Check */}
          <Card>
            <CardHeader>
              <CardTitle>MetaMask Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Window Object:</span>
                  {debugInfo.windowExists ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Not Available
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span>Ethereum Provider:</span>
                  {debugInfo.ethereumExists ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Detected
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Not Detected
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span>Is MetaMask:</span>
                  {debugInfo.isMetaMask ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Unknown/No
                    </Badge>
                  )}
                </div>

                <Button onClick={checkMetaMaskStatus} variant="outline" className="w-full">
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Provider Details */}
          {debugInfo.providerDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Provider Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(debugInfo.providerDetails, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Connection Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Direct MetaMask Connection</h4>
                  <Button 
                    onClick={testDirectConnection}
                    disabled={!debugInfo.ethereumExists || isLoading}
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Test Direct Connection
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Context Connection</h4>
                  <Button 
                    onClick={testContextConnection}
                    disabled={!debugInfo.ethereumExists || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Test Context Connection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current State */}
          <Card>
            <CardHeader>
              <CardTitle>Current Web3 State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Connected:</span>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {address && (
                  <div className="flex items-center justify-between">
                    <span>Address:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </code>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Make sure MetaMask browser extension is installed</li>
                <li>Unlock your MetaMask wallet</li>
                <li>Refresh this page if you just installed MetaMask</li>
                <li>Try the "Test Direct Connection" first</li>
                <li>If direct connection works, try "Test Context Connection"</li>
                <li>Check browser console for detailed error messages</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}