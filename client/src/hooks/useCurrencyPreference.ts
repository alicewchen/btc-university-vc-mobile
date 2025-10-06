import { useState } from 'react';

export type Currency = 'ETH' | 'USDC' | 'DAI';

export function useCurrencyPreference() {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Load currency preference from localStorage on initial render
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedCurrency') as Currency;
      if (stored && ['ETH', 'USDC', 'DAI'].includes(stored)) {
        return stored;
      }
    }
    return 'ETH'; // Default to ETH
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  return { currency, setCurrency };
}