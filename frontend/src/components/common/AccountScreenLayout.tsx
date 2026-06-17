import React from 'react';
import {
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header } from './Header';
import { Screen } from './Screen';
import { SafeScrollView } from './SafeScrollView';
import { keyboardBehavior } from '../../utils/layout';
import { useIsTabbedRoute } from '../../hooks/useIsTabbedRoute';

interface Props {
  title: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  keyboard?: boolean;
  /** Override tab detection for scroll bottom inset */
  fullScreen?: boolean;
}

export const AccountScreenLayout: React.FC<Props> = ({
  title,
  children,
  contentStyle,
  keyboard = false,
  fullScreen: fullScreenProp,
}) => {
  const isTabbed = useIsTabbedRoute();
  const tabbed = fullScreenProp === undefined ? isTabbed : !fullScreenProp;

  const body = (
    <SafeScrollView
      tabbed={tabbed}
      style={styles.scroll}
      contentContainerStyle={StyleSheet.flatten([styles.scrollContent, contentStyle])}
    >
      {children}
    </SafeScrollView>
  );

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Header showBack title={title} />
      {keyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 0,
  },
});
