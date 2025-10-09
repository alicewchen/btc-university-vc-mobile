import 'react-native-gesture-handler'; // Must be at the top
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/config/theme';
import { queryClient } from './src/config/queryClient';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <RootNavigator />
          <StatusBar style="auto" />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
