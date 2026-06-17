import { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, TAB_BAR_CONTENT_HEIGHT } from '../utils/layout';

export function useLayoutInsets() {
  const insets = useSafeAreaInsets();

  return useMemo(
    () => ({
      ...insets,
      /** Use on custom top bars (dashboards, auth) — below notch/status bar. */
      topBarStyle: {
        paddingTop: insets.top + 8,
        paddingLeft: insets.left + SPACING.screenH,
        paddingRight: insets.right + SPACING.screenH + 6,
      } satisfies ViewStyle,
      /** Use on Header wrapper (Header component applies this). */
      headerTopPadding: insets.top,
      /** ScrollView / form bottom padding inside tab stacks. */
      scrollBottomPadding: Math.max(insets.bottom, 12) + SPACING.scrollBottom,
      /** Full-screen stacks without tab bar (e.g. admin profile modals). */
      scrollBottomPaddingFullScreen: Math.max(insets.bottom, 12) + SPACING.scrollBottomExtra,
      tabBarHeight: TAB_BAR_CONTENT_HEIGHT + Math.max(insets.bottom, 8),
    }),
    [insets]
  );
}
