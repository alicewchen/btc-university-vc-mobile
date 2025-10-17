import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveAccount } from '@/lib/solanaWallet';

export interface CartItem {
  id: string;
  targetType: 'dao' | 'grant' | 'scholarship';
  targetId: string;
  targetName: string;
  amount: string;
  currency: string;
  description?: string;
  addedAt: string;
}

interface ShoppingCartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  updateItemAmount: (itemId: string, amount: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getCartKey: () => string;
}

const ShoppingCartContext = createContext<ShoppingCartContextValue | undefined>(undefined);

const CART_STORAGE_PREFIX = '@btc_university_cart:';

const loadCartFromStorage = async (storageKey: string) => {
  try {
    const stored = await AsyncStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as CartItem[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('[ShoppingCart] Failed to load cart', error);
  }
  return [];
};

const saveCartToStorage = async (storageKey: string, items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(items));
  } catch (error) {
    console.error('[ShoppingCart] Failed to persist cart', error);
  }
};

export function ShoppingCartProvider({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  const [items, setItems] = useState<CartItem[]>([]);

  const getCartKey = useCallback(() => {
    const suffix = account?.address?.toLowerCase() ?? 'anonymous';
    return `${CART_STORAGE_PREFIX}${suffix}`;
  }, [account?.address]);

  useEffect(() => {
    let isMounted = true;
    const cartKey = getCartKey();

    loadCartFromStorage(cartKey).then((storedItems) => {
      if (isMounted) {
        setItems(storedItems);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getCartKey]);

  useEffect(() => {
    const cartKey = getCartKey();
    saveCartToStorage(cartKey, items);
  }, [items, getCartKey]);

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'addedAt'>) => {
    setItems((prev) => {
      const exists = prev.some(
        (entry) =>
          entry.targetType === item.targetType &&
          entry.targetId === item.targetId &&
          entry.amount === item.amount &&
          entry.currency === item.currency,
      );

      if (exists) {
        return prev;
      }

      const newItem: CartItem = {
        ...item,
        id: `${item.targetType}_${item.targetId}_${Date.now()}`,
        addedAt: new Date().toISOString(),
      };

      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateItemAmount = useCallback((itemId: string, amount: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, amount } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<ShoppingCartContextValue>(() => {
    const getTotalItems = () => items.length;
    const getTotalAmount = () =>
      items.reduce((total, item) => total + parseFloat(item.amount || '0'), 0);

    return {
      items,
      addItem,
      removeItem,
      updateItemAmount,
      clearCart,
      getTotalItems,
      getTotalAmount,
      getCartKey,
    };
  }, [items, addItem, removeItem, updateItemAmount, clearCart, getCartKey]);

  return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>;
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
}
