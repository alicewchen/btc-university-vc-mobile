import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwipeInvestingScreen from '@/screens/SwipeInvestingScreen';
import InvestorDashboardScreen from '@/screens/InvestorDashboardScreen';
import ShoppingCartScreen from '@/screens/ShoppingCartScreen';
import InvestorProfileScreen from '@/screens/InvestorProfileScreen';
import {
  Heart,
  LineChart,
  ShoppingCart,
  User,
  HelpCircle,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconProps = { color, size, strokeWidth: focused ? 2.4 : 2 };

          switch (route.name) {
            case 'Discover':
              return <Heart {...iconProps} />;
            case 'Portfolio':
              return <LineChart {...iconProps} />;
            case 'Cart':
              return <ShoppingCart {...iconProps} />;
            case 'Profile':
              return <User {...iconProps} />;
            default:
              return <HelpCircle {...iconProps} />;
          }
        },
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Discover" 
        component={SwipeInvestingScreen}
        options={{ title: 'Discover Opportunities' }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={InvestorDashboardScreen}
        options={{ title: 'Portfolio' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={ShoppingCartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={InvestorProfileScreen}
        options={{ title: 'Investor Profile' }}
      />
    </Tab.Navigator>
  );
}
