import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";

export interface CartItem {
  id: string;
  targetType: "dao" | "grant" | "scholarship";
  targetId: string;
  targetName: string;
  amount: string; // Amount to invest
  currency: string;
  description?: string;
  addedAt: string;
}

interface ShoppingCartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (itemId: string) => void;
  updateItemAmount: (itemId: string, amount: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getCartKey: () => string;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | null>(null);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}

interface ShoppingCartProviderProps {
  children: ReactNode;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const account = useActiveAccount();
  const [items, setItems] = useState<CartItem[]>([]);

  // Create unique cart key for each wallet
  const getCartKey = () => {
    return account?.address ? `cart_${account.address}` : "cart_anonymous";
  };

  // Load cart from localStorage on wallet change
  useEffect(() => {
    if (account?.address) {
      const savedCart = localStorage.getItem(getCartKey());
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [account?.address]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (account?.address) {
      localStorage.setItem(getCartKey(), JSON.stringify(items));
    }
  }, [items, account?.address]);

  const addItem = (newItem: Omit<CartItem, "id" | "addedAt">) => {
    const id = `${newItem.targetType}_${newItem.targetId}_${Date.now()}`;
    const cartItem: CartItem = {
      ...newItem,
      id,
      addedAt: new Date().toISOString()
    };

    // Check if similar item already exists (same target and amount)
    const existingItemIndex = items.findIndex(
      item => 
        item.targetType === newItem.targetType && 
        item.targetId === newItem.targetId && 
        item.amount === newItem.amount &&
        item.currency === newItem.currency
    );

    if (existingItemIndex >= 0) {
      // Don't add duplicate, just return
      return;
    }

    setItems(prevItems => [...prevItems, cartItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItemAmount = (itemId: string, amount: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, amount } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);
  };

  const value: ShoppingCartContextType = {
    items,
    addItem,
    removeItem,
    updateItemAmount,
    clearCart,
    getTotalItems,
    getTotalAmount,
    getCartKey
  };

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
}