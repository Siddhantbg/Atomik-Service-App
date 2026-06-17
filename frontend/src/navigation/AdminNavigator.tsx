import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { AdminBookingDetailScreen } from '../screens/admin/AdminBookingDetailScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminVenuesScreen } from '../screens/admin/AdminVenuesScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { NotificationsScreen } from '../screens/client/NotificationsScreen';
import { defaultStackOptions } from './screenOptions';
import { PROFILE_SCREEN_NAMES, profileScreenComponents } from './profileScreens';
import { createTabBarScreenOptions } from './tabBarOptions';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} />
    <Stack.Screen name="AdminBookingDetail" component={AdminBookingDetailScreen} />
    <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
    <Stack.Screen name="AdminVenues" component={AdminVenuesScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const BookingsStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen name="AdminBookingsList" component={AdminBookingsScreen} />
    <Stack.Screen name="AdminBookingDetail" component={AdminBookingDetailScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const AdminTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator screenOptions={createTabBarScreenOptions(insets)}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AdminNavigator: React.FC = () => (
  <RootStack.Navigator screenOptions={defaultStackOptions}>
    <RootStack.Screen
      name="AdminTabs"
      component={AdminTabs}
      options={{ headerShown: false }}
    />
    {PROFILE_SCREEN_NAMES.map((name) => (
      <RootStack.Screen
        key={name}
        name={name}
        component={profileScreenComponents[name]}
      />
    ))}
  </RootStack.Navigator>
);
