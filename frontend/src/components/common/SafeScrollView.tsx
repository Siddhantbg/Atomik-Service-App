import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';

interface Props extends ScrollViewProps {
  /** Set false for full-screen stacks with no bottom tab (admin profile push). */
  tabbed?: boolean;
  contentContainerStyle?: ViewStyle;
}

export const SafeScrollView: React.FC<Props> = ({
  tabbed = true,
  contentContainerStyle,
  children,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  ...rest
}) => {
  const { scrollBottomPadding, scrollBottomPaddingFullScreen } = useLayoutInsets();
  const bottomPad = tabbed ? scrollBottomPadding : scrollBottomPaddingFullScreen;

  return (
    <ScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPad },
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
