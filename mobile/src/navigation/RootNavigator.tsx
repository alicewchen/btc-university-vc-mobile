import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import WalletOnboardingScreen from '@/screens/WalletOnboardingScreen';
import TestWalletScreen from '@/screens/TestWalletScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WalletOnboarding"
          component={WalletOnboardingScreen}
          options={{ title: 'Wallet Onboarding' }}
        />
        <Stack.Screen
          name="TestWallet"
          component={TestWalletScreen}
          options={{ title: 'Test Wallet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
