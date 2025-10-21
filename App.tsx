/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import OrdinaryLogin from './src/screens/OrdinaryLogin';
import OrdinarySignup from './src/screens/OrdinarySignup';
import UserSignup from './src/screens/UserSignup';
import PetSignup from './src/screens/PetSignup';

export type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  UserSignup: undefined;
  PetSignup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OrdinaryLogin" component={OrdinaryLogin} />
          <Stack.Screen name="OrdinarySignup" component={OrdinarySignup} />
          <Stack.Screen name="UserSignup" component={UserSignup} />
          <Stack.Screen name="PetSignup" component={PetSignup} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
