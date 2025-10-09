import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import DAODetailScreen from '../screens/DAODetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DAODetail" 
          component={DAODetailScreen}
          options={{
            title: 'DAO Details',
            headerStyle: {
              backgroundColor: '#FF6B35',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
