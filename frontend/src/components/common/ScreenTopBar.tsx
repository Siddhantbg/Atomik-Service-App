import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Dashboard-style top row — respects notch / status bar. */
export const ScreenTopBar: React.FC<Props> = ({ children, style }) => {
  const { topBarStyle } = useLayoutInsets();
  return <View style={[styles.bar, topBarStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    minHeight: 52,
    overflow: 'visible',
  },
});
