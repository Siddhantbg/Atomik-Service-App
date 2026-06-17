import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from './Screen';
import { COLORS } from '../../constants/colors';

export const LoadingView: React.FC = () => (
  <Screen edges={['top', 'left', 'right', 'bottom']} style={styles.center}>
    <ActivityIndicator size="large" color={COLORS.red} />
  </Screen>
);

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
