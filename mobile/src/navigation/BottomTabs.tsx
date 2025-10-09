import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CreateDAOScreen from '../screens/CreateDAOScreen';
import WalletScreen from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Ethereum Nature Reserve' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore DAOs' }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateDAOScreen}
        options={{ title: 'Create DAO' }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ title: 'Wallet' }}
      />
    </Tab.Navigator>
  );
}
