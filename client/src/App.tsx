import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/contexts/Web3Context";
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThirdwebProvider } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import BottomNavigation from "@/components/mobile/BottomNavigation";
import SwipeInvesting from "@/pages/SwipeInvesting";
import InvestorDashboard from "@/pages/InvestorDashboard";
import ShoppingCart from "@/pages/ShoppingCart";
import InvestorProfile from "@/pages/InvestorProfile";
import TestWalletPage from "@/pages/TestWallet";
import WalletOnboarding from "@/pages/WalletOnboarding";
import NotFound from "@/pages/not-found";

function MobileRouter() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 pb-16"> {/* Padding bottom for bottom nav */}
        <Switch>
          <Route path="/" component={SwipeInvesting} />
          <Route path="/discover" component={SwipeInvesting} />
          <Route path="/portfolio" component={InvestorDashboard} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/profile" component={InvestorProfile} />
          <Route path="/test-wallet" component={TestWalletPage} />
          <Route path="/wallet-onboarding" component={WalletOnboarding} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <ThirdwebProvider>
      {/* Note: client and wallets are configured in the ConnectButton components */}
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ShoppingCartProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <MobileRouter />
              </TooltipProvider>
            </ThemeProvider>
          </ShoppingCartProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}

export default App;