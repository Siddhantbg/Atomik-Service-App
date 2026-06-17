import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Header } from './Header';
import { Screen } from './Screen';
import { SafeScrollView } from './SafeScrollView';
import { keyboardBehavior } from '../../utils/layout';

interface Props {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ComponentProps<typeof Header>['rightIcon'];
  onRightPress?: () => void;
  rightBadge?: number;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  keyboard?: boolean;
  tabbed?: boolean;
}

/** Standard screen: safe top via Header + scrollable body with bottom inset. */
export const HeaderScreenLayout: React.FC<Props> = ({
  title,
  showBack,
  showLogo,
  onBackPress,
  rightIcon,
  onRightPress,
  rightBadge,
  children,
  contentStyle,
  keyboard = false,
  tabbed = true,
}) => {
  const body = (
    <SafeScrollView tabbed={tabbed} contentContainerStyle={contentStyle}>
      {children}
    </SafeScrollView>
  );

  return (
    <Screen>
      <Header
        title={title}
        showBack={showBack}
        showLogo={showLogo}
        onBackPress={onBackPress}
        rightIcon={rightIcon}
        onRightPress={onRightPress}
        rightBadge={rightBadge}
      />
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
});
