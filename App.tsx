/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
//import 'react-native-gesture-handler';

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
import TabNavigator from './src/navigation/TabBar';
import AnimalDetailScreen from './src/screens/AnimalDetailScreen';
import SymptomResultScreen from './src/screens/SymptomResultScreen';
import EyeDiagnosisScreen from './src/screens/EyeDiagnosisScreen';
import UrineDiagnosisScreen from './src/screens/UrineDiagnosisScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import GameScreen from './src/screens/GameScreen';
import PetEditScreen from './src/screens/PetEditScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import WalkLogDetailScreen from './src/screens/WalkLogDetailScreen';
import WalkWeeklyReportScreen from './src/screens/WalkWeeklyReportScreen';
import WalkActiveScreen from './src/screens/WalkActiveScreen';




export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  SymptomResult: undefined;
  EyeDiagnosis: undefined;
  UrineDiagnosis: undefined;
  MyPage: undefined;
  GameScreen: undefined; 
  PetEdit: undefined; 
  ProfileEdit: undefined;
  UserSignup: {
    email: string;
    password: string;
    verificationCode: string;
  };
  PetSignup: {
    email: string;
    password: string;
    verificationCode: string;
    nickname: string;
  };
  Main: undefined;
  AnimalDetail: {
    animalData: {
      type: '강아지' | '고양이';
      tags: string[];
      breed: string;
      age: string;
      location: string;
      image: any;
    };
  };
  WalkLogDetail: {
    record: {
      id: number;
      petName: string;
      petImage: any;
      date: string;
      distance: string;
      duration: string;
      startTime?: string;
      endTime?: string;
    };
  };
  WalkWeeklyReport: undefined;
  WalkActive: {
    petName: string;
    petImage: any;
  };
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
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
          <Stack.Screen name="SymptomResult" component={SymptomResultScreen} />
          <Stack.Screen name="EyeDiagnosis" component={EyeDiagnosisScreen} />
          <Stack.Screen name="UrineDiagnosis" component={UrineDiagnosisScreen} />
          <Stack.Screen name="MyPage" component={MyPageScreen} />
          <Stack.Screen name="GameScreen" component={GameScreen} />
          <Stack.Screen name="PetEdit" component={PetEditScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen name="WalkLogDetail" component={WalkLogDetailScreen} />
          <Stack.Screen name="WalkWeeklyReport" component={WalkWeeklyReportScreen} />
          <Stack.Screen name="WalkActive" component={WalkActiveScreen} />



        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
