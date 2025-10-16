import 'react-native-gesture-handler'; // Must be at the top
import type { ComponentProps } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import { theme } from '@/config/theme';
import { queryClient } from '@/config/queryClient';
import { ThirdwebProvider } from '@/lib/thirdweb';
import { ShoppingCartProvider } from '@/contexts/ShoppingCartContext';
import { ToastProvider } from '@/contexts/ToastContext';

type MaterialIconProps = ComponentProps<typeof MaterialDesignIcons> & {
  direction?: 'ltr' | 'rtl';
  [key: string]: unknown;
};

const paperProviderSettings = {
  icon: (props: MaterialIconProps) => <MaterialDesignIcons {...props} />,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme} settings={paperProviderSettings}>
            <ShoppingCartProvider>
              <ToastProvider>
                <RootNavigator />
                <StatusBar style="dark" />
              </ToastProvider>
            </ShoppingCartProvider>
          </PaperProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </SafeAreaProvider>
  );
}
