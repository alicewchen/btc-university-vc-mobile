import { ConnectButton } from "thirdweb/react";
import { client, wallets, bitcoinUniversityTheme } from "@/lib/thirdweb";
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle } from 'lucide-react';

interface ThirdwebWalletConnectionProps {
  variant?: 'default' | 'compact' | 'button-only';
  showBalance?: boolean;
  className?: string;
}

export default function ThirdwebWalletConnection({ 
  variant = 'default',
  showBalance = true,
  className = '' 
}: ThirdwebWalletConnectionProps) {
  
  if (variant === 'button-only') {
    return (
      <div className={`flex items-center gap-2 ${className}`} data-testid="wallet-connection-button">
        <ConnectButton
          client={client}
          connectButton={{ 
            label: (
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </div>
            )
          }}
          connectModal={{ size: "compact" }}
          theme={bitcoinUniversityTheme}
          wallets={wallets}
          detailsButton={{
            displayBalanceToken: showBalance ? {} : undefined
          }}
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`} data-testid="wallet-connection-compact">
        <ConnectButton
          client={client}
          connectButton={{ 
            label: (
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect
              </div>
            )
          }}
          connectModal={{ size: "compact" }}
          theme={bitcoinUniversityTheme}
          wallets={wallets}
          detailsButton={{
            displayBalanceToken: showBalance ? {} : undefined,
            style: {
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem"
            }
          }}
        />
      </div>
    );
  }

  // Default variant - full featured
  return (
    <div className={`w-full ${className}`} data-testid="wallet-connection-default">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Connect your wallet to participate in DAO governance, vote on proposals, and manage your tokens.
        </p>
        
        <ConnectButton
          client={client}
          connectButton={{ 
            label: "Connect Wallet",
            style: {
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              fontWeight: "500"
            }
          }}
          connectModal={{ 
            size: "wide",
            title: "Connect to Bitcoin University",
            showThirdwebBranding: false
          }}
          theme={bitcoinUniversityTheme}
          wallets={wallets}
          detailsButton={{
            displayBalanceToken: showBalance ? {} : undefined,
            style: {
              width: "100%",
              padding: "0.75rem 1rem",
              justifyContent: "space-between"
            }
          }}
        />
        
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-orange-800">Multi-Chain Support</p>
              <p className="text-xs text-orange-600">
                Connect with MetaMask, Coinbase Wallet, or sign in with Google, Discord, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}