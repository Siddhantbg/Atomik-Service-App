import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { profileScreenComponents, PROFILE_SCREEN_NAMES } from './profileScreens';
import { defaultStackOptions } from './screenOptions';

const Stack = createNativeStackNavigator();

export const AccountStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackOptions} initialRouteName="ProfileMain">
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    {PROFILE_SCREEN_NAMES.map((name) => (
      <Stack.Screen
        key={name}
        name={name}
        component={profileScreenComponents[name]}
      />
    ))}
  </Stack.Navigator>
);
