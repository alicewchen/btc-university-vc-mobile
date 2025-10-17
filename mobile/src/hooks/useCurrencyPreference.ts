import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'SOL' | 'USDC' | 'USDT';

const STORAGE_KEY = '@btc_university_currency';
const SUPPORTED_CURRENCIES: Currency[] = ['SOL', 'USDC', 'USDT'];

const isSupportedCurrency = (value: string | null): value is Currency =>
  !!value && SUPPORTED_CURRENCIES.includes(value as Currency);

export function useCurrencyPreference() {
  const [currency, setCurrencyState] = useState<Currency>('SOL');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isMounted && isSupportedCurrency(stored)) {
          setCurrencyState(stored);
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
