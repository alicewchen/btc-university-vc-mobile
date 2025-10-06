import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu, Wallet } from "lucide-react";
import ThirdwebWalletConnection from "./ThirdwebWalletConnection";

const baseNavItems = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Research" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/learn", label: "Learn" },
  { href: "/teach", label: "Teach" },
  { href: "/invest", label: "Invest" },
  { href: "/governance", label: "Governance" },
  { href: "/nature-reserve", label: "About" },
];

// Add test wallet for development
const navItems = import.meta.env.MODE === 'development' 
  ? [...baseNavItems, { href: "/test-wallet", label: "🧪 Test Wallet" }]
  : baseNavItems;

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Wallet connection handled by WalletConnection component

  return (
    <nav className="bg-white dark:bg-charcoal shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <GraduationCap className="h-8 w-8 text-bitcoin-orange mr-3" />
            <span className="text-xl font-bold text-charcoal dark:text-white">Bitcoin University</span>
          </Link>

          {/* Hamburger Menu */}
          <div className="flex items-center space-x-2">
            <ThirdwebWalletConnection variant="compact" showBalance={false} />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-charcoal hover:text-bitcoin-orange"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-1 mt-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-charcoal">
                      Bitcoin University
                    </h2>
                    <p className="text-sm text-gray-600">
                      Research & Innovation
                    </p>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        location === item.href
                          ? "text-bitcoin-orange bg-light-orange"
                          : "text-charcoal hover:text-bitcoin-orange hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <ThirdwebWalletConnection variant="button-only" className="w-full" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
