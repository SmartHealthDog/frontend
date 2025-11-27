import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import WalkScreen from '../screens/WalkScreen';
import HealthScreen from '../screens/HealthScreen';
import MyScreen from '../screens/MyPageScreen';
import AdoptScreen from '../screens/AdoptScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarShowLabel: true,

 
        tabBarLabel: ({ focused }: any) => (
          <Text
            style={{
              fontSize: 11,
              color: focused ? '#0081D5' : '#C4C4C4',
              marginBottom: 3,
              fontWeight: focused ? '600' : '400',
            }}
          >
            {route.name}
          </Text>
        ),

   
        tabBarIcon: ({ focused }: any) => {
          let icon;

          switch (route.name) {
            case '홈':
              icon = require('../assets/image/icons/Home.png');
              break;
            case '산책':
              icon = require('../assets/image/icons/Walk.png');
              break;
            case '입양':
              icon = require('../assets/image/icons/Adopt.png');
              break;
            case '건강':
              icon = require('../assets/image/icons/Health.png');
              break;
            case '마이':
              icon = require('../assets/image/icons/My.png');
              break;
          }

          return (
            <Image
              source={icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#0081D5' : '#C4C4C4',
              }}
              resizeMode="contain"
            />
          );
        },

    
        tabBarStyle: {
          height: 89,
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 6,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 8,
          position: 'absolute',
          width: '100%',
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="산책" component={WalkScreen} />
      <Tab.Screen name="입양" component={AdoptScreen} />
      <Tab.Screen name="건강" component={HealthScreen} />
      <Tab.Screen name="마이" component={MyScreen} />
    </Tab.Navigator>
  );
}
