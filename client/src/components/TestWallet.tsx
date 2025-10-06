import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, User, TestTube } from 'lucide-react';
import { useActiveWallet, useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";

// Test user accounts for development
const TEST_ACCOUNTS = [
  {
    id: 'test-user-1',
    name: 'Test Investor Alice',
    address: '0xea28C6D767F3E203Ef4de0379086d81c5CcecFF0',
    balance: '1000.0',
    description: 'Heavy DeFi investor with portfolio focus on biotechnology and climate tech',
    riskTolerance: 'moderate',
    investmentPreferences: ['Biotechnology', 'Climate Tech', 'DeFi']
  },
  {
    id: 'test-user-2', 
    name: 'Test Investor Bob',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    balance: '10000.0',
    description: 'Crypto whale interested in AI safety and quantum computing research',
    riskTolerance: 'high',
    investmentPreferences: ['AI Safety', 'Quantum Computing', 'Space Technology']
  },
  {
    id: 'test-user-3',
    name: 'Test Investor Carol',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    balance: '500.0',
    description: 'Conservative investor focused on sustainable agriculture and ocean conservation',
    riskTolerance: 'low',
    investmentPreferences: ['Agriculture', 'Ocean Conservation', 'Sustainability']
  }
];

interface TestWalletProps {
  onTestLogin?: (account: typeof TEST_ACCOUNTS[0]) => void;
  className?: string;
}

export default function TestWallet({ onTestLogin, className = '' }: TestWalletProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const { connect } = useConnect();

  const handleTestLogin = async (testAccount: typeof TEST_ACCOUNTS[0]) => {
    setIsConnecting(true);
    setSelectedAccount(testAccount.id);
    
    try {
      // Store test account data in localStorage for persistence
      localStorage.setItem('test-user-data', JSON.stringify({
        ...testAccount,
        isTestUser: true,
        loginTime: new Date().toISOString()
      }));
      
      // Store wallet address for custom Web3Context compatibility
      localStorage.setItem('test-wallet-address', testAccount.address);
      
      // Connect using thirdweb inAppWallet with JWT strategy for testing
      const testWallet = inAppWallet();
      
      // Connect the wallet through thirdweb using a test JWT
      await connect(async () => {
        await testWallet.connect({
          client,
          strategy: "jwt",
          jwt: `test-jwt-${testAccount.id}`, // Simple test token
        });
        return testWallet;
      });
      
      // Fire callback if provided
      if (onTestLogin) {
        onTestLogin(testAccount);
      }
      
      console.log('Test login successful for:', testAccount.name);
    } catch (error) {
      console.error('Test login failed:', error);
      localStorage.removeItem('test-user-data');
      localStorage.removeItem('test-wallet-address');
      setSelectedAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const clearTestSession = () => {
    setSelectedAccount(null);
    localStorage.removeItem('test-user-data');
    localStorage.removeItem('test-wallet-address');
    console.log('Test session cleared');
  };

  // Check if already connected to real wallet
  const isRealWalletConnected = wallet && account?.address;

  return (
    <Card className={`w-full max-w-2xl ${className}`} data-testid="test-wallet-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Test Wallet Login
          <Badge variant="outline" className="ml-2">Development Only</Badge>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>Quick login with pre-configured test accounts for development</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isRealWalletConnected && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              ✅ Real wallet connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Test accounts are disabled when real wallet is connected
            </p>
          </div>
        )}
        
        <div className="grid gap-3">
          {TEST_ACCOUNTS.map((testAccount) => (
            <div 
              key={testAccount.id}
              className={`p-4 border rounded-lg transition-all ${
                selectedAccount === testAccount.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              data-testid={`test-account-${testAccount.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <h4 className="font-medium">{testAccount.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {testAccount.riskTolerance}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {testAccount.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Address: {testAccount.address.slice(0, 10)}...</span>
                    <span>Balance: {testAccount.balance} ETH</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {testAccount.investmentPreferences.map((pref) => (
                      <Badge key={pref} variant="outline" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {selectedAccount === testAccount.id ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={clearTestSession}
                      data-testid={`logout-${testAccount.id}`}
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleTestLogin(testAccount)}
                      disabled={!!isRealWalletConnected || isConnecting}
                      data-testid={`login-${testAccount.id}`}
                    >
                      {isConnecting ? 'Connecting...' : 'Test Login'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedAccount && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              🧪 Test session active
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Your test investment data will be tracked under this account. 
              Real wallet connections will override test sessions.
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Test accounts come pre-loaded with investment preferences and risk profiles</p>
          <p>• Test investments will be tracked in the database for development testing</p>
          <p>• Connect a real wallet to disable test mode</p>
        </div>
      </CardContent>
    </Card>
  );
}