import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

type Edge = 'top' | 'right' | 'bottom' | 'left';

interface Props extends SafeAreaViewProps {
  children: React.ReactNode;
  /** Default: left + right only — top handled by Header / ScreenTopBar. */
  edges?: Edge[];
  style?: ViewStyle;
}

/**
 * Root screen container. Prefer edges without `top` when using Header or ScreenTopBar.
 */
export const Screen: React.FC<Props> = ({
  children,
  edges = ['left', 'right'],
  style,
  ...rest
}) => (
  <SafeAreaView
    style={[styles.screen, style]}
    edges={edges}
    {...rest}
  >
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
