import 'react-native-gesture-handler'; // Must be at the top
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import { theme } from '@/config/theme';
import { queryClient } from '@/config/queryClient';
import { ThirdwebProvider } from '@/lib/thirdweb';
import { ShoppingCartProvider } from '@/contexts/ShoppingCartContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
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
