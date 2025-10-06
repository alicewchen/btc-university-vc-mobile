import TestWallet from '@/components/TestWallet';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function TestWalletPage() {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (!isDevelopment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Development Only</h2>
            <p className="text-gray-600">
              Test wallet functionality is only available in development mode.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test Wallet Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick access to pre-configured test accounts for development and testing
          </p>
        </div>
        
        <TestWallet 
          onTestLogin={(account) => {
            console.log('Test login successful for:', account.name);
            // Could trigger a page refresh or state update here
          }}
        />
        
        <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-medium text-orange-800 mb-2">Development Notes</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Test accounts simulate different investor profiles and preferences</li>
            <li>• Investment data will be tracked in the development database</li>
            <li>• Real wallet connections override test mode automatically</li>
            <li>• Test mode is only available in development builds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}