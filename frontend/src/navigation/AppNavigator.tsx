import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { AuthNavigator } from './AuthNavigator';
import { COLORS } from '../constants/colors';
import { RootState } from '../store';
import { ClientNavigator } from './ClientNavigator';
import { TechNavigator } from './TechNavigator';
import { AdminNavigator } from './AdminNavigator';
import { RoleGuard } from '../components/auth/RoleGuard';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { rootStackOptions } from './screenOptions';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isOnboarded, user, initializing } = useSelector(
    (state: RootState) => state.auth
  );

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={rootStackOptions}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : user?.role === 'technician' || user?.role === 'master_technician' ? (
          <Stack.Screen name="Tech">
            {() => (
              <RoleGuard allowedRoles={['technician', 'master_technician']}>
                <TechNavigator />
              </RoleGuard>
            )}
          </Stack.Screen>
        ) : user?.role === 'admin' ? (
          <Stack.Screen name="Admin">
            {() => (
              <RoleGuard allowedRole="admin">
                <AdminNavigator />
              </RoleGuard>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Client">
            {() => (
              <RoleGuard allowedRole="client">
                <ClientNavigator />
              </RoleGuard>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
