import { Dimensions, Platform, ViewStyle } from 'react-native';

/** Visible tab bar content (icons + labels), excluding system inset. */
export const TAB_BAR_CONTENT_HEIGHT = 56;

export const SPACING = {
  screenH: 20,
  screenHWide: 24,
  scrollBottom: 32,
  scrollBottomExtra: 48,
  headerBottom: 14,
} as const;

const { width, height } = Dimensions.get('window');

export const SCREEN = {
  width,
  height,
  isSmall: width < 360,
  isTablet: width >= 768,
} as const;

/** Scale spacing slightly on small phones without hardcoding device models. */
export function scaleSize(base: number): number {
  if (SCREEN.isTablet) return Math.round(base * 1.15);
  if (SCREEN.isSmall) return Math.round(base * 0.92);
  return base;
}

export function mergeContentContainerStyle(
  bottomInset: number,
  extra?: ViewStyle
): ViewStyle {
  return {
    flexGrow: 1,
    paddingBottom: Math.max(SPACING.scrollBottom, bottomInset + SPACING.scrollBottom),
    ...extra,
  };
}

export const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
