import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'ETH' | 'USDC' | 'DAI';

const STORAGE_KEY = '@btc_university_currency';

export function useCurrencyPreference() {
  const [currency, setCurrencyState] = useState<Currency>('ETH');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && ['ETH', 'USDC', 'DAI'].includes(stored)) {
          if (isMounted) {
            setCurrencyState(stored as Currency);
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    AsyncStorage.setItem(STORAGE_KEY, nextCurrency).catch((error) => {
      console.error('[CurrencyPreference] Failed to persist selection', error);
    });
  }, []);

  return { currency, setCurrency, hydrated };
}
