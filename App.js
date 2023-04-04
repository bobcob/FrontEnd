import { StatusBar } from 'expo-status-bar';
import { Settings, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login'
import signUp from './screens/signUp'
import Circles from './screens/Circles'
import settingsPage from './screens/Settings'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function Main() {
  return (
    <Tab.Navigator initialRouteName="mainNavigation">
      <Tab.Screen name="Circles" component={Circles} />
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Settings" component={settingsPage} />
    </Tab.Navigator>
  );
}


function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoggedOutNav">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
      <Stack.Screen name="signUp" component={signUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;