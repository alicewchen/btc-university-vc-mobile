import { useLocation, Link } from "wouter";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { 
  Heart, 
  TrendingUp, 
  ShoppingCart, 
  User 
} from "lucide-react";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export default function BottomNavigation() {
  const [location] = useLocation();
  const { getTotalItems } = useShoppingCart();
  const cartCount = getTotalItems();

  const navItems: NavItem[] = [
    { 
      path: "/discover", 
      icon: Heart, 
      label: "Discover" 
    },
    { 
      path: "/portfolio", 
      icon: TrendingUp, 
      label: "Portfolio" 
    },
    { 
      path: "/cart", 
      icon: ShoppingCart, 
      label: "Cart",
      badge: cartCount 
    },
    { 
      path: "/profile", 
      icon: User, 
      label: "Profile" 
    }
  ];

  const isActive = (path: string) => {
    // Handle root path as discover
    if (location === "/" && path === "/discover") return true;
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-[64px] transition-colors ${
                  active 
                    ? "text-bitcoin-orange" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-bitcoin-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  active ? "font-semibold" : ""
                }`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}