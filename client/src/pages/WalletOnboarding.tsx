import { EmailWalletOnboarding } from "@/components/EmailWalletOnboarding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Shield, Zap, Globe } from "lucide-react";

export default function WalletOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coins className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Bitcoin University
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Web3 Research & Development Marketplace
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Sepolia Testnet
          </Badge>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center" data-testid="card-feature-instant">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Instant Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get a pre-funded Sepolia testnet wallet instantly with just your email. No manual setup required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-feature-secure">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your private keys are securely generated and stored. Perfect for testing Web3 applications safely.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-feature-research">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Research Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Jump straight into exploring DAOs, research projects, and conservation initiatives on our platform.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Onboarding Component */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Information */}
          <div className="lg:w-1/2 space-y-6">
            <Card data-testid="card-how-it-works">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-orange-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-orange-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Enter Your Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Provide your email address to claim a pre-generated wallet
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-orange-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Get Your Wallet</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Instantly receive wallet address and private key for Sepolia testnet
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-orange-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Start Exploring</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Use your wallet to participate in research DAOs and funding opportunities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" data-testid="card-testnet-info">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">Testnet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• <strong>Network:</strong> Sepolia Testnet (Chain ID: 11155111)</li>
                  <li>• <strong>Purpose:</strong> Testing and development only</li>
                  <li>• <strong>Funding:</strong> Pre-funded with test ETH for transactions</li>
                  <li>• <strong>Security:</strong> Safe for testing, not for real assets</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Onboarding Component */}
          <div className="lg:w-1/2 flex justify-center" data-testid="section-onboarding">
            <EmailWalletOnboarding />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Bitcoin University - Research-Institution-as-a-Service for Web3 Conservation
          </p>
        </div>
      </div>
    </div>
  );
}